import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('lakme-salon-kolkata-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./LakmeSalonKolkataInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function LakmeSalonKolkataInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
