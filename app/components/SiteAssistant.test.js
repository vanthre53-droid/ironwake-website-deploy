import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('site assistant is a truthful decision-tree guide', async () => {
  const source = await readFile(new URL('./SiteAssistant.js', import.meta.url), 'utf8');
  assert.match(source, /not a live AI/);
  assert.match(source, /id="ironwake-assistant"/);
  assert.match(source, /not pretending|pre-written|decision tree|guided/i);
  assert.match(source, /audit/i);
  assert.match(source, /\/audit/);
  assert.doesNotMatch(source, /password|payment details|identity documents/i);
});
