import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('dapperwolf-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./DapperwolfGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function DapperwolfGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
