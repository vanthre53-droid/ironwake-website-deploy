import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('roseberry-spa-delhi-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./RoseberrySpaDelhiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function RoseberrySpaDelhiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
