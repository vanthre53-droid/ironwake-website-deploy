import assert from 'node:assert/strict';
import test from 'node:test';
import { stat, readFile } from 'node:fs/promises';

test('/login page exists, renders OwnerDashboard, and disables indexation', async () => {
  const path = new URL('./page.js', import.meta.url);
  await stat(path);
  const source = await readFile(path, 'utf8');
  assert.match(source, /OwnerDashboard/);
  assert.match(source, /robots:\s*\{\s*index:\s*false/);
  assert.match(source, /title:\s*'Owner Login'/);
});