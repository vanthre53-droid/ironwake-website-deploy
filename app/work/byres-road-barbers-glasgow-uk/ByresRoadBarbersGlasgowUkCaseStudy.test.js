import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('byres-road-barbers-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./ByresRoadBarbersGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function ByresRoadBarbersGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
