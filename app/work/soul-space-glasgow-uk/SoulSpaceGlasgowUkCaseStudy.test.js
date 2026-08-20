import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('soul-space-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./SoulSpaceGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function SoulSpaceGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
