import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('industries index links to all three industry pages with no invented statistics', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /\/industries\/home-services/);
  assert.match(source, /\/industries\/dental-clinics/);
  assert.match(source, /\/industries\/salons-spas/);
  assert.match(source, /No invented client counts/);
  assert.doesNotMatch(source, /\$\d|₹\d|clients served|% of/i);
});
