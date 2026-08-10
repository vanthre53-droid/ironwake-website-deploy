import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyAuthError, getAalFromJwt, parseBearerToken } from './owner-auth.mjs';

test('bearer parser accepts one bounded token and rejects ambiguous or unsafe forms', () => {
  assert.equal(parseBearerToken('Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.signature'), 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.signature');
  for (const value of [
    undefined,
    '',
    'Basic abc',
    'Bearer ',
    'Bearer token extra',
    'Bearer token\nnext',
    `Bearer ${'a'.repeat(8_193)}`
  ]) assert.equal(parseBearerToken(value), null);
});

test('JWT assurance helper recognizes only aal1 and aal2', () => {
  const encode = (value) => `${Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url')}.${Buffer.from(JSON.stringify(value)).toString('base64url')}.x`;
  assert.equal(getAalFromJwt(encode({ aal: 'aal2' })), 'aal2');
  assert.equal(getAalFromJwt(encode({ aal: 'aal1' })), 'aal1');
  assert.equal(getAalFromJwt(encode({ aal: 'aal0' })), null);
});

test('auth errors retain safe operational classes', () => {
  assert.equal(classifyAuthError({ code: 'invalid_credentials' }), 'invalid_credentials');
  assert.equal(classifyAuthError({ message: 'UNAUTHORIZED_INVALID_API_KEY' }), 'configuration_error');
  assert.equal(classifyAuthError({ code: 'mfa_verification_failed' }), 'mfa_invalid');
  assert.equal(classifyAuthError({ name: 'AuthRetryableFetchError' }), 'network_unavailable');
});
