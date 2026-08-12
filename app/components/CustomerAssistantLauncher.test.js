import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('customer launcher is a real AI chat client', async () => {
  const source = await readFile(new URL('./CustomerAssistantLauncher.js', import.meta.url), 'utf8');
  assert.match(source, /\/api\/chat/);
  assert.match(source, /'POST'/);
  assert.match(source, /application\/json/);
  // server is the only owner of the AI secret — browser bundle sees no credential
  assert.doesNotMatch(source, /AI_API_KEY|AI_API_BASE|sk-cp-|sk-/);
  assert.doesNotMatch(source, /Bearer /);
  assert.doesNotMatch(source, /api\.minimax\.io/);
  assert.doesNotMatch(source, /fetch\(\s*['"`]https?:/);
  // honest handoff semantics — never auto-submit visitor data
  assert.match(source, /consent/i);
});

test('customer launcher gates on authenticated customer session only', async () => {
  const source = await readFile(new URL('./CustomerAssistantLauncher.js', import.meta.url), 'utf8');
  assert.match(source, /createBrowserSupabase/);
  // must gate on kind === 'customer' before rendering
  assert.match(source, /kind\s*===\s*['"`]customer['"`]/);
  // must classify users and refuse to render for owners
  assert.match(source, /classify/);
  assert.match(source, /ironwakee@gmail\.com/);
  // anonymous / owner must produce no UI
  assert.match(source, /showLauncher/);
  // widget must explicitly render null when not a customer
  assert.match(source, /return null/);
});

test('customer launcher uses round IronWake brand mark SVG, not emoji', async () => {
  const source = await readFile(new URL('./CustomerAssistantLauncher.js', import.meta.url), 'utf8');
  assert.match(source, /viewBox/);
  assert.match(source, /className="iw-launcher-mark"/);
  // should not use any emoji-like glyph on the launcher
  assert.doesNotMatch(source, /className="iw-launcher"[\s\S]*>[^<]*💬/);
});

test('customer launcher handles degraded states', async () => {
  const source = await readFile(new URL('./CustomerAssistantLauncher.js', import.meta.url), 'utf8');
  assert.match(source, /unconfigured/);
  assert.match(source, /statusMessage/);
  assert.match(source, /429/);
});