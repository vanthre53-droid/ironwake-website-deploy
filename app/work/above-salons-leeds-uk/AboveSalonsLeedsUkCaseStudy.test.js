import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('above-salons-leeds-uk CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./AboveSalonsLeedsUkCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function AboveSalonsLeedsUkCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
