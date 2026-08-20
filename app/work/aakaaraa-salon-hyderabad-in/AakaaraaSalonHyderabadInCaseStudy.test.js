import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('aakaaraa-salon-hyderabad-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./AakaaraaSalonHyderabadInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function AakaaraaSalonHyderabadInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
