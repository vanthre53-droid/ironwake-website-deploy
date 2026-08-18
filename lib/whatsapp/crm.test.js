// lib/whatsapp/crm.test.js

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveContact, normalizeE164 } from './crm.js';

test('normalizeE164 strips spaces, dashes, parens and enforces + prefix', () => {
  assert.equal(normalizeE164('  +1 (555) 123-4567 '), '+15551234567');
  assert.equal(normalizeE164('+15551234567'), '+15551234567');
  assert.equal(normalizeE164('5551234567'), null);
  assert.equal(normalizeE164('+0123456789'), null);
  assert.equal(normalizeE164(null), null);
  assert.equal(normalizeE164(42), null);
});

test('resolveContact returns invalid_phone for bad input', async () => {
  const r = await resolveContact({ from: 'not-a-number' });
  assert.equal(r.status, 'invalid_phone');
});

test('resolveContact returns supabase_unconfigured when env missing', async () => {
  const r = await resolveContact({
    from: '+15551234567',
    env: {}
  });
  assert.equal(r.status, 'supabase_unconfigured');
});
