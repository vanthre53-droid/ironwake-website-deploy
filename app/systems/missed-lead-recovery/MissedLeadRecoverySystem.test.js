import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('missed lead recovery system stays truthful and interactive', async () => {
  const source = await readFile(new URL('./MissedLeadRecoverySystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /aria-pressed={active === id}/);
  assert.match(source, /Request a Business Leak Audit/);
  assert.match(source, /dead-letter/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.doesNotMatch(source, /\$\d|₹\d|guaranteed|100%|24\/7/i);
});
