import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('dessange-salon-spa-mumbai-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./DessangeSalonSpaMumbaiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function DessangeSalonSpaMumbaiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
