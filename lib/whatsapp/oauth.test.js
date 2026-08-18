// lib/whatsapp/oauth.test.js
//
// ponytail: contract tests for the Meta OAuth-ready bridge. Every
// public function has at least 2 tests: one happy-path and one
// diagnose-path. Diagnostic codes are stable strings (e.g.
// "oauth.code.missing") — telemetry must bucket on those, never on
// raw error messages.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAuthorizeUrl,
  signStateCookie,
  verifyStateCookie,
  startOAuthState,
  verifyOAuthState,
  exchangeCodeForToken,
  upgradeLongLivedToken,
  debugToken,
  discoverWabas,
  summarizeBusinesses,
  assignWhatsappBusinessProfile,
  startInstagramLink,
  verifyInstagramLinkCallback,
  IG_LINK_PHASES,
  markProfileValidated,
  DIAGNOSTIC_CODES,
  __internals
} from './oauth.js';

const okEnv = {
  META_APP_ID: '111222333444555',
  META_APP_SECRET: 'supersecret',
  META_REDIRECT_URI: 'https://ironwake.local/api/oauth/meta/callback',
  META_API_VERSION: 'v20.0'
};

const bogusFetcher = (url, init) => {
  return {
    url,
    init,
    ok: true,
    status: 200,
    async json() {
      throw new Error('json not called');
    }
  };
};

// ----- 1. AUTHORIZE -----------------------------------------------------

test('buildAuthorizeUrl reads env and produces a Meta facebook.com URL', () => {
  const r = buildAuthorizeUrl(okEnv, { scope: ['whatsapp_business_management'] });
  assert.equal(r.ok, true);
  const u = new URL(r.url);
  assert.equal(u.host, 'www.facebook.com');
  assert.match(u.pathname, /\/v20\.0\/dialog\/oauth$/);
  assert.equal(u.searchParams.get('client_id'), okEnv.META_APP_ID);
  assert.equal(u.searchParams.get('redirect_uri'), okEnv.META_REDIRECT_URI);
  assert.equal(u.searchParams.get('response_type'), 'code');
  assert.equal(u.searchParams.get('state'), r.state);
  assert.equal(u.searchParams.get('scope').includes('whatsapp_business_management'), true);
});

test('buildAuthorizeUrl generates a 22+ char state when none is provided', () => {
  const r = buildAuthorizeUrl(okEnv, { scope: 'whatsapp_business_management' });
  assert.ok(r.state && r.state.length >= 16);
  // State is base64url → no `+ / =` chars.
  assert.equal(/[+/=]/.test(r.state), false);
});

test('buildAuthorizeUrl rejects malformed (too short) explicit state', () => {
  const r = buildAuthorizeUrl(okEnv, { state: 'x' });
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.state_invalid);
});

test('buildAuthorizeUrl returns env_missing when env is bare', () => {
  const r = buildAuthorizeUrl({});
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.env_missing);
  assert.ok(r.missing.includes('META_APP_ID'));
  assert.ok(r.missing.includes('META_APP_SECRET'));
  assert.ok(r.missing.includes('META_REDIRECT_URI'));
});

test('buildAuthorizeUrl filters scopes that fail the regex and reports them', () => {
  const r = buildAuthorizeUrl(okEnv, { scope: ['whatsapp_business_management', 'OPEN THIS', 'a..b'] });
  assert.equal(r.ok, true);
  const u = new URL(r.url);
  assert.equal(u.searchParams.get('scope').includes('whatsapp_business_management'), true);
  assert.equal(u.searchParams.get('scope').includes('OPEN THIS'), false);
  assert.equal(u.searchParams.get('scope').includes('a..b'), false);
  assert.ok(r.diagnostics.invalidScopes.includes('OPEN THIS'));
  assert.ok(r.diagnostics.invalidScopes.includes('a..b'));
});

test('buildAuthorizeUrl uses default scopes when scope is empty', () => {
  const r = buildAuthorizeUrl(okEnv, {});
  const u = new URL(r.url);
  assert.equal(u.searchParams.get('scope').includes('whatsapp_business_management'), true);
  assert.equal(u.searchParams.get('scope').includes('whatsapp_business_messaging'), true);
});

test('buildAuthorizeUrl clamps authType to 16 chars', () => {
  const r = buildAuthorizeUrl(okEnv, { authType: 'x'.repeat(60) });
  const u = new URL(r.url);
  assert.equal(u.searchParams.get('auth_type').length, 16);
});

