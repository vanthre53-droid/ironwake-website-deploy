import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('westend-hair-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./WestendHairGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function WestendHairGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
