import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('new-avalon-chennai-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./NewAvalonChennaiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function NewAvalonChennaiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
