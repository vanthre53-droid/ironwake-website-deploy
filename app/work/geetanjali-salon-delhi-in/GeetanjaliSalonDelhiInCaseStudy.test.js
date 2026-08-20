import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('geetanjali-salon-delhi-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./GeetanjaliSalonDelhiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function GeetanjaliSalonDelhiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
