import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('enrich-salon-mumbai-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./EnrichSalonMumbaiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function EnrichSalonMumbaiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
