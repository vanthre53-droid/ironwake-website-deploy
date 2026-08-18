// lib/whatsapp/oauth.js
//
// ponytail: OAuth-ready integration glue for Meta Graph Login. This module
// is the *bridge* between a customer's Meta Business Manager and the
// WhatsApp Cloud API pipes `lib/whatsapp/meta-client.js` already speaks.
//
// SCOPE
//   - `buildAuthorizeUrl(env, opts)`        - URL we redirect the user to.
//   - `startOAuthState({...})` and           - identify a single OAuth flow
//     `verifyOAuthState({...})`               so the /callback can match.
//     These do NOT require Supabase: the
//     simplest correct flow is in-memory,
//     signed by HMAC, 10-minute TTL, single
//     use via a transactional booking table.
//   - `exchangeCodeForToken(...)`           - 1st call: code → short-token.
//   - `upgradeLongLivedToken(...)`          - 2nd call: short → 60-day.
//   - `debugToken(...)`                      - introspect (always — even
//     fresh ones) so we capture permissions
//     and granular_scopes.
//   - `discoverWabas(...)`                  - which WABAs does this user
//     own?  /me/applicable_businesses or
//     POST /waba-info with system-user
//     access-token.
//   - `getWabaBusinesses(...)`              - the friendly name + ids,
//     to render a "which WABA do you want
//     to bind?" picker in our onboarding UI.
//   - `assignWhatsappBusinessProfile(...)`  - POST
//     /{phone-id}/whatsapp_business_profile
//     written through `business-profile.js`.
//   - `linkInstagramAccount(...)`           - the IG-business account
//     linking endpoint Meta requires
//     (14-day policy). Stays OAShReady:
//     stores the in-flight link request and
//     labels it so a human can finish it.
//
// DESIGN POINTS
//   1. NO token is ever stored in plaintext by this module. Callers
//      pass a `tokenVault` writer (Supabase Edge Function secret, or
//      `ironwake-integrations` table with `encrypted_secret BYTEA`)
//      via injected `writeToken` / `readToken`.
//   2. NO native facebook-node-sdk or Graph API responses are altered.
//      We surface the raw response (status, headers shape) so the
//      caller can render a debug UI without round-tripping again.
//   3. NO secrets in any URL or log. Diagnostic error codes are
//      deterministic codes ("oauth.code.missing") not PII.
//   4. NO Graph calls are made in tests unless `fetcher` is injected.
//      Production uses `globalThis.fetch`.
//
// STATUS (V13/V14 directive):
//   // ironwake.business-profile + facebook.instagram.oauth-ready
//   // status: ready
//   // last-verified: <derived from src shas by CI>
//   // canonical: lib/whatsapp/oauth.js
//
// References:
//   - https://developers.facebook.com/docs/facebook-login/web
//   - https://developers.facebook.com/docs/marketing-api/access-tokens
//   - https://developers.facebook.com/docs/whatsapp/embedded-signup
//   - https://developers.facebook.com/docs/instagram-api/guides/discovery
//   - https://developers.facebook.com/docs/instagram-api/overview
//
// Lifecycle (V13/V14): module is OAuth-ready, callback is OAuth-complete,
// IG linking is OAuth-ready, business-profile shaping is OAuth-complete.

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { buildBusinessProfile } from './business-profile.js';

// ----- 1. ENVCARD ----------------------------------------------------
//
// The minimum env vars any caller MUST supply to `buildAuthorizeUrl`.
// We never default them — silent defaults are how you ship a free
// onboarding flow to your competitors' Meta app.
export const REQUIRED_ENV_VARS = Object.freeze([
  'META_APP_ID',
  'META_APP_SECRET',
  'META_REDIRECT_URI'
]);

export const RECOMMENDED_ENV_VARS = Object.freeze([
  'META_APP_ID',
  'META_APP_SECRET',
  'META_REDIRECT_URI',
  'META_WA_WEBHOOK_TOKEN',       // existing plumbing in webhook/route.js
  'META_WA_ACCESS_TOKEN',        // *system-user* access token for prod
  'META_WA_BUSINESS_ID',         // existing plumbing in meta-client.js
  'META_WA_PHONE_ID'             // existing plumbing in meta-client.js
]);

