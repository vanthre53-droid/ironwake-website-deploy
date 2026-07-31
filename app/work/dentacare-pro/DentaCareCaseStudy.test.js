import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('dentacare case study stays non-clinical, demonstration-labelled, with no external demo link', async () => {
  const source = await readFile(new URL('./DentaCareCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /PORTFOLIO DEMONSTRATION — capability proof, not a client engagement\./);
  assert.match(source, /does not provide or claim any clinical, diagnostic, or compliance service/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.doesNotMatch(source, /https?:\/\//, 'no external demo links are allowed on case study pages');
  assert.doesNotMatch(source, /HIPAA|diagnos(e|is)|treatment plan|\$\d|₹\d|client said/i);
});
