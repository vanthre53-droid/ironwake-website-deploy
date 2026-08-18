// lib/whatsapp/meta-client.test.js

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  readConfig,
  createMetaClient,
  unconfiguredResult,
  __internals
} from './meta-client.js';

test('readConfig returns unconfigured when token missing', () => {
  const cfg = readConfig({});
  assert.equal(cfg.configured, false);
  assert.ok(cfg.reasons.some((r) => r.includes('META_WA_TOKEN')));
});

test('readConfig returns unconfigured when app secret missing', () => {
  const cfg = readConfig({ META_WA_TOKEN: 'x', META_WA_PHONE_ID: '123' });
  assert.equal(cfg.configured, false);
  assert.ok(cfg.reasons.some((r) => r.includes('META_APP_SECRET')));
});

test('readConfig returns configured with valid env', () => {
  const cfg = readConfig({
    META_WA_TOKEN: 'tok',
    META_WA_PHONE_ID: '1234567890',
    META_APP_SECRET: 'secret',
    META_WA_BUSINESS_ID: 'biz-1'
  });
  assert.equal(cfg.configured, true);
  assert.equal(cfg.phoneId, '1234567890');
  assert.equal(cfg.businessId, 'biz-1');
  assert.equal(cfg.apiVersion, 'v20.0');
});

test('unconfiguredResult has the documented fields', () => {
  const r = unconfiguredResult(['x']);
  assert.equal(r.ok, false);
  assert.equal(r.safeErrorCode, 'wa_unconfigured');
  assert.equal(r.httpStatus, 503);
  assert.deepEqual(r.reasons, ['x']);
});

test('createMetaClient returns a stub for unconfigured config', () => {
  const stub = createMetaClient({ configured: false });
  assert.equal(stub.configured, false);
  return stub
    .sendText({ to: '+15551234567', body: 'hi' }, { idempotencyKey: 'k' })
    .then((r) => {
      assert.equal(r.ok, false);
      assert.equal(r.safeErrorCode, 'wa_unconfigured');
    });
});

test('createMetaClient require idempotencyKey', async () => {
  const stub = createMetaClient({
    configured: true,
    accessToken: 'tok',
    phoneId: '123',
    apiVersion: 'v20.0',
    timeoutMs: 1000
  }, { fetch: globalThis.fetch });
  const r = await stub.sendText({ to: '+15551234567', body: 'hi' });
  assert.equal(r.ok, false);
  assert.equal(r.safeErrorCode, 'idempotency_key_missing');
});

test('createMetaClient flagged on missing body', async () => {
  const stub = createMetaClient({
    configured: true,
    accessToken: 'tok',
    phoneId: '123',
    apiVersion: 'v20.0',
    timeoutMs: 1000
  }, { fetch: globalThis.fetch });
  const r = await stub.sendText({ to: '+15551234567' }, { idempotencyKey: 'k' });
  assert.equal(r.ok, false);
  assert.equal(r.safeErrorCode, 'wa_body_missing');
});

test('createMetaClient.post a fetch happy path returns message id', async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push({ url, opts });
    return new Response(JSON.stringify({ messages: [{ id: 'mid.abc' }] }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  };
  const stub = createMetaClient({
    configured: true,
    accessToken: 'tok',
    phoneId: '123',
    apiVersion: 'v20.0',
    timeoutMs: 1000
  }, { fetch: fakeFetch });
  const r = await stub.sendText(
    { to: '+15551234567', body: 'hi' },
    { idempotencyKey: 'idem-1' }
  );
  assert.equal(r.ok, true);
  assert.equal(r.messageId, 'mid.abc');
  assert.equal(calls.length, 1);
  assert.ok(calls[0].url.includes('/v20.0/123/messages'));
});

test('createMetaClient maps 401 to wa_auth_failed', async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ error: { message: 'oops' } }), {
    status: 401, headers: { 'content-type': 'application/json' }
  });
  const stub = createMetaClient({
    configured: true,
    accessToken: 'tok',
    phoneId: '123',
    apiVersion: 'v20.0',
    timeoutMs: 1000
  }, { fetch: fakeFetch });
  const r = await stub.sendText(
    { to: '+15551234567', body: 'hi' },
    { idempotencyKey: 'idem-1' }
  );
  assert.equal(r.ok, false);
  assert.equal(r.safeErrorCode, 'wa_auth_failed');
  assert.equal(r.retryable, false);
});

test('createMetaClient maps 429 to wa_rate_limited + retryable', async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ error: { message: 'slow down' } }), {
    status: 429, headers: { 'content-type': 'application/json' }
  });
  const stub = createMetaClient({
    configured: true,
    accessToken: 'tok',
    phoneId: '123',
    apiVersion: 'v20.0',
    timeoutMs: 1000
  }, { fetch: fakeFetch });
  const r = await stub.sendText(
    { to: '+15551234567', body: 'hi' },
    { idempotencyKey: 'idem-1' }
  );
  assert.equal(r.safeErrorCode, 'wa_rate_limited');
  assert.equal(r.retryable, true);
});

test('safeErrorCodeFromError maps 131047 to wa_window_closed_template_required', () => {
  assert.equal(__internals.safeErrorCodeFromError({ code: 131047 }, 400), 'wa_window_closed_template_required');
  assert.equal(__internals.safeErrorCodeFromError({ code: 131051 }, 400), 'wa_template_unregistered');
  assert.equal(__internals.safeErrorCodeFromError({}, 500), 'wa_provider_error');
  assert.equal(__internals.safeErrorCodeFromError({}, 200), null);
});

test('retryableStatus is true only for 408/429/5xx', () => {
  assert.equal(__internals.retryableStatus(408), true);
  assert.equal(__internals.retryableStatus(429), true);
  assert.equal(__internals.retryableStatus(500), true);
  assert.equal(__internals.retryableStatus(503), true);
  assert.equal(__internals.retryableStatus(400), false);
  assert.equal(__internals.retryableStatus(401), false);
});
