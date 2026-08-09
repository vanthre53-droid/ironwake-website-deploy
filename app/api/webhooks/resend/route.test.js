import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { GET, handleResendWebhook } from './route.js';

const secretBytes = Buffer.from('ironwake-webhook-fixture-secret');
const webhookSecret = `whsec_${secretBytes.toString('base64')}`;
const env = { RESEND_WEBHOOK_SECRET: webhookSecret };

function signedRequest(payload, {
  id = 'webhook-event-1',
  timestamp = Math.floor(Date.now() / 1000),
  secret = secretBytes,
  signaturePrefix = 'svix'
} = {}) {
  const raw = JSON.stringify(payload);
  const signature = createHmac('sha256', secret).update(`${id}.${timestamp}.${raw}`).digest('base64');
  return new Request('https://example.test/api/webhooks/resend', {
    method: 'POST',
    headers: {
      [`${signaturePrefix}-id`]: id,
      [`${signaturePrefix}-timestamp`]: String(timestamp),
      [`${signaturePrefix}-signature`]: `v1,${signature}`,
      'content-type': 'application/json'
    },
    body: raw
  });
}

function emailEvent(type = 'email.delivered', overrides = {}) {
  return {
    type,
    created_at: '2026-08-09T11:00:00.000Z',
    data: {
      email_id: 'provider-message-1',
      created_at: '2026-08-09T10:59:00.000Z',
      from: 'notify@example.test',
      to: ['customer@example.test'],
      subject: 'Request received',
      ...overrides
    }
  };
}

async function body(response) {
  return response.json();
}

test('valid signed delivery stores normalized metadata only', async () => {
  const calls = [];
  const response = await handleResendWebhook(signedRequest(emailEvent()), {
    env,
    store: { recordProviderEvent: async (value) => { calls.push(value); return true; } }
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await body(response), { received: true, duplicate: false });
  assert.deepEqual(calls, [{
    provider: 'resend', providerEventId: 'webhook-event-1', eventType: 'email.delivered',
    providerMessageId: 'provider-message-1', occurredAt: '2026-08-09T11:00:00.000Z'
  }]);
  assert.equal(Object.hasOwn(calls[0], 'to'), false);
  assert.equal(Object.hasOwn(calls[0], 'subject'), false);
});

test('forged, missing, and stale signatures fail closed before storage', async () => {
  let stored = false;
  const store = { recordProviderEvent: async () => { stored = true; } };
  const forged = await handleResendWebhook(signedRequest(emailEvent(), { secret: Buffer.from('wrong-secret') }), { env, store });
  const missing = await handleResendWebhook(new Request('https://example.test/api/webhooks/resend', {
    method: 'POST', body: JSON.stringify(emailEvent())
  }), { env, store });
  const stale = await handleResendWebhook(signedRequest(emailEvent(), { timestamp: Math.floor(Date.now() / 1000) - 601 }), { env, store });
  assert.equal(forged.status, 401);
  assert.equal(missing.status, 401);
  assert.equal(stale.status, 401);
  assert.equal(stored, false);
});

test('replayed provider event is acknowledged as a durable duplicate', async () => {
  const response = await handleResendWebhook(signedRequest(emailEvent()), {
    env,
    store: { recordProviderEvent: async () => false }
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await body(response), { received: true, duplicate: true });
});

test('unknown provider message and standard webhook headers are safely persisted for correlation', async () => {
  const calls = [];
  const response = await handleResendWebhook(signedRequest(emailEvent('email.sent', { email_id: 'unknown-message' }), {
    id: 'unknown-event', signaturePrefix: 'webhook'
  }), { env, store: { recordProviderEvent: async (value) => { calls.push(value); return true; } } });
  assert.equal(response.status, 200);
  assert.equal(calls[0].providerMessageId, 'unknown-message');
  assert.equal(calls[0].providerEventId, 'unknown-event');
});

test('unsupported valid event is acknowledged without database mutation', async () => {
  let stored = false;
  const response = await handleResendWebhook(signedRequest(emailEvent('email.opened')), {
    env,
    store: { recordProviderEvent: async () => { stored = true; } }
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await body(response), { received: true, ignored: true });
  assert.equal(stored, false);
});

test('out-of-order delivered and terminal-failure events retain their verified order for the database state machine', async () => {
  const types = [];
  const store = { recordProviderEvent: async (value) => { types.push(value.eventType); return true; } };
  const delivered = await handleResendWebhook(signedRequest(emailEvent('email.delivered'), { id: 'delivered-event' }), { env, store });
  const bounced = await handleResendWebhook(signedRequest(emailEvent('email.bounced'), { id: 'bounced-event' }), { env, store });
  assert.equal(delivered.status, 200);
  assert.equal(bounced.status, 200);
  assert.deepEqual(types, ['email.delivered', 'email.bounced']);
});

test('signed malformed payload and database failure return safe retry-aware responses', async () => {
  const malformed = await handleResendWebhook(signedRequest(emailEvent('email.failed', { email_id: '' })), {
    env, store: { recordProviderEvent: async () => true }
  });
  const databaseFailure = await handleResendWebhook(signedRequest(emailEvent('email.complained')), {
    env, store: { recordProviderEvent: async () => { throw new Error('private database detail'); } }
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await body(malformed), { received: false, error: 'Webhook payload is invalid.' });
  assert.equal(databaseFailure.status, 503);
  assert.deepEqual(await body(databaseFailure), { received: false, error: 'Webhook could not be stored.' });
});

test('unreadable bodies fail closed before signature verification or storage', async () => {
  let verified = false;
  let stored = false;
  const response = await handleResendWebhook({
    headers: new Headers({ 'content-length': '10' }),
    text: async () => { throw new Error('stream read failed'); }
  }, {
    env,
    verify: () => { verified = true; },
    store: { recordProviderEvent: async () => { stored = true; } }
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await body(response), { received: false, error: 'Webhook payload is invalid.' });
  assert.equal(verified, false);
  assert.equal(stored, false);
});

test('route reads request text and never parses unsigned JSON or exposes secrets', async () => {
  const source = await readFile(new URL('./route.js', import.meta.url), 'utf8');
  assert.match(source, /await request\.text\(\)/);
  assert.doesNotMatch(source, /request\.json\(/);
  assert.match(source, /RESEND_WEBHOOK_SECRET/);
  assert.doesNotMatch(source, /console\./);
});

test('webhook replies are non-cacheable and unsupported methods are safe', async () => {
  const disabled = await handleResendWebhook(new Request('https://example.test/api/webhooks/resend', { method: 'POST' }), { env: {} });
  assert.equal(disabled.headers.get('cache-control'), 'no-store');
  const response = await GET(new Request('https://example.test/api/webhooks/resend', { method: 'GET' }));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
