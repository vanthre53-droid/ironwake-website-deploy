import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('goat-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./GoatGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function GoatGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
