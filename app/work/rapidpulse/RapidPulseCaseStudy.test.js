import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('RapidPulse case study is labelled demonstration with no external demo link or metrics', async () => {
  const source = await readFile(new URL('./RapidPulseCaseStudy.js', import.meta.url), 'utf8');
  const shared = await readFile(new URL('../../components/CaseStudyStory.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /CaseStudyStory/);
  assert.match(source, /designed demonstration/);
  assert.match(shared, /PORTFOLIO DEMONSTRATION/);
  assert.match(shared, /Demonstration only/);
  assert.match(shared, /does not represent a client relationship/);
  assert.match(shared, /not a client engagement/);
  assert.doesNotMatch(source, /https?:\/\/(?!localhost)/, 'no external demo links on case study pages');
  assert.doesNotMatch(source, /client said|our client|measured result|production result/i);
});

// ponytail: regression guard — the case study hero copy must use the language "demonstration" rather than "concept" so it does not contradict the R14 truth that IronWake services are real public offers.
test('RapidPulse case study does not label the work as a "concept"', async () => {
  const source = await readFile(new URL('./RapidPulseCaseStudy.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /designed concept/);
  assert.doesNotMatch(source, /a concept/);
  assert.match(source, /designed demonstration/);
});
