import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('rapidpulse case study is labelled demonstration with no client claims', async () => {
  const source = await readFile(new URL('./RapidPulseCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /DEMONSTRATION/);
  assert.match(source, /not a client engagement/);
  assert.match(source, /AWAITING VERIFICATION/);
  assert.match(source, /SiteHeader/);
  assert.match(source, /SiteFooter/);
  assert.match(source, /MotionReveal/);
  assert.doesNotMatch(source, /https?:\/\//, 'no external demo links on case study pages');
  assert.doesNotMatch(source, /client said|our client|measured result|production result/i);
});

// ponytail: regression guard — the case study hero copy must use the language "demonstration" rather than "concept" so it does not contradict the R14 truth that IronWake services are real public offers.
test('rapidpulse case study does not label the work as a "concept"', async () => {
  const source = await readFile(new URL('./RapidPulseCaseStudy.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /designed concept/);
  assert.doesNotMatch(source, /a concept/);
  assert.match(source, /designed demonstration/);
});
