import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('booking-control page is a metadata wrapper around the client system view', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /Booking Certainty/);
  assert.match(source, /<BookingControlSystem \/>/);
});