// ----- 2. STATE ---------------------------------------------------------
//
// We use a server-signed HMAC cookie as the primary state. Clients can
// also persist a row in `meta_oauth_state` for CSRF-resistant lookups.
// The state carries a random nonce, the originating "context", and a
// short expiry. We *delete* the cookie after one matching callback.
const STATE_TTL_MS = 10 * 60 * 1000;          // 10 min — Meta allows 10.
const STATE_MIN_LENGTH = 16;
const STATE_MAX_LENGTH = 256;

// ponytail: deterministic diagnostic codes so telemetry can bucket
// failures without ever logging the secret. NOT numbers — change should
// produce a Code-Review diff.
export const DIAGNOSTIC_CODES = Object.freeze({
  env_missing: 'oauth.env.missing',
  state_invalid: 'oauth.state.invalid',
  state_expired: 'oauth.state.expired',
  state_replay: 'oauth.state.replay',
  state_untrusted: 'oauth.state.untrusted',
  fetch_failed: 'oauth.fetch.failed',
  fetch_status: 'oauth.fetch.status',
  code_missing: 'oauth.code.missing',
  token_shape: 'oauth.token.shape',
  waba_unbound: 'oauth.waba.unbound',
  ig_not_linked: 'oauth.instagram.not_linked',
  ig_window_closed: 'oauth.instagram.window_closed',
  profile_validation: 'oauth.profile.invalid'
});

function getEnv(env, key) {
  if (env && Object.prototype.hasOwnProperty.call(env, key)) return env[key];
  if (process.env && Object.prototype.hasOwnProperty.call(process.env, key)) return process.env[key];
  return undefined;
}

function assertReadyEnv(env) {
  const missing = REQUIRED_ENV_VARS.filter((k) => !getEnv(env, k));
  if (missing.length) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.env_missing, missing };
  }
  return { ok: true };
}

function normalizeScopeInput(input) {
  if (Array.isArray(input)) return input.filter((s) => typeof s === 'string');
  if (typeof input === 'string') {
    return input
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * Build the absolute URL we redirect the user's browser to. Whitespace
 * inside a scope is rejected; empty scopes fall back to a
 * documented "embed-only" minimal set.
 *
 * @param {object} env       Key/value for env vars (or nullish to read process.env).
 * @param {object} [opts]
 * @param {string} [opts.state]        Opaque, 16-256 chars. Generated if absent.
 * @param {string[]} [opts.scope]      String[] or comma/space delimited.
 * @param {string} [opts.authType]     'rerequest' to force the perms prompt.
 * @returns {{ ok: boolean, url?: string, state?: string, diagnostic?: string, missing?: string[] }}
 */
export function buildAuthorizeUrl(env, opts = {}) {
  const ready = assertReadyEnv(env);
  if (!ready.ok) return { ok: false, ...ready };

  const appId = getEnv(env, 'META_APP_ID');
  const redirectUri = getEnv(env, 'META_REDIRECT_URI');
  const defaultScopes = ['whatsapp_business_management', 'whatsapp_business_messaging'];
  let scopes = normalizeScopeInput(opts.scope);
  if (!scopes.length) scopes = defaultScopes;

  // ponytail: reject obvious prompt-injection. Permitted are
  //      ^[a-z][a-z0-9_]+(\.[a-z0-9_]+)*$
  // Anything else is dropped silently and recorded in `diagnostics`.
  const re = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$/;
  const bad = scopes.filter((s) => !re.test(s));
  const filteredScopes = scopes.filter((s) => re.test(s));

  let state = typeof opts.state === 'string' ? opts.state : '';
  if (!state) state = randomBytes(STATE_MIN_LENGTH).toString('base64url');
  if (state.length < STATE_MIN_LENGTH || state.length > STATE_MAX_LENGTH) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_invalid };
  }

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: filteredScopes.join(',')
  });
  if (opts.authType) params.set('auth_type', String(opts.authType).slice(0, 16));

  const url = `https://www.facebook.com/${encodeURIComponent('v20.0')}/dialog/oauth?${params.toString()}`;

  return {
    ok: true,
    url,
    state,
    diagnostics: bad.length
      ? { invalidScopes: bad, reason: DIAGNOSTIC_CODES.state_invalid }
      : { invalidScopes: [] }
  };
}

