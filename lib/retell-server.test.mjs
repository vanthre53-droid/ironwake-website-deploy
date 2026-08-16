import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

// ponytail: unit tests for lib/retell-server.mjs. We mock globalThis.fetch
// so the createWebCall path runs without a live Retell API.
// verifyRetellSignature uses Web Crypto (crypto.subtle) which is provided by
// Node 18+ globalThis.crypto — same runtime as the edge Worker.

import {
  retellConfigured,
  retellUnconfiguredResult,
  createWebCall,
  verifyRetellSignature,
} from './retell-server.mjs';

function envWith(extra = {}) {
  return { ...process.env, ...extra };
}

function mockFetch(impl) {
  globalThis.fetch = impl;
}

test('retellConfigured requires both RETELL_API_KEY and RETELL_AGENT_ID', () => {
  assert.equal(retellConfigured({}), false);
  assert.equal(retellConfigured({ RETELL_API_KEY: 'k' }), false);
  assert.equal(retellConfigured({ RETELL_AGENT_ID: 'a' }), false);
  assert.equal(retellConfigured({ RETELL_API_KEY: 'k', RETELL_AGENT_ID: 'a' }), true);
});

test('retellUnconfiguredResult returns safe 503 with stable code', () => {
  const r = retellUnconfiguredResult();
  assert.equal(r.ok, false);
  assert.equal(r.httpStatus, 503);
  assert.equal(r.safeErrorCode, 'retell_unconfigured');
});

test('createWebCall returns unconfigured when env is missing', async () => {
  mockFetch(() => { throw new Error('should not be called'); });
  const r = await createWebCall({ env: envWith({ RETELL_API_KEY: undefined, RETELL_AGENT_ID: undefined }) });
  assert.equal(r.ok, false);
  assert.equal(r.safeErrorCode, 'retell_unconfigured');
  assert.equal(r.httpStatus, 503);
});

test('createWebCall returns 401/403 bucket as retell_key_invalid', async () => {
  mockFetch(async () => ({ ok: false, status: 401, json: async () => ({}) }));
  const r = await createWebCall({ env: envWith({ RETELL_API_KEY: 'k', RETELL_AGENT_ID: 'a' }) });
  assert.equal(r.ok, false);
  assert.equal(r.safeErrorCode, 'retell_key_invalid');
  assert.equal(r.httpStatus, 503);
});

test('createWebCall returns 429 as retell_rate_limited', async () => {
  mockFetch(async () => ({ ok: false, status: 429, json: async () => ({}) }));
  const r = await createWebCall({ env: envWith({ RETELL_API_KEY: 'k', RETELL_AGENT_ID: 'a' }) });
  assert.equal(r.safeErrorCode, 'retell_rate_limited');
  assert.equal(r.httpStatus, 429);
});

test('createWebCall returns network error as retell_network_unreachable', async () => {
  mockFetch(async () => { throw new TypeError('dns failed'); });
  const r = await createWebCall({ env: envWith({ RETELL_API_KEY: 'k', RETELL_AGENT_ID: 'a' }) });
  assert.equal(r.ok, false);
  assert.equal(r.safeErrorCode, 'retell_network_unreachable');
  assert.equal(r.httpStatus, 502);
});

test('createWebCall returns malformed_response on missing access_token', async () => {
  mockFetch(async () => ({ ok: true, status: 200, json: async () => ({ call_id: 'c' }) }));
  const r = await createWebCall({ env: envWith({ RETELL_API_KEY: 'k', RETELL_AGENT_ID: 'a' }) });
  assert.equal(r.ok, false);
  assert.equal(r.safeErrorCode, 'retell_malformed_response');
});

test('createWebCall returns ok shape with access_token + call_id', async () => {
  mockFetch(async () => ({
    ok: true, status: 200,
    json: async () => ({ access_token: 'tok123', call_id: 'call_abc', expires_in: 60 }),
  }));
  const r = await createWebCall({ env: envWith({ RETELL_API_KEY: 'k', RETELL_AGENT_ID: 'a' }) });
  assert.equal(r.ok, true);
  assert.equal(r.accessToken, 'tok123');
  assert.equal(r.callId, 'call_abc');
  assert.equal(r.expiresInSeconds, 60);
});

