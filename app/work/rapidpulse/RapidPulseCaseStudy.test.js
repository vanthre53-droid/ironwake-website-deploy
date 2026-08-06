import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('rapidpulse case study is labelled demonstration with no metrics', async () => {
  const source = await readFile(new URL('./RapidPulseCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /PORTFOLIO DEMONSTRATION — capability proof, not a client engagement\./);
  assert.match(source, /does not integrate with a real telephony/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /MotionReveal/);
  assert.match(source, /Durable capture/);
  assert.doesNotMatch(source, /https?:\/\//, 'no external demo links on case study pages');
  assert.doesNotMatch(source, /\$\d|₹\d|% (faster|reduction|increase)|client said|latency of \d/i);
});
