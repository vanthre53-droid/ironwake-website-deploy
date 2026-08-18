import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

// ponytail: demonstration labelling is centralised in the shared
// CaseStudyStory component — assert there, like dentacare-pro and rapidpulse do.
test('RE-TECH case study is labelled demonstration with no external demo link or metrics', async () => {
  const source = await readFile(new URL('./RetechCaseStudy.js', import.meta.url), 'utf8');
  const shared = await readFile(new URL('../../components/CaseStudyStory.js', import.meta.url), 'utf8');
  assert.match(source, /CaseStudyStory/);
  assert.match(source, /portfolio demonstration/);
  assert.match(shared, /PORTFOLIO DEMONSTRATION/);
  assert.match(shared, /Demonstration only/);
  assert.match(shared, /does not represent a client relationship/);
  assert.doesNotMatch(source, /https?:\/\/(?!localhost)/);
});
