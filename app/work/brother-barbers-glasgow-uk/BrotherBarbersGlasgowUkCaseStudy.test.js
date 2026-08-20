import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('brother-barbers-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./BrotherBarbersGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function BrotherBarbersGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
