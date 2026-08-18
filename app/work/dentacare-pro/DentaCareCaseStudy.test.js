import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('DentaCare case study is labelled demonstration with no clinical claims', async () => {
  const source = await readFile(new URL('./DentaCareCaseStudy.js', import.meta.url), 'utf8');
  const shared = await readFile(new URL('../../components/CaseStudyStory.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /CaseStudyStory/);
  assert.match(shared, /PORTFOLIO DEMONSTRATION/);
  assert.match(shared, /Demonstration only/);
  assert.match(shared, /does not represent a client relationship/);
  assert.doesNotMatch(source, /https?:\/\/(?!localhost)/, 'no external links');
  assert.doesNotMatch(source, /client said|our client|measured result|production result/i);
});
