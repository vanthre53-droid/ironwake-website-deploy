import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('interactive lead journey does not represent unconnected phone or messaging routes as live', async () => {
  const source = await readFile(new URL('./InteractiveLeadJourney.js', import.meta.url), 'utf8');

  assert.match(source, /Only the website-form route is connected on this site\./);
  assert.match(source, /Phone, SMS, WhatsApp, and DM routes are future workflow examples/);
  assert.match(source, /Future provider: missed-call detection/);
  assert.match(source, /Future provider: consent capture/);
  assert.match(source, /Notification intent queued/);
  assert.doesNotMatch(source, /Owner notified via SMS \+ email/);
  assert.doesNotMatch(source, /Auto SMS callback link/);
});
