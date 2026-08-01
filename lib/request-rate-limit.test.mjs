import assert from 'node:assert/strict';
import test from 'node:test';
import { allowRequest, requestIdentity } from './request-rate-limit.mjs';

test('request limiter rejects excess requests until its window expires', () => {
  const key = `test-${Date.now()}`;
  assert.equal(allowRequest(key, { now: 0, limit: 2, windowMs: 100 }), true);
  assert.equal(allowRequest(key, { now: 1, limit: 2, windowMs: 100 }), true);
  assert.equal(allowRequest(key, { now: 2, limit: 2, windowMs: 100 }), false);
  assert.equal(allowRequest(key, { now: 101, limit: 2, windowMs: 100 }), true);
});

test('request identity uses the first forwarded address', () => {
  assert.equal(requestIdentity({ headers: new Headers({ 'x-forwarded-for': '203.0.113.9, proxy' }) }), '203.0.113.9');
});
