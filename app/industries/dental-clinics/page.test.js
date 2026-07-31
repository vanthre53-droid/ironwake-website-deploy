import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('dental-clinics industry page stays non-clinical and makes no compliance claim', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /[Nn]ot a clinical, diagnostic, or compliance service/);
  assert.match(source, /is not medical, diagnostic, legal, or compliance advice/);
  assert.match(source, /\/systems\/trust-lead-capture/);
  assert.match(source, /href="\/work\/dentacare-pro"/);
  assert.doesNotMatch(source, /HIPAA|diagnos(e|is)|treatment plan|\$\d|₹\d/i);
});
