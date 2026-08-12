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

// ponytail: the rate-limit identity MUST come from the platform-populated
// trusted header. Spoofed x-forwarded-for / x-real-ip / cf-connecting-ip
// MUST NOT influence the bucket key, otherwise an attacker can mint a
// fresh bucket per request and bypass the limit.
test('request identity uses the trusted Netlify client IP header', () => {
  const headers = new Headers({ 'x-nf-client-connection-ip': '203.0.113.9' });
  assert.equal(requestIdentity({ headers }), '203.0.113.9');
});

test('request identity ignores attacker-supplied x-forwarded-for', () => {
  const headers = new Headers({
    'x-forwarded-for': '1.2.3.4, 5.6.7.8',
    'x-real-ip': '9.9.9.9',
  });
  assert.equal(requestIdentity({ headers }), 'unknown');
});

test('request identity ignores x-forwarded-for even when trusted header is also present', () => {
  const headers = new Headers({
    'x-forwarded-for': '1.2.3.4',
    'x-nf-client-connection-ip': '203.0.113.9',
  });
  assert.equal(requestIdentity({ headers }), '203.0.113.9');
});

test('request identity falls back to "unknown" when no trusted header is present', () => {
  assert.equal(requestIdentity({ headers: new Headers({}) }), 'unknown');
  assert.equal(requestIdentity({ headers: new Headers({ 'x-forwarded-for': '1.2.3.4' }) }), 'unknown');
  assert.equal(requestIdentity({ headers: new Headers({ 'x-real-ip': '1.2.3.4' }) }), 'unknown');
  assert.equal(requestIdentity({ headers: new Headers({ 'cf-connecting-ip': '1.2.3.4' }) }), 'unknown');
});

test('rotating x-forwarded-for cannot mint new rate-limit buckets', () => {
  // The whole point of the fix: a single real client cannot rotate
  // headers to evade the rate limit. With trusted identity, the bucket
  // is determined by the trusted platform IP (or "unknown" sentinel),
  // not by attacker-supplied forwarding headers.
  const baseKey = 'rl-rotation-test';
  // Same real client, different x-forwarded-for values, but no trusted
  // header: all map to "unknown" → same bucket key.
  for (const spoofed of ['1.1.1.1', '2.2.2.2', '3.3.3.3']) {
    const identity = requestIdentity({
      headers: new Headers({ 'x-forwarded-for': spoofed, 'x-real-ip': spoofed }),
    });
    assert.equal(identity, 'unknown', `spoofed header ${spoofed} should be ignored`);
  }
});