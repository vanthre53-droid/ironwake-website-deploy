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
  // ponytail: handoff must require explicit consent; the assistant must not
  // POST anywhere (no record without visitor consent).
  assert.match(source, /handoff_consent/);
  assert.match(source, /consent checkbox/);
  assert.match(source, /Email delivery is not currently configured/);
  assert.doesNotMatch(source, /Get an email follow-up/);
  assert.doesNotMatch(source, /password|payment details|identity documents/i);
  assert.doesNotMatch(source, /fetch\(['"]\/api\//);
});
