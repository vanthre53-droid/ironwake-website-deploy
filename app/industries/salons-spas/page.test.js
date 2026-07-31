import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('salons-spas industry page stays truthful with no booking/payment integration claim', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /\/systems\/trust-lead-capture/);
  assert.match(source, /\/systems\/booking-control/);
  assert.match(source, /href="\/work\/atelier"/);
  assert.match(source, /not a booking-calendar or payment integration IronWake does not yet offer/);
  assert.doesNotMatch(source, /\$\d|₹\d|guaranteed booking|instant confirmation/i);
});
