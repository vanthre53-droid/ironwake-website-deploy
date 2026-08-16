import assert from 'node:assert/strict';
import test from 'node:test';
import { safeAuthRedirect, isAllowedAuthOrigin, canonicalAuthOrigin } from './auth-redirect-allowlist.mjs';

test('safeAuthRedirect accepts canonical ironwake.dev path', () => {
  assert.equal(safeAuthRedirect('/account'), 'https://ironwake.dev/account');
  assert.equal(safeAuthRedirect('/login?next=/account'), 'https://ironwake.dev/login?next=/account');
});

test('safeAuthRedirect rejects open-redirect attempts', () => {
  // ponytail: Goal §13 — any input that does not resolve to the
  // canonical origin (or the path-only form of it) must fall back to
  // the canonical root.
  assert.equal(safeAuthRedirect('//evil.example/path'), 'https://ironwake.dev');
  assert.equal(safeAuthRedirect('https://evil.example/path'), 'https://ironwake.dev');
  assert.equal(safeAuthRedirect('javascript:alert(1)'), 'https://ironwake.dev');
  assert.equal(safeAuthRedirect('  /good  '), 'https://ironwake.dev/good');
  assert.equal(safeAuthRedirect(null), 'https://ironwake.dev');
  assert.equal(safeAuthRedirect(''), 'https://ironwake.dev');
});

test('isAllowedAuthOrigin only allows canonical and explicit dev origins', () => {
  assert.equal(isAllowedAuthOrigin('https://ironwake.dev'), true);
  assert.equal(isAllowedAuthOrigin('https://www.ironwake.dev'), true);
  assert.equal(isAllowedAuthOrigin('http://localhost:3000'), true);
  assert.equal(isAllowedAuthOrigin('https://evil.example'), false);
  assert.equal(isAllowedAuthOrigin('https://ironwake.netlify.app'), false);
  assert.equal(isAllowedAuthOrigin('not-a-url'), false);
});

test('canonicalAuthOrigin returns https://ironwake.dev', () => {
  assert.equal(canonicalAuthOrigin(), 'https://ironwake.dev');
});
