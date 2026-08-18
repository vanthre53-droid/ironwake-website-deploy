import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  readWhatsAppConfig,
  createWhatsAppAdapter,
  whatsappAdapterInternals
} from './whatsapp-adapter.mjs';

test('readWhatsAppConfig returns unconfigured without env', () => {
  const cfg = readWhatsAppConfig({});
  assert.equal(cfg.configured, false);
  assert.equal(cfg.safeErrorCode, 'wa_access_token_missing');
});

test('readWhatsAppConfig flags missing phone id', () => {
  const cfg = readWhatsAppConfig({ META_WA_ACCESS_TOKEN: 'x' });
  assert.equal(cfg.configured, false);
  assert.equal(cfg.safeErrorCode, 'wa_phone_id_missing');
});

test('readWhatsAppConfig returns configured when both present', () => {
  const cfg = readWhatsAppConfig({ META_WA_ACCESS_TOKEN: 'token', META_WA_PHONE_NUMBER_ID: '1234567890' });
  assert.equal(cfg.configured, true);
  assert.equal(cfg.provider, 'whatsapp');
  assert.equal(cfg.phoneId, '1234567890');
});

test('createWhatsAppAdapter throws when unconfigured', () => {
  assert.throws(() => createWhatsAppAdapter({ configured: false }), /whatsapp_adapter_unconfigured/);
});

test('e164 validates phone format', () => {
  assert.equal(whatsappAdapterInternals.e164('+15551234567'), '+15551234567');
  assert.equal(whatsappAdapterInternals.e164('  +1 (555) 123-4567  '), '+15551234567');
  assert.equal(whatsappAdapterInternals.e164('5551234567'), null);
  assert.equal(whatsappAdapterInternals.e164('+0123456789'), null);
});

test('send rejects missing idempotency key', async () => {
  const adapter = createWhatsAppAdapter(
    { configured: true, provider: 'whatsapp', apiVersion: 'v20.0', phoneId: 'p', accessToken: 't', timeoutMs: 1000 },
    { fetchImpl: () => { throw new Error('should not be called'); } }
  );
  const out = await adapter.send({ to: '+15551234567', body: 'hi' });
  assert.equal(out.accepted, false);
  assert.equal(out.safeErrorCode, 'idempotency_key_missing');
});

test('send rejects invalid recipient before fetch', async () => {
  const adapter = createWhatsAppAdapter(
    { configured: true, provider: 'whatsapp', apiVersion: 'v20.0', phoneId: 'p', accessToken: 't', timeoutMs: 1000 },
    { fetchImpl: () => { throw new Error('should not be called'); } }
  );
  const out = await adapter.send({ to: 'not-a-phone', body: 'hi' }, { idempotencyKey: 'k1' });
  assert.equal(out.accepted, false);
  assert.equal(out.safeErrorCode, 'wa_recipient_invalid');
});

test('sendText returns accepted with provider message id on 200', async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push({ url, opts });
    return new Response(JSON.stringify({ messages: [{ id: 'wamid.ABC' }] }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  };
  const adapter = createWhatsAppAdapter(
    { configured: true, provider: 'whatsapp', apiVersion: 'v20.0', phoneId: '999', accessToken: 'tok', timeoutMs: 2000 },
    { fetchImpl: fakeFetch }
  );
  const out = await adapter.send({ to: '+15551234567', body: 'hello' }, { idempotencyKey: 'idem-1' });
  assert.equal(out.accepted, true);
  assert.equal(out.status, 'accepted');
  assert.equal(out.providerEventId, 'wamid.ABC');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://graph.facebook.com/v20.0/999/messages');
  const body = JSON.parse(calls[0].opts.body);
  assert.equal(body.messaging_product, 'whatsapp');
  assert.equal(body.to, '+15551234567');
  assert.equal(body.type, 'text');
});

test('sendText maps 401 to wa_auth_failed (non-retryable)', async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ error: { type: 'OAuthException' } }), { status: 401 });
  const adapter = createWhatsAppAdapter(
    { configured: true, provider: 'whatsapp', apiVersion: 'v20.0', phoneId: 'p', accessToken: 't', timeoutMs: 2000 },
    { fetchImpl: fakeFetch }
  );
  const out = await adapter.send({ to: '+15551234567', body: 'hi' }, { idempotencyKey: 'k2' });
  assert.equal(out.accepted, false);
  assert.equal(out.safeErrorCode, 'wa_auth_failed');
  assert.equal(out.retryable, false);
});

test('sendText maps 429 to retryable wa_rate_limited', async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ error: { type: 'rate_limit' } }), { status: 429 });
  const adapter = createWhatsAppAdapter(
    { configured: true, provider: 'whatsapp', apiVersion: 'v20.0', phoneId: 'p', accessToken: 't', timeoutMs: 2000 },
    { fetchImpl: fakeFetch }
  );
  const out = await adapter.send({ to: '+15551234567', body: 'hi' }, { idempotencyKey: 'k3' });
  assert.equal(out.retryable, true);
  assert.equal(out.safeErrorCode, 'wa_rate_limited');
});

test('sendTemplate posts template payload with language and components', async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push({ url, body: JSON.parse(opts.body) });
    return new Response(JSON.stringify({ messages: [{ id: 'wamid.TPL' }] }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  };
  const adapter = createWhatsAppAdapter(
    { configured: true, provider: 'whatsapp', apiVersion: 'v20.0', phoneId: 'p', accessToken: 't', timeoutMs: 2000 },
    { fetchImpl: fakeFetch }
  );
  const out = await adapter.sendTemplate(
    { to: '+15551234567', templateName: 'booking_request', languageCode: 'en', variables: ['Revanth', '2026-09-01'] },
    { idempotencyKey: 'tpl-1' }
  );
  assert.equal(out.accepted, true);
  assert.equal(out.providerEventId, 'wamid.TPL');
  assert.equal(calls[0].body.type, 'template');
  assert.equal(calls[0].body.template.name, 'booking_request');
  assert.equal(calls[0].body.template.language.code, 'en');
  assert.equal(calls[0].body.template.components[0].parameters.length, 2);
});

test('sendTemplate validates template name', async () => {
  const adapter = createWhatsAppAdapter(
    { configured: true, provider: 'whatsapp', apiVersion: 'v20.0', phoneId: 'p', accessToken: 't', timeoutMs: 2000 },
    { fetchImpl: () => { throw new Error('should not be called'); } }
  );
  const out = await adapter.sendTemplate({ to: '+15551234567', templateName: '' }, { idempotencyKey: 'k4' });
  assert.equal(out.accepted, false);
  assert.equal(out.safeErrorCode, 'wa_template_missing');
});

test('sendText timeout maps to retryable wa_provider_timeout', async () => {
  const slowFetch = () => new Promise((_, reject) => {
    const err = new Error('aborted');
    err.name = 'AbortError';
    setTimeout(() => reject(err), 5);
  });
  const adapter = createWhatsAppAdapter(
    { configured: true, provider: 'whatsapp', apiVersion: 'v20.0', phoneId: 'p', accessToken: 't', timeoutMs: 1 },
    { fetchImpl: slowFetch }
  );
  const out = await adapter.send({ to: '+15551234567', body: 'hi' }, { idempotencyKey: 'k5' });
  assert.equal(out.retryable, true);
  assert.equal(out.safeErrorCode, 'wa_provider_timeout');
});