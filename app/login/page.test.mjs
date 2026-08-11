import assert from 'node:assert/strict';
import test from 'node:test';
import { stat, readFile } from 'node:fs/promises';

test('/login page exists for customer auth, renders LoginForm, and disables indexation', async () => {
  const path = new URL('./page.js', import.meta.url);
  await stat(path);
  const source = await readFile(path, 'utf8');
  assert.match(source, /LoginForm/);
  assert.match(source, /robots:\s*\{\s*index:\s*false/);
  assert.match(source, /title:\s*'Sign in/);
});

test('/login does not import OwnerDashboard anymore', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /OwnerDashboard/);
});
