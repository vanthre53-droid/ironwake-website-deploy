import assert from 'node:assert/strict';
import test from 'node:test';
import { createHmac, webcrypto } from 'node:crypto';
import { verifyMetaSignature, isValidVerifyToken, META_SIGNATURE_HEADER, messageKey } from './meta-webhook-verify.mjs';

// ponytail: tests run on Node 20 which exposes Web Crypto as
// globalThis.crypto. Force a check just in case the runtime version
// is older (CI, custom Alpine, etc.).
if (!globalThis.crypto && webcrypto) globalThis.crypto = webcrypto;

test('isValidVerifyToken requires exact match with length check', () => {
  assert.equal(isValidVerifyToken({ presented: 'shared-token-abc', expected: 'shared-token-abc' }), true);
  assert.equal(isValidVerifyToken({ presented: 'shared-token-abc', expected: 'shared-token-abd' }), false);
  assert.equal(isValidVerifyToken({ presented: '', expected: 'shared-token-abc' }), false);
  assert.equal(isValidVerifyToken({ presented: null, expected: 'shared-token-abc' }), false);
  assert.equal(isValidVerifyToken({ presented: 'shared-token-abc', expected: '' }), false);
  assert.equal(isValidVerifyToken({ presented: 'shared-token', expected: 'shared-token-longer' }), false);
});

test('verifyMetaSignature accepts a valid sha256= prefix HMAC', async () => {
  const secret = 'app-secret-xyz';
  const body = '{"entry":[{"id":"x"}]}';
  const sig = 'sha256=' + createHmac('sha256', secret).update(body, 'utf8').digest('hex');
  const result = await verifyMetaSignature({ rawBody: body, signatureHeader: sig, appSecret: secret });
  assert.equal(result.ok, true);
});

test('verifyMetaSignature rejects a tampered body', async () => {
  const secret = 'app-secret-xyz';
  const body = '{"entry":[{"id":"x"}]}';
  const sig = 'sha256=' + createHmac('sha256', secret).update(body, 'utf8').digest('hex');
  const result = await verifyMetaSignature({ rawBody: body + 'tampered', signatureHeader: sig, appSecret: secret });
  assert.equal(result.ok, false);
});

test('verifyMetaSignature rejects a wrong-key HMAC', async () => {
  const body = '{"entry":[{"id":"x"}]}';
  const sig = 'sha256=' + createHmac('sha256', 'wrong-secret').update(body, 'utf8').digest('hex');
  const result = await verifyMetaSignature({ rawBody: body, signatureHeader: sig, appSecret: 'app-secret-xyz' });
  assert.equal(result.ok, false);
});

test('verifyMetaSignature rejects malformed signature headers', async () => {
  assert.equal((await verifyMetaSignature({ rawBody: 'x', signatureHeader: 'nosha256prefix', appSecret: 's' })).ok, false);
  assert.equal((await verifyMetaSignature({ rawBody: 'x', signatureHeader: '', appSecret: 's' })).ok, false);
  assert.equal((await verifyMetaSignature({ rawBody: 'x', signatureHeader: null, appSecret: 's' })).ok, false);
});

test('verifyMetaSignature rejects when appSecret or body is missing', async () => {
  assert.equal((await verifyMetaSignature({ rawBody: 'x', signatureHeader: 'sha256=abc', appSecret: '' })).ok, false);
  assert.equal((await verifyMetaSignature({ rawBody: 'x', signatureHeader: 'sha256=abc', appSecret: null })).ok, false);
  assert.equal((await verifyMetaSignature({ rawBody: '', signatureHeader: 'sha256=abc', appSecret: 's' })).ok, false);
});

test('verifyMetaSignature rejects when presented hex is malformed', async () => {
  // ponytail: guards the hex decoder path that replaced node:crypto's
  // Buffer.from(..., 'hex') so a malformed header never throws.
  const secret = 'app-secret-xyz';
  const body = '{"entry":[{"id":"x"}]}';
  assert.equal((await verifyMetaSignature({ rawBody: body, signatureHeader: 'sha256=zz', appSecret: secret })).ok, false);
  assert.equal((await verifyMetaSignature({ rawBody: body, signatureHeader: 'sha256=ab', appSecret: secret })).ok, false);
});

test('META_SIGNATURE_HEADER is the documented X-Hub-Signature-256 header name', () => {
  assert.equal(META_SIGNATURE_HEADER, 'x-hub-signature-256');
});

test('messageKey extracts a stable message/status id from a payload', () => {
  const payload = { entry: [{ id: 'E1', changes: [{ value: { messages: [{ id: 'WAM1', from: '15555550100', text: { body: 'hi' } }] } }] }] };
  assert.equal(messageKey(payload), 'wamid:WAM1');
  assert.equal(messageKey({ entry: [{ id: 'E1', changes: [{ value: { statuses: [{ id: 'STAT1' }] } }] }] }), 'status:STAT1');
  assert.equal(messageKey({}), null);
  assert.equal(messageKey(null), null);
  assert.equal(messageKey({ entry: [] }), null);
});
