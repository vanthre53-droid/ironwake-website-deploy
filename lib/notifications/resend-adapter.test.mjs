import assert from 'node:assert/strict';
import test from 'node:test';
import { createResendAdapter } from './resend-adapter.mjs';

const config = { configured: true, provider: 'resend', apiKey: 'test-only' };
const message = {
  from: 'notify@example.test',
  to: 'customer@example.test',
  replyTo: 'hello@example.test',
  subject: 'Request received',
  text: 'Plain text',
  html: '<p>Plain text</p>'
};

test('Resend adapter returns a provider-neutral acceptance and durable idempotency option', async () => {
  const calls = [];
  const client = { emails: { send: async (...args) => {
    calls.push(args);
    return { data: { id: 'email-123' }, error: null };
  } } };
  const adapter = createResendAdapter(config, { client });
  const result = await adapter.send(message, { idempotencyKey: 'customer_audit_received:inquiry-1' });
  assert.deepEqual(result, { accepted: true, status: 'accepted', providerEventId: 'email-123', retryable: false });
  assert.equal(calls[0][1].idempotencyKey, 'customer_audit_received:inquiry-1');
  assert.equal(calls[0][0].reply_to, 'hello@example.test');
});

test('Resend adapter reuses the same idempotency key on duplicate invocations', async () => {
  const keys = [];
  const client = { emails: { send: async (_payload, options) => {
    keys.push(options.idempotencyKey);
    return { data: { id: 'same-provider-id' }, error: null };
  } } };
  const adapter = createResendAdapter(config, { client });
  await adapter.send(message, { idempotencyKey: 'owner_new_audit:inquiry-2' });
  await adapter.send(message, { idempotencyKey: 'owner_new_audit:inquiry-2' });
  assert.deepEqual(keys, ['owner_new_audit:inquiry-2', 'owner_new_audit:inquiry-2']);
});

test('Resend adapter classifies timeout as unknown and retryable without waiting eight seconds', async () => {
  const client = { emails: { send: async () => new Promise(() => {}) } };
  const adapter = createResendAdapter(config, { client, timeoutMs: 5 });
  const result = await adapter.send(message, { idempotencyKey: 'timeout:test' });
  assert.deepEqual(result, { accepted: false, status: 'unknown', retryable: true, safeErrorCode: 'provider_timeout' });
});

test('Resend adapter separates retryable and permanent provider failures', async () => {
  const retryable = createResendAdapter(config, { client: { emails: { send: async () => ({ data: null, error: { name: 'rate_limit_exceeded', statusCode: 429 } }) } } });
  const permanent = createResendAdapter(config, { client: { emails: { send: async () => ({ data: null, error: { name: 'invalid_from_address', statusCode: 422 } }) } } });
  assert.equal((await retryable.send(message, { idempotencyKey: 'retryable:test' })).retryable, true);
  const permanentResult = await permanent.send(message, { idempotencyKey: 'permanent:test' });
  assert.equal(permanentResult.retryable, false);
  assert.equal(permanentResult.safeErrorCode, 'resend_invalid_from_address');
});
