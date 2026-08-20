import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('rinky-sandhal-unisex-salon-delhi-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./RinkySandhalUnisexSalonDelhiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function RinkySandhalUnisexSalonDelhiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