// ----- 2. STATE COOKIE / VERIFY ----------------------------------------

test('signStateCookie produces a cookie with a base64url signature', () => {
  const r = signStateCookie('hello', 'secret');
  assert.equal(r.ok, true);
  assert.equal(r.cookie.startsWith('hello.'), true);
  assert.equal(/[+/=]/.test(r.cookie.split('.')[1] || 'x'), false);
});

test('signStateCookie fails closed on empty secret or bad value', () => {
  assert.equal(signStateCookie('hello', '').ok, false);
  assert.equal(signStateCookie(undefined, 's').ok, false);
});

test('verifyStateCookie returns untrusted on a tampered signature', () => {
  const sig = signStateCookie('hello', 'secret').cookie;
  const tampered = sig.replace(/.$/u, sig.slice(-1) === 'a' ? 'b' : 'a');
  const r = verifyStateCookie(tampered, 'secret');
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.state_untrusted);
});

test('verifyStateCookie accepts a valid cookie and returns the body', () => {
  const sig = signStateCookie('body', 's').cookie;
  const v = verifyStateCookie(sig, 's');
  assert.equal(v.ok, true);
  assert.equal(v.value, 'body');
});

// ----- 3. STATE LIFECYCLE ----------------------------------------------

test('startOAuthState returns a signed cookie + nonce + 10m default expiry', () => {
  const now = 1_000_000;
  const r = startOAuthState({ secret: 'k', nowMs: now });
  assert.equal(r.ok, true);
  assert.ok(r.state && r.state.length > 0);
  assert.equal(r.issuedAt, now);
  assert.equal(r.expiresAt, now + 600_000);
  assert.ok(r.nonce.length >= 16);
  // Round-trip
  const v = verifyOAuthState({ cookie: r.state, secret: 'k', nowMs: now });
  assert.equal(v.ok, true);
  assert.equal(v.nonce, r.nonce);
});

test('verifyOAuthState rejects an expired cookie', () => {
  const r = startOAuthState({ secret: 'k', nowMs: 1000, ttlMs: 1 });
  const v = verifyOAuthState({ cookie: r.state, secret: 'k', nowMs: 1000 + 500 });
  assert.equal(v.ok, false);
  assert.equal(v.diagnostic, DIAGNOSTIC_CODES.state_expired);
});

test('verifyOAuthState enforces context match', () => {
  const r = startOAuthState({ secret: 'k', context: 'ig-link', nowMs: 1 });
  const v = verifyOAuthState({ cookie: r.state, secret: 'k', expectedContext: 'whatsapp-embed', nowMs: 1 });
  assert.equal(v.ok, false);
});

test('verifyOAuthState rejects a cookie signed with the wrong secret', () => {
  const r = startOAuthState({ secret: 'alpha', nowMs: 1 });
  const v = verifyOAuthState({ cookie: r.state, secret: 'beta', nowMs: 1 });
  assert.equal(v.ok, false);
  assert.equal(v.diagnostic, DIAGNOSTIC_CODES.state_untrusted);
});

test('verifyOAuthState caps ttlMs to an hour', () => {
  const r = startOAuthState({ secret: 'k', nowMs: 1, ttlMs: 24 * 3600 * 1000 });
  assert.equal(r.ok, true);
  assert.ok(r.expiresAt - 1 <= 60 * 60 * 1000 + 1);
});

// ----- 4. EXCHANGE / UPGRADE / DEBUG -----------------------------------

test('exchangeCodeForToken fails closed on missing code', async () => {
  const r = await exchangeCodeForToken({ code: '', env: okEnv });
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.code_missing);
});

test('exchangeCodeForToken parses an access_token response', async () => {
  const fetcher = (url) => ({
    ok: true,
    status: 200,
    async json() {
      // assert URL shape
      assert.match(url, /oauth\/access_token/);
      return { access_token: 'a'.repeat(40), token_type: 'bearer', expires_in: 3600 };
    }
  });
  const r = await exchangeCodeForToken({ code: 'abc', env: okEnv, fetcher });
  assert.equal(r.ok, true);
  assert.equal(r.accessToken.length, 40);
  assert.equal(r.expiresIn, 3600);
});

test('exchangeCodeForToken surfaces Graph error shape', async () => {
  const fetcher = () => ({
    ok: false,
    status: 400,
    async json() {
      return { error: { code: 100, message: 'bad params' } };
    }
  });
  const r = await exchangeCodeForToken({ code: 'abc', env: okEnv, fetcher });
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.fetch_status);
  assert.equal(r.graphError.code, 100);
});

