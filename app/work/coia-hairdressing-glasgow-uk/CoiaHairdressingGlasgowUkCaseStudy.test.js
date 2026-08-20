import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('coia-hairdressing-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./CoiaHairdressingGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function CoiaHairdressingGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