test('createWebCall forwards only safe metadata (source allowed, free text dropped)', async () => {
  let captured;
  mockFetch(async (url, opts) => {
    captured = { url, body: JSON.parse(opts.body) };
    return { ok: true, status: 200, json: async () => ({ access_token: 't', call_id: 'c', expires_in: 30 }) };
  });
  await createWebCall({
    env: envWith({ RETELL_API_KEY: 'k', RETELL_AGENT_ID: 'a' }),
    customerSupabaseUserId: '00000000-0000-0000-0000-000000000001',
    metadata: { source: 'demo', bad: 'should not appear', customer_text: 'PII leak' },
  });
  assert.equal(captured.url, 'https://api.retellai.com/v2/create-web-call');
  assert.equal(captured.body.agent_id, 'a');
  assert.equal(captured.body.metadata.source, 'demo');
  assert.equal(captured.body.metadata.supabase_user_id.length, 36);
  assert.equal(captured.body.metadata.bad, undefined);
  assert.equal(captured.body.metadata.customer_text, undefined);
});

test('createWebCall truncates supabase_user_id to 80 chars', async () => {
  let captured;
  mockFetch(async (url, opts) => {
    captured = JSON.parse(opts.body);
    return { ok: true, status: 200, json: async () => ({ access_token: 't', call_id: 'c' }) };
  });
  const longId = 'a'.repeat(150);
  await createWebCall({ env: envWith({ RETELL_API_KEY: 'k', RETELL_AGENT_ID: 'a' }), customerSupabaseUserId: longId });
  assert.equal(captured.metadata.supabase_user_id.length, 80);
});

// ----- verifyRetellSignature -----

test('verifyRetellSignature rejects missing body / signature / key', async () => {
  assert.equal((await verifyRetellSignature({ rawBody: '', apiKey: 'k', signatureHeader: 's', timestampHeader: '1' })).ok, false);
  assert.equal((await verifyRetellSignature({ rawBody: 'b', apiKey: 'k', signatureHeader: '', timestampHeader: '1' })).ok, false);
  assert.equal((await verifyRetellSignature({ rawBody: 'b', apiKey: '', signatureHeader: 's', timestampHeader: '1' })).ok, false);
});

test('verifyRetellSignature rejects malformed hex signature', async () => {
  const r = await verifyRetellSignature({
    rawBody: 'b', apiKey: 'k',
    signatureHeader: 'not-hex!!!',
    timestampHeader: String(Date.now()),
  });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'malformed_signature');
});

test('verifyRetellSignature rejects timestamp out of window', async () => {
  const r = await verifyRetellSignature({
    rawBody: 'b', apiKey: 'k',
    signatureHeader: '00',
    timestampHeader: String(Date.now() - 10 * 60 * 1000),
    nowMs: Date.now(),
  });
  assert.equal(r.reason, 'timestamp_out_of_window');
});

test('verifyRetellSignature accepts a valid signature within window', async () => {
  const apiKey = 'k123';
  const rawBody = '{"event":"call_started"}';
  const ts = String(Date.now());
  const sig = createHmac('sha256', apiKey).update(rawBody).digest('hex');
  const r = await verifyRetellSignature({
    rawBody, apiKey, signatureHeader: sig, timestampHeader: ts, nowMs: Date.now(),
  });
  assert.equal(r.ok, true);
});

test('verifyRetellSignature rejects mismatched signature in constant-time manner', async () => {
  const rawBody = 'b';
  const ts = String(Date.now());
  const sig = createHmac('sha256', 'wrong-key').update(rawBody).digest('hex');
  const r = await verifyRetellSignature({
    rawBody, apiKey: 'right-key', signatureHeader: sig, timestampHeader: ts, nowMs: Date.now(),
  });
  assert.equal(r.ok, false);
});
