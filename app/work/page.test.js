import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('work page keeps demonstrations labelled and free of client-engagement claims', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Demonstrations, not claims/);
  assert.match(source, /RapidPulse Response/);
  assert.match(source, /DentaCare Intake/);
  assert.match(source, /Atelier Safe/);
  assert.match(source, /PORTFOLIO DEMONSTRATION — capability proof; not a client engagement\./);
  assert.match(source, /export const metadata/);
  assert.match(source, /No testimonial/, 'must explicitly deny a testimonial, not merely omit the word');
  assert.match(source, /\/work\/rapidpulse/);
  assert.match(source, /\/work\/dentacare-pro/);
  assert.match(source, /\/work\/atelier/);
  assert.doesNotMatch(source, /client said|% (faster|reduction|increase)/i);
});
