import assert from 'node:assert/strict';
import test from 'node:test';
import { getSupabasePublicKey } from './supabase-public-key.mjs';

test('modern publishable key is preferred', () => {
  assert.equal(getSupabasePublicKey({ publishableKey: 'sb_publishable_modern', anonKey: 'legacy' }), 'sb_publishable_modern');
});

test('legacy anon key is supported as fallback', () => {
  assert.equal(getSupabasePublicKey({ anonKey: 'legacy' }), 'legacy');
});

test('missing public keys fail closed', () => {
  assert.equal(getSupabasePublicKey({ publishableKey: ' ', anonKey: '' }), '');
});
