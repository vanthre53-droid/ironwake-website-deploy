import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('truefitt-hill-prabhadevi-mumbai-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./TruefittHillPrabhadeviMumbaiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function TruefittHillPrabhadeviMumbaiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
