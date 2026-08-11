import assert from 'node:assert/strict';
import test from 'node:test';
import { stat, readFile } from 'node:fs/promises';

test('/chat page exists, renders ChatClient, and is discoverable from AssistantWidget', async () => {
  const page = await stat(new URL('./page.js', import.meta.url));
  assert.ok(page.isFile());
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /ChatClient/);
  assert.match(source, /title:\s*'Ask IronWake/);
  // Global widget must offer the full-page path.
  const widget = await readFile(new URL('../components/AssistantWidget.js', import.meta.url), 'utf8');
  assert.match(widget, /href="\/chat"/);
});