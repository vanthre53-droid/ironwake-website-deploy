import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('hot-tanning-salon-watson-st-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./HotTanningSalonWatsonStGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function HotTanningSalonWatsonStGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
