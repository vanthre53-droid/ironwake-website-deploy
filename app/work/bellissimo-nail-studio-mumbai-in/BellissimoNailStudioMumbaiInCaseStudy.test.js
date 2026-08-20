import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('bellissimo-nail-studio-mumbai-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./BellissimoNailStudioMumbaiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function BellissimoNailStudioMumbaiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