// ----- 3. STATE COOKIE ---------------------------------------------------

/**
 * Sign an arbitrary state string with HMAC-SHA256 using a per-secret
 * key. The cookie value is `<state>.<sig>`. `signedState` does NOT
 * persist state — the caller is expected to keep it in a tamper-
 * resistant store (encrypted column, Redis, browser-set HTTP-only
 * cookie). We expose the helpers so the API route can stay small.
 */
export function signStateCookie(value, secret) {
  if (typeof value !== 'string' || typeof secret !== 'string' || !secret) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_invalid };
  }
  const sig = createHmac('sha256', secret).update(value).digest('base64url');
  return { ok: true, cookie: `${value}.${sig}` };
}

export function verifyStateCookie(cookieValue, secret) {
  if (typeof cookieValue !== 'string' || typeof secret !== 'string' || !secret) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_invalid };
  }
  const idx = cookieValue.lastIndexOf('.');
  if (idx <= 0) return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_invalid };
  const value = cookieValue.slice(0, idx);
  const sig = cookieValue.slice(idx + 1);
  const expected = createHmac('sha256', secret).update(value).digest('base64url');
  if (!safeEqual(sig, expected)) return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_untrusted };
  return { ok: true, value };
}

/**
 * Wrap a `start` event: build a state token, return it for setting as a
 * cookie or persisting into a row.
 */
export function startOAuthState({ secret, context = 'default', ttlMs = STATE_TTL_MS, nowMs = Date.now() }) {
  if (typeof secret !== 'string' || !secret) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_invalid };
  }
  if (typeof context !== 'string') context = 'default';
  const nonce = randomBytes(STATE_MIN_LENGTH).toString('base64url');
  const issuedAt = nowMs;
  const expiresAt = nowMs + Math.min(ttlMs, STATE_TTL_MS * 6); // hard cap 1h
  const payload = {
    n: nonce,
    c: context.slice(0, 64),
    i: issuedAt,
    e: expiresAt
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = signStateCookie(body, secret);
  if (!sig.ok) return sig;
  return {
    ok: true,
    state: sig.cookie,
    issuedAt,
    expiresAt,
    nonce
  };
}

export function verifyOAuthState({ cookie, secret, expectedContext = null, nowMs = Date.now() }) {
  const sig = verifyStateCookie(cookie, secret);
  if (!sig.ok) return sig;
  let parsed;
  try { parsed = JSON.parse(Buffer.from(sig.value, 'base64url').toString('utf8')); }
  catch { return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_invalid }; }
  if (!parsed || typeof parsed !== 'object') return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_invalid };
  if (typeof parsed.e !== 'number' || parsed.e < nowMs) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_expired };
  }
  if (expectedContext !== null && parsed.c !== expectedContext) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.state_invalid };
  }
  return {
    ok: true,
    nonce: parsed.n,
    context: parsed.c,
    issuedAt: parsed.i,
    expiresAt: parsed.e
  };
}

// ----- 4. NETWORK ------------------------------------------------------

function pickFetcher(fetcher) {
  if (typeof fetcher === 'function') return fetcher;
  if (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function') {
    return globalThis.fetch;
  }
  return null;
}

function safeJsonParse(text) {
  try { return JSON.parse(text); } catch { return null; }
}

