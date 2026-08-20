import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('shaakya-body-spa-bangalore-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./ShaakyaBodySpaBangaloreInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function ShaakyaBodySpaBangaloreInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
