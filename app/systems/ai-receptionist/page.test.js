import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('ai-receptionist page is a metadata wrapper around the client system view', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /title:\s*'AI Receptionist — Live Demo on This Site'/);
  assert.match(source, /<AiReceptionistSystem \/>/);
});

test('ai-receptionist metadata states the live-demo-vs-per-tenant distinction', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  // Live Retell web-call demo is honest on this domain; per-tenant client receptionist remains separately scoped.
  assert.match(source, /live receptionist demo on this domain[\s\S]*separately scoped/i);
});