test('exchangeCodeForToken refuses a too-short access_token', async () => {
  const fetcher = () => ({
    ok: true,
    status: 200,
    async json() { return { access_token: 'short' }; }
  });
  const r = await exchangeCodeForToken({ code: 'abc', env: okEnv, fetcher });
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.token_shape);
});

test('upgradeLongLivedToken returns long token + 60d default expiry', async () => {
  const fetcher = (url) => ({
    ok: true,
    status: 200,
    async json() {
      assert.match(url, /grant_type=fb_exchange_token/);
      return { access_token: 'l'.repeat(60), expires_in: 5_184_000 };
    }
  });
  const r = await upgradeLongLivedToken({ accessToken: 's', env: okEnv, fetcher });
  assert.equal(r.ok, true);
  assert.equal(r.expiresIn, 5_184_000);
});

test('upgradeLongLivedToken defaults expiresIn to 60d when missing', async () => {
  const fetcher = () => ({
    ok: true,
    status: 200,
    async json() { return { access_token: 'm'.repeat(40) }; }
  });
  const r = await upgradeLongLivedToken({ accessToken: 's', env: okEnv, fetcher });
  assert.equal(r.ok, true);
  assert.equal(r.expiresIn, 60 * 24 * 3600);
});

test('debugToken surfaces granular_scopes + is_valid', async () => {
  const fetcher = (url) => ({
    ok: true,
    status: 200,
    async json() {
      assert.match(url, /\/debug_token\?/);
      return {
        data: {
          app_id: '111',
          type: 'USER',
          is_valid: true,
          expires_at: 99999999,
          granular_scopes: [
            { scope: 'whatsapp_business_management', user_ids: ['1'] }
          ]
        }
      };
    }
  });
  const r = await debugToken({ accessToken: 'a'.repeat(60), env: okEnv, fetcher });
  assert.equal(r.ok, true);
  assert.equal(r.info.is_valid, true);
  assert.equal(r.info.granular_scopes[0].scope, 'whatsapp_business_management');
});

test('debugToken refuses missing input', async () => {
  const r = await debugToken({ accessToken: '', env: okEnv, fetcher: bogusFetcher });
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.token_shape);
});

// ----- 5. WABA DISCOVERY -----------------------------------------------

test('discoverWabas returns a normalized business list', async () => {
  const fetcher = () => ({
    ok: true,
    status: 200,
    async json() {
      return {
        data: [
          {
            id: 'biz-1',
            name: 'Acme',
            whatsapp_businesses: [
              {
                id: 'waba-1',
                name: 'Acme WA',
                business_verification_status: 'verified',
                phone_numbers: [{ id: 'pn-1', display_phone_number: '+15555550100' }]
              }
            ]
          }
        ]
      };
    }
  });
  const r = await discoverWabas({ accessToken: 't', userId: 'me', env: okEnv, fetcher });
  assert.equal(r.ok, true);
  assert.equal(r.businesses[0].whatsapp_businesses[0].id, 'waba-1');
});

test('discoverWabas fails closed with diagnostic when fetcher absent', async () => {
  const r = await discoverWabas({
    accessToken: 't',
    userId: 'me',
    env: okEnv,
    fetcher: () => { throw new Error('offline'); }
  });
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.fetch_failed);
});

test('summarizeBusinesses flattens to UI-friendly rows', () => {
  const rows = summarizeBusinesses([
    {
      id: 'biz-1',
      name: 'Acme',
      whatsapp_businesses: [
        {
          id: 'waba-1',
          name: 'WA',
          business_verification_status: 'verified',
          phone_numbers: [{ id: 'pn-1', display_phone_number: '+15555550100', verified_name: 'Acme' }]
        },
        {
          id: 'waba-2',
          name: 'WA-Draft',
          business_verification_status: 'pending',
          phone_numbers: []
        }
      ]
    }
  ]);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].verified, true);
  assert.equal(rows[1].verified, false);
  assert.equal(rows[0].phones[0].display, '+15555550100');
});

// ----- 6. ASSIGN BUSINESS PROFILE --------------------------------------

test('assignWhatsappBusinessProfile fails validation before any network call', async () => {
  let called = 0;
  const fetcher = () => { called += 1; return bogusFetcher(); };
  const r = await assignWhatsappBusinessProfile({
    accessToken: 't',
    phoneId: 'pn-1',
    profile: { vertical: 'NOT_REAL' },
    env: okEnv,
    fetcher
  });
  assert.equal(r.ok, false);
  assert.equal(r.diagnostic, DIAGNOSTIC_CODES.profile_validation);
  assert.equal(called, 0);
});

