import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('work page keeps demonstrations labelled and free of client-engagement claims', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Nine businesses/);
  assert.match(source, /RapidPulse Response/);
  assert.match(source, /DentaCare Intake/);
  assert.match(source, /Atelier Safe/);
  assert.match(source, /PORTFOLIO DEMONSTRATION — capability proof; not a client engagement\./);
  assert.match(source, /export const metadata/);
  assert.match(source, /No testimonial/, 'must explicitly deny a testimonial, not merely omit the word');
  assert.match(source, /rapidpulse-plumbing\.vercel\.app/);
  assert.match(source, /bristol-architectural\.vercel\.app/);
  assert.match(source, /manchester-gentle-dental\.vercel\.app/);
  assert.match(source, /bluestone-jewellery-prototype\.vercel\.app/);
  assert.match(source, /luxe-studio-wine\.vercel\.app/);
  // P7 bramble-cafe external link intentionally removed: live-demo metadata defect cannot be corrected from this repo.
  assert.match(source, /External demo pending/);
  assert.match(source, /voltix-fawn\.vercel\.app/);
  // P9 re-tech + P10 atelier external links removed this cycle: live-demo
  // metadata defects on those production URLs cannot be corrected from this
  // repository until legitimate Vercel access is restored and dependency
  // installs are authorized. The URL is preserved in lib/portfolio-urls.mjs
  // for the cross-repo integrity test.
  assert.match(source, /externalPending: true/);
  assert.match(source, /caseHref/);
  assert.match(source, /View live demo/);
  assert.doesNotMatch(source, /client said|% (faster|reduction|increase)/i);
});
