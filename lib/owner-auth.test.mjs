import assert from 'node:assert/strict';
import test from 'node:test';
import { parseBearerToken } from './owner-auth.mjs';

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
