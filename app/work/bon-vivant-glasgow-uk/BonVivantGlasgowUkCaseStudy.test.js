import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('bon-vivant-glasgow-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./BonVivantGlasgowUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function BonVivantGlasgowUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