test('assignWhatsappBusinessProfile sends through the network on a valid payload', async () => {
  let lastUrl, lastInit;
  const fetcher = (url, init) => {
    lastUrl = url;
    lastInit = init;
    return {
      ok: true,
      status: 200,
      async json() { return { success: true }; }
    };
  };
  const r = await assignWhatsappBusinessProfile({
    accessToken: 't',
    phoneId: 'pn-1',
    profile: { about: 'hi', vertical: 'OTHER', websites: ['https://example.com'] },
    env: okEnv,
    fetcher
  });
  assert.equal(r.ok, true);
  assert.match(lastUrl, /\/v20\.0\/pn-1\/whatsapp_business_profile$/);
  assert.equal(lastInit.method, 'POST');
  const body = JSON.parse(lastInit.body);
  assert.equal(body.access_token, 't');
  assert.equal(body.vertical, 'OTHER');
});

test('assignWhatsappBusinessProfile skips validation for pre-validated profiles', async () => {
  let called = 0;
  const fetcher = () => {
    called += 1;
    return { ok: true, status: 200, async json() { return { success: true }; } };
  };
  const profile = markProfileValidated({
    about: 'hello',
    websites: ['https://example.com'],
    vertical: 'OTHER'
  });
  const r = await assignWhatsappBusinessProfile({
    accessToken: 't', phoneId: 'pn-1', profile, env: okEnv, fetcher
  });
  assert.equal(r.ok, true);
  assert.equal(called, 1);
});

// ----- 7. INSTAGRAM LINKING --------------------------------------------

test('startInstagramLink returns a pending-user-action envelope', () => {
  const r = startInstagramLink({ nowMs: 1 });
  assert.equal(r.ok, true);
  assert.equal(r.phase, IG_LINK_PHASES.pending_user_action);
  assert.ok(r.linkId.length >= 22);
  assert.equal(r.expiresAt - 1, 14 * 24 * 60 * 60 * 1000);
});

test('verifyInstagramLinkCallback accepts a non-expired success envelope', () => {
  const r = startInstagramLink({ nowMs: 1 });
  const v = verifyInstagramLinkCallback({
    callback: { linkId: r.linkId, context: 'ig-link', expiresAt: r.expiresAt },
    expectContext: 'ig-link',
    nowMs: 2
  });
  assert.equal(v.ok, true);
  assert.equal(v.phase, IG_LINK_PHASES.linked);
});

test('verifyInstagramLinkCallback rejects expired windows', () => {
  const r = startInstagramLink({ nowMs: 0, ttlMs: 1 });
  const v = verifyInstagramLinkCallback({
    callback: { linkId: r.linkId, context: 'ig-link', expiresAt: 1 },
    expectContext: 'ig-link',
    nowMs: 1000
  });
  assert.equal(v.ok, false);
  assert.equal(v.diagnostic, DIAGNOSTIC_CODES.ig_window_closed);
  assert.equal(v.phase, IG_LINK_PHASES.expired);
});

test('verifyInstagramLinkCallback rejects context mismatch', () => {
  const r = startInstagramLink({ nowMs: 1 });
  const v = verifyInstagramLinkCallback({
    callback: { linkId: r.linkId, context: 'wrong', expiresAt: r.expiresAt },
    expectContext: 'ig-link',
    nowMs: 1
  });
  assert.equal(v.ok, false);
  assert.equal(v.diagnostic, DIAGNOSTIC_CODES.ig_not_linked);
});

test('verifyInstagramLinkCallback surfaces user-side errors', () => {
  const v = verifyInstagramLinkCallback({
    callback: { error: 'user_cancelled', context: 'ig-link' },
    expectContext: 'ig-link',
    nowMs: 1
  });
  assert.equal(v.ok, false);
  assert.equal(v.phase, IG_LINK_PHASES.rejected);
});

// ----- 8. MISC -------------------------------------------------------

test('__internals exposes the documented codes', () => {
  assert.equal(DIAGNOSTIC_CODES.code_missing, 'oauth.code.missing');
  assert.equal(__internals.STATE_TTL_MS, 600_000);
  assert.equal(__internals.REQUIRED_ENV_VARS.includes('META_APP_ID'), true);
});
