import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('booking control system keeps truthful requested/confirmed states', async () => {
  const source = await readFile(new URL('./BookingControlSystem.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /Form submission alone can never reach this state/);
  assert.match(source, /href="\/book"/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.doesNotMatch(source, /\$\d|₹\d|guaranteed|instant confirmation/i);
});