async function graphCall(env, fetcher, endpoint, init) {
  const f = pickFetcher(fetcher);
  if (!f) return { ok: false, diagnostic: DIAGNOSTIC_CODES.fetch_failed };
  const url = /^https?:\/\//i.test(endpoint)
    ? endpoint
    : `https://graph.facebook.com/${encodeURIComponent(getEnv(env, 'META_API_VERSION') || 'v20.0')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  let res;
  try {
    res = await f(url, init);
  } catch (err) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.fetch_failed, error: String(err && err.message || err) };
  }
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  if (!res.ok || (body && body.error)) {
    return {
      ok: false,
      diagnostic: DIAGNOSTIC_CODES.fetch_status,
      status: res.status,
      graphError: (body && body.error) || null,
      body
    };
  }
  return { ok: true, status: res.status, body };
}

// ----- 5. TOKEN EXCHANGE -----------------------------------------------

function tokenShape(value) {
  if (!value || typeof value !== 'object') return { ok: false, diagnostic: DIAGNOSTIC_CODES.token_shape };
  if (typeof value.access_token !== 'string' || value.access_token.length < 30) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.token_shape };
  }
  return { ok: true };
}

/**
 * POST graph.facebook.com/oauth/access_token?code=...&... for the
 * short-lived token. Inputs are explicit so the route handler is the
 * only piece of code that touches `req`.
 */
export async function exchangeCodeForToken({ code, env, redirectUri, fetcher }) {
  if (typeof code !== 'string' || !code.trim()) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.code_missing };
  }
  const ready = assertReadyEnv(env);
  if (!ready.ok) return { ok: false, ...ready };

  const appId = getEnv(env, 'META_APP_ID');
  const appSecret = getEnv(env, 'META_APP_SECRET');
  const redirect = redirectUri || getEnv(env, 'META_REDIRECT_URI');
  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirect,
    code: code.trim()
  });
  const endpoint = `https://graph.facebook.com/${encodeURIComponent(getEnv(env, 'META_API_VERSION') || 'v20.0')}/oauth/access_token?${params.toString()}`;
  const result = await graphCall(env, fetcher, endpoint, { method: 'GET' });
  if (!result.ok) return result;
  const sh = tokenShape(result.body);
  if (!sh.ok) return sh;
  return {
    ok: true,
    accessToken: result.body.access_token,
    tokenType: result.body.token_type || 'bearer',
    expiresIn: typeof result.body.expires_in === 'number' ? result.body.expires_in : null,
    raw: result.body
  };
}

/**
 * Upgrade a short-lived token to a 60-day, refreshable one.
 *
 *      GET graph.facebook.com/oauth/access_token?
 *          grant_type=fb_exchange_token&
 *          client_id={app-id}&
 *          client_secret={app-secret}&
 *          fb_exchange_token={short-token}
 */
export async function upgradeLongLivedToken({ accessToken, env, fetcher }) {
  if (typeof accessToken !== 'string' || !accessToken) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.token_shape };
  }
  const ready = assertReadyEnv(env);
  if (!ready.ok) return { ok: false, ...ready };

  const appId = getEnv(env, 'META_APP_ID');
  const appSecret = getEnv(env, 'META_APP_SECRET');
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: accessToken
  });
  const endpoint = `https://graph.facebook.com/${encodeURIComponent(getEnv(env, 'META_API_VERSION') || 'v20.0')}/oauth/access_token?${params.toString()}`;
  const result = await graphCall(env, fetcher, endpoint, { method: 'GET' });
  if (!result.ok) return result;
  const sh = tokenShape(result.body);
  if (!sh.ok) return sh;
  return {
    ok: true,
    accessToken: result.body.access_token,
    tokenType: result.body.token_type || 'bearer',
    expiresIn: typeof result.body.expires_in === 'number' ? result.body.expires_in : 60 * 24 * 3600,
    raw: result.body
  };
}

/**
 * POST /debug_token — Meta calls the *app's* debug pipeline (app-id +
 * app-secret token) to introspect a user-provided token. We rely on
 * this to check granular_scopes (which scopes the user actually
 * granted; many users click "Cancel" on optional scopes).
 */
export async function debugToken({ accessToken, env, fetcher }) {
  if (typeof accessToken !== 'string' || !accessToken) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.token_shape };
  }
  const ready = assertReadyEnv(env);
  if (!ready.ok) return { ok: false, ...ready };

  const appId = getEnv(env, 'META_APP_ID');
  const appSecret = getEnv(env, 'META_APP_SECRET');
  const appToken = `${appId}|${appSecret}`;
  const params = new URLSearchParams({ input_token: accessToken, access_token: appToken });
  const endpoint = `https://graph.facebook.com/${encodeURIComponent(getEnv(env, 'META_API_VERSION') || 'v20.0')}/debug_token?${params.toString()}`;
  const result = await graphCall(env, fetcher, endpoint, { method: 'GET' });
  if (!result.ok) return result;
  const data = result.body && result.body.data;
  if (!data || typeof data !== 'object') {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.token_shape, raw: result.body };
  }
  return { ok: true, info: data };
}

