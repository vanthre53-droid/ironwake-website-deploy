import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('trust lead capture system documents real validation and credential handling', async () => {
  const source = await readFile(new URL('./TrustLeadCaptureSystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /Hidden trap field/);
  assert.match(source, /No service-role key in the browser/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.doesNotMatch(source, /military-grade|100% secure|\$\d|₹\d/i);
});
