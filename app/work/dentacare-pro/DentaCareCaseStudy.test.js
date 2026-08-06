import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('dentacare case study stays non-clinical, demonstration-labelled', async () => {
  const source = await readFile(new URL('./DentaCareCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /PORTFOLIO DEMONSTRATION — capability proof, not a client engagement\./);
  assert.match(source, /no clinical or compliance claim/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /MotionReveal/);
  assert.match(source, /Validated intake/);
  assert.doesNotMatch(source, /https?:\/\//, 'no external demo links on case study pages');
  assert.doesNotMatch(source, /HIPAA|diagnos(e|is)|treatment plan|\$\d|₹\d|client said/i);
});