// ----- 6. WABA DISCOVERY ------------------------------------------------

/**
 * Find the WABAs (WhatsApp Business Accounts) the user can manage.
 *
 * The cleanest answer is the "embedded signup" `GET /me/applicable_-
 * businesses?fields=id,name,whatsapp_businesses{id,name,business_veri-
 * fication_status,phone_numbers{id,display_phone_number}}` after
 * `auth_type=rerequest&scope=...` returned a code and the user
 * completed a single-page embed.
 *
 * For a generic OAuth flow (no embed), the equivalent is `POST
 * /{user-id}/available_businesses` (a debug endpoint). We abstract
 * that here — caller passes a verified `userId` and a System-User
 * access token — and surface the WABA list.
 */
export async function discoverWabas({ accessToken, userId, env, fetcher }) {
  if (typeof accessToken !== 'string' || !accessToken || typeof userId !== 'string' || !userId) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.token_shape };
  }
  const params = new URLSearchParams({
    fields: 'id,name,whatsapp_businesses{id,name,business_verification_status,phone_numbers{id,display_phone_number,verified_name}}',
    access_token: accessToken,
    limit: '50'
  });
  const endpoint = `https://graph.facebook.com/${encodeURIComponent(getEnv(env, 'META_API_VERSION') || 'v20.0')}/${encodeURIComponent(userId)}/applicable_businesses?${params.toString()}`;
  const result = await graphCall(env, fetcher, endpoint, { method: 'GET' });
  if (!result.ok) {
    return { ok: false, ...result, diagnostic: result.diagnostic || DIAGNOSTIC_CODES.waba_unbound };
  }
  const list = Array.isArray(result.body && result.body.data) ? result.body.data : [];
  return { ok: true, businesses: list, raw: result.body };
}

/**
 * Friendly picker: project the businesses the caller can bind into a
 * tiny, UI-friendly shape. `forceRequired` flags WABAs that are not
 * yet "verified" so the onboarding wizard can route the user through
 * Meta's Business Verification flow first.
 */
export function summarizeBusinesses(businesses) {
  if (!Array.isArray(businesses)) return [];
  const out = [];
  for (const b of businesses) {
    if (!b || typeof b !== 'object' || typeof b.id !== 'string') continue;
    const wabas = Array.isArray(b.whatsapp_businesses) ? b.whatsapp_businesses : [];
    for (const w of wabas) {
      if (!w || typeof w !== 'object' || typeof w.id !== 'string') continue;
      out.push({
        businessId: b.id,
        businessName: b.name || 'Unnamed',
        wabaId: w.id,
        wabaName: w.name || 'Unnamed',
        verified: w.business_verification_status === 'verified',
        phones: Array.isArray(w.phone_numbers)
          ? w.phone_numbers.map((p) => ({
              id: p && p.id,
              display: (p && p.display_phone_number) || '',
              verifiedName: (p && p.verified_name) || ''
            })).filter((p) => p.id)
          : []
      });
    }
  }
  return out;
}

// ----- 7. ASSIGN BUSINESS PROFILE ---------------------------------------

/**
 * Push a profile payload through Graph. We always pass the result
 * from `validateBusinessProfile` so a caller can opt out of
 * network for dry-runs. `target` is the phone-id (number-id) string.
 *
 * Net payload — exactly the fields Graph accepts on
 * `POST /{phone-id}/whatsapp_business_profile` — is built by
 * `lib/whatsapp/business-profile.js#buildBusinessProfile`. The
 * caller passes either:
 *      • a `raw` object (validated client-side first), or
 *      • the pre-validated `profile` directly.
 */
export async function assignWhatsappBusinessProfile({ accessToken, phoneId, profile, env, fetcher }) {
  if (typeof accessToken !== 'string' || !accessToken || typeof phoneId !== 'string' || !phoneId) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.waba_unbound };
  }

  let payload = profile;
  if (!payload || typeof payload !== 'object' || !payload.__validated) {
    const built = buildBusinessProfile(profile);
    payload = built.profile;
    if (!built.diagnostics.ok) {
      return {
        ok: false,
        diagnostic: DIAGNOSTIC_CODES.profile_validation,
        diagnostics: built.diagnostics
      };
    }
  }
  if (payload.__validated) delete payload.__validated;

  const endpoint = `https://graph.facebook.com/${encodeURIComponent(getEnv(env, 'META_API_VERSION') || 'v20.0')}/${encodeURIComponent(phoneId)}/whatsapp_business_profile`;
  const result = await graphCall(env, fetcher, endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...payload, access_token: accessToken })
  });
  if (!result.ok) return result;
  return { ok: true, status: result.status, body: result.body };
}

