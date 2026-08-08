import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('layout defines IronWake metadata', async () => {
  const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8');
  assert.match(source, /Systems that answer/);
  assert.match(source, /IronWake helps service businesses/);
});

test('layout documents Sentry error-boundary pair and sets Stitch viewport', async () => {
  const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8');
  assert.match(source, /app\/error\.js/);
  assert.match(source, /app\/global-error\.js/);
  assert.match(source, /export const viewport/);
  assert.match(source, /#f5f3ee/);
});

// ponytail: R14 regression guard — JSON-LD Service description for AI Receptionist must NOT use the legacy "concept" framing; the AI Receptionist is a real public offer.
test('layout JSON-LD does not label AI Receptionist as a concept', async () => {
  const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /Explore the disclosed, human-supervised reception concept/);
  assert.match(source, /AI Receptionist Starter/);
});
