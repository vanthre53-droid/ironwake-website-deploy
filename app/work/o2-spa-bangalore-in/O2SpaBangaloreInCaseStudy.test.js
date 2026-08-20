import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('o2-spa-bangalore-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./O2SpaBangaloreInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function O2SpaBangaloreInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
