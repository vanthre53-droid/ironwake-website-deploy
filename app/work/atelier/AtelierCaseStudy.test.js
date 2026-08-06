import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('atelier case study is labelled demonstration with no metrics', async () => {
  const source = await readFile(new URL('./AtelierCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /PORTFOLIO DEMONSTRATION — capability proof, not a client engagement\./);
  assert.match(source, /does not connect to a live booking calendar/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /MotionReveal/);
  assert.match(source, /Consultation capture/);
  assert.doesNotMatch(source, /https?:\/\//, 'no external demo links on case study pages');
  assert.doesNotMatch(source, /\$\d|₹\d|client said|% (faster|reduction|increase)/i);
});
