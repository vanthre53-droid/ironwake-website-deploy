import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('atmos-hair-studio-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./AtmosHairStudioGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function AtmosHairStudioGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
