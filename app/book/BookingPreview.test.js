import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('booking preview persists its minimum booking request through the validated audit endpoint without confirming a booking', async () => {
  const source = await readFile(new URL('./BookingPreview.js', import.meta.url), 'utf8');
  assert.match(source, /type="date"/);
  assert.match(source, /<select/);
  assert.match(source, /Nothing is booked when you press send/);
  assert.match(source, /fetch\('\/api\/audit'/);
  assert.match(source, /Booking preference:/);
  assert.match(source, /I agree to be contacted about this request/);
  assert.match(source, /Request this time/);
  assert.doesNotMatch(source, /<iframe/i);
});
