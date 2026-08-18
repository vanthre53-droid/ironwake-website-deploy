// lib/whatsapp/signature.test.js
//
// ponytail: tests for X-Hub-Signature-256 verification + GET
// challenge handshake. Pure functions, no env access required.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import {
  verifyMetaSignature,
  verifyWebhookChallenge,
  META_SIGNATURE_HEADER,
  __internals
} from './signature.js';

if (!globalThis.crypto && webcrypto) globalThis.crypto = webcrypto;

test('verifyMetaSignature accepts a valid sha256= HMAC', async () => {
  const secret = 'app-secret-xyz';
  const body = '{"entry":[{"id":"x"}]}';
  const { hex } = await __internals.hmacSha256(secret, body);
  const result = await verifyMetaSignature({
    rawBody: body,
    signatureHeader: `sha256=${hex}`,
    appSecret: secret
  });
  assert.equal(result.ok, true);
});

test('verifyMetaSignature rejects a tampered body', async () => {
  const secret = 'app-secret-xyz';
  const body = '{"entry":[{"id":"x"}]}';
  const { hex } = await __internals.hmacSha256(secret, body);
  const result = await verifyMetaSignature({
    rawBody: `${body}pwned`,
    signatureHeader: `sha256=${hex}`,
    appSecret: secret
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'signature_mismatch');
});

test('verifyMetaSignature rejects a missing signature header', async () => {
  const result = await verifyMetaSignature({
    rawBody: 'anything',
    signatureHeader: '',
    appSecret: 'secret'
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'missing_signature');
});

test('verifyMetaSignature rejects a missing body', async () => {
  const result = await verifyMetaSignature({
    rawBody: '',
    signatureHeader: 'sha256=abc',
    appSecret: 'secret'
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'missing_body');
});

test('verifyMetaSignature rejects a missing app secret', async () => {
  const result = await verifyMetaSignature({
    rawBody: 'x',
    signatureHeader: 'sha256=abc',
    appSecret: ''
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'missing_secret');
});

test('verifyMetaSignature rejects a non-sha256 prefix', async () => {
  const result = await verifyMetaSignature({
    rawBody: 'x',
    signatureHeader: 'md5=abcdef',
    appSecret: 'secret'
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'malformed_signature');
});

test('verifyMetaSignature rejects non-hex signature', async () => {
  const result = await verifyMetaSignature({
    rawBody: 'x',
    signatureHeader: 'sha256=not-hex-data',
    appSecret: 'secret'
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'malformed_signature');
});

test('verifyWebhookChallenge accepts subscribe + matching token', () => {
  const result = verifyWebhookChallenge({
    mode: 'subscribe',
    token: 'shared-token-abc',
    expected: 'shared-token-abc'
  });
  assert.equal(result.ok, true);
});

test('verifyWebhookChallenge rejects different modes', () => {
  const result = verifyWebhookChallenge({
    mode: 'unsubscribe',
    token: 'shared',
    expected: 'shared'
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'mode_mismatch');
  assert.equal(result.httpStatus, 404);
});

test('verifyWebhookChallenge rejects mismatched tokens', () => {
  const result = verifyWebhookChallenge({
    mode: 'subscribe',
    token: 'shared-token-abc',
    expected: 'shared-token-def'
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'token_mismatch');
  assert.equal(result.httpStatus, 403);
});

test('verifyWebhookChallenge rejects empty expected', () => {
  const result = verifyWebhookChallenge({
    mode: 'subscribe',
    token: 'shared',
    expected: ''
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'token_missing');
});

test('META_SIGNATURE_HEADER is the documented header name', () => {
  assert.equal(META_SIGNATURE_HEADER, 'x-hub-signature-256');
});
