import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('audit form uses the API and truthful persistence language', async () => {
  const source = await readFile(new URL('./AuditForm.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /fetch\('\/api\/audit'/);
  assert.match(source, /We acknowledge requests only after they are saved/);
  assert.match(source, /name="website"/);
});
