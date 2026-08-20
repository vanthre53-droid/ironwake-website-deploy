import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('booking preview persists its minimum booking request through the validated audit endpoint without confirming a booking', async () => {
  const source = await readFile(new URL('./BookingPreview.js', import.meta.url), 'utf8');
  // Field primitive owns the date/select control DOM, so we assert the
  // primitive contract (Field usage + correct control kind) rather than
  // the rendered <select> literal — Field.jsx owns <select> emission.
  assert.match(source, /from '\.\.\/components\/ui\/Field\.jsx'/);
  assert.match(source, /type="date"/);
  assert.match(source, /as="select"/);
  assert.match(source, /Nothing is[\s\S]*?booked when you press send/);
  assert.match(source, /BOOKING REQUEST RECEIVED/);
  assert.match(source, /no appointment is confirmed yet/i);
  assert.match(source, /fetch\('\/api\/audit'/);
  assert.match(source, /Booking preference:/);
  assert.match(source, /I agree to be contacted about this request/);
  assert.match(source, /Request this time/);
  assert.doesNotMatch(source, /<iframe/i);
  // ponytail: booking must arrive at the CRM distinguishable from an audit
  // so the owner dashboard can route review correctly.
  assert.match(source, /source: 'website_booking'/);
});

test('booking preview uses Field primitive for a11y wiring on every input', async () => {
  const source = await readFile(new URL('./BookingPreview.js', import.meta.url), 'utf8');
  // Every visible input should bind through Field for consistent a11y.
  // The consent checkbox is the lone exception: there is no plain
  // <Field> wrapper for it because it needs a longer disclosure line
  // and a check-row layout — it still binds htmlFor/aria via useId.
  const fieldUses = (source.match(/<Field\b/g) || []).length;
  assert.ok(fieldUses >= 5, `expected >=5 <Field> usages, found ${fieldUses}`);
  // useId() for stable unique ids across SSR + hydration.
  assert.match(source, /useId\(\)/);
  // Form has aria-describedby so screen readers reach the live status.
  assert.match(source, /aria-describedby=\{ids\.status\}/);
});
