import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('assistant widget is a real AI chat client', async () => {
  const source = await readFile(new URL('./AssistantWidget.js', import.meta.url), 'utf8');
  assert.match(source, /\/api\/chat/);
  assert.match(source, /'POST'/);
  assert.match(source, /application\/json/);
  // ponytail: server is the only owner of the AI secret. Browser bundle
  // must NOT contain any provider credential, key, or bearer string.
  assert.doesNotMatch(source, /AI_API_KEY|AI_API_BASE|sk-cp-|sk-/);
  assert.doesNotMatch(source, /Bearer /);
  // Honest handoff semantics — never auto-submit visitor data.
  assert.match(source, /consent/i);
  // No client-side secret leak, no client-side fetch of the provider URL.
  assert.doesNotMatch(source, /api\.minimax\.io/);
  assert.doesNotMatch(source, /fetch\(\s*['"`]https?:/);
});

test('assistant widget handles degraded states', async () => {
  const source = await readFile(new URL('./AssistantWidget.js', import.meta.url), 'utf8');
  assert.match(source, /unconfigured/);
  assert.match(source, /statusMessage/);
  assert.match(source, /429/);
});
