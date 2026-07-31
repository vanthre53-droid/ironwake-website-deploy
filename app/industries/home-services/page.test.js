import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('home-services industry page stays truthful with no dispatch/telephony integration claim', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /\/systems\/missed-lead-recovery/);
  assert.match(source, /\/systems\/booking-control/);
  assert.match(source, /href="\/work\/rapidpulse"/);
  assert.match(source, /not a telephony or dispatch integration IronWake does not yet offer/);
  assert.doesNotMatch(source, /\$\d|₹\d|dispatch software|guaranteed response|24\/7 coverage/i);
});
