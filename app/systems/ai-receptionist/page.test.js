import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('ai-receptionist page is a metadata wrapper around the client system view', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /title:\s*'AI Receptionist Starter'/);
  assert.match(source, /<AiReceptionistSystem \/>/);
});

// ponytail: R14 regression guard — the AI Receptionist page must NOT label the offer as a "concept" or "not connected"; the service is a real implementation offer, only the provider-dependent parts are openly disclosed.
test('ai-receptionist page does not label the offer as a concept or "not connected"', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /\(Concept\)/);
  assert.doesNotMatch(source, /AI Receptionist \(Concept\)/);
  assert.doesNotMatch(source, /not connected yet/);
  assert.doesNotMatch(source, /not built/i);
});
