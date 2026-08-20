import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('shaakya-salon-spa-bangalore-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./ShaakyaSalonSpaBangaloreInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function ShaakyaSalonSpaBangaloreInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
