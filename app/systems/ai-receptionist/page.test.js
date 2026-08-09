import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('ai-receptionist page is a metadata wrapper around the client system view', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /title:\s*'AI Receptionist Planning'/);
  assert.match(source, /<AiReceptionistSystem \/>/);
});

test('ai-receptionist metadata states the unconnected provider reality', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /No phone, voice, messaging, or model-backed receptionist is currently connected/);
});
