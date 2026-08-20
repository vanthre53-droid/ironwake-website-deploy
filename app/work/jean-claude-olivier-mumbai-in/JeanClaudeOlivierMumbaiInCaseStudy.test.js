import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('jean-claude-olivier-mumbai-in CaseStudy exports a component', async () => {
  const source = await readFile(new URL('./JeanClaudeOlivierMumbaiInCaseStudy.js', import.meta.url), 'utf8');
  assert.match(source, /export function JeanClaudeOlivierMumbaiInCaseStudy/);
  assert.match(source, /CaseStudyStory/);
});
