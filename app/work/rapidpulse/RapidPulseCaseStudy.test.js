import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('rapidpulse case study is labelled demonstration with no external demo link or metrics', async () => {
  const source = await readFile(new URL('./RapidPulseCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /useState/);
  assert.match(source, /PORTFOLIO DEMONSTRATION — capability proof, not a client engagement\./);
  assert.match(source, /not a connected dispatch system/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.doesNotMatch(source, /https?:\/\//, 'no external demo links are allowed on case study pages');
  assert.doesNotMatch(source, /\$\d|₹\d|% (faster|reduction|increase)|client said|latency of \d/i);
});