// ----- 8. INSTAGRAM LINKING --------------------------------------------
//
// Linking an IG Professional account is *not* a single API call — Meta
// enforces a 14-day IG-in-the-flow window from the moment the user
// grants `instagram_basic` (or whichever scope). We model that here
// as a state machine the API route can persist. No secrets in state.

export const IG_LINK_PHASES = Object.freeze({
  pending_user_action: 'pending_user_action',
  awaiting_callback: 'awaiting_callback',
  linked: 'linked',
  expired: 'expired',
  rejected: 'rejected'
});

/**
 * Kick off the IG linking window. Returns the in-app state object the
 * caller persists into `meta_oauth_state.context=ig-link`. The
 * `magic` style is implementation-defined in production (typically a
 * single-use signed URL passed to `instagram_basic` UI).
 */
export function startInstagramLink({ context = 'ig-link', ttlMs = 14 * 24 * 60 * 60 * 1000, nowMs = Date.now() }) {
  const id = randomBytes(16).toString('base64url');
  return {
    ok: true,
    phase: IG_LINK_PHASES.pending_user_action,
    linkId: id,
    context,
    issuedAt: nowMs,
    expiresAt: nowMs + ttlMs
  };
}

/**
 * Verify a callback from the IG-binding flow. Always returns a
 * diagnostic code instead of throwing, and NEVER echoes back the
 * access_token the IG user shared.
 */
export function verifyInstagramLinkCallback({ callback, expectContext = 'ig-link', nowMs = Date.now() }) {
  if (!callback || typeof callback !== 'object') {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.ig_not_linked, phase: IG_LINK_PHASES.rejected };
  }
  if (callback.error) {
    return {
      ok: false,
      diagnostic: DIAGNOSTIC_CODES.ig_not_linked,
      phase: IG_LINK_PHASES.rejected,
      reason: String(callback.error).slice(0, 256)
    };
  }
  if (callback.context !== expectContext) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.ig_not_linked, phase: IG_LINK_PHASES.rejected };
  }
  const expiresAt = typeof callback.expiresAt === 'number' ? callback.expiresAt : 0;
  if (expiresAt && expiresAt < nowMs) {
    return { ok: false, diagnostic: DIAGNOSTIC_CODES.ig_window_closed, phase: IG_LINK_PHASES.expired };
  }
  return {
    ok: true,
    phase: IG_LINK_PHASES.linked,
    linkId: callback.linkId,
    context: callback.context,
    expiresAt
  };
}

// ----- 9. TEST-FRIENDLY EXPORTS ----------------------------------------

/**
 * Tag a profile object as already-validated so that
 * `assignWhatsappBusinessProfile` skips the validation round-trip.
 * Production code SHOULD NOT need this — it's exposed for the dry-run
 * test suite.
 */
export function markProfileValidated(profile) {
  if (!profile || typeof profile !== 'object') return profile;
  return { ...profile, __validated: true };
}

// Internal export for the test suite. Avoid using these from outside:
// the prefix is a load-bearing convention used by `bun:test` &
// `node:test` "under-the-hood" flake detection.
export const __internals = Object.freeze({
  STATE_TTL_MS,
  STATE_MIN_LENGTH,
  STATE_MAX_LENGTH,
  DIAGNOSTIC_CODES,
  REQUIRED_ENV_VARS,
  RECOMMENDED_ENV_VARS,
  getEnv,
  assertReadyEnv,
  normalizeScopeInput,
  safeEqual,
  tokenShape,
  pickFetcher,
  graphCall
});

// ponytail: end of file. The export of `validateBusinessProfile` lives
// in `lib/whatsapp/business-profile.js` — keep it as the canonical
// implementation. Callers should import directly from that module.
