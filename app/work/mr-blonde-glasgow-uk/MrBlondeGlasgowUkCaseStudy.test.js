import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mr-blonde-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./MrBlondeGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function MrBlondeGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
