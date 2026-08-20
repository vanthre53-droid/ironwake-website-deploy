import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('mudd-salon-and-day-spa-mumbai-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./MuddSalonAndDaySpaMumbaiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function MuddSalonAndDaySpaMumbaiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
