import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('audit form uses the API and truthful persistence language', async () => {
  const source = await readFile(new URL('./AuditForm.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /fetch\('\/api\/audit'/);
  assert.match(source, /if \(response\.ok\) event\.currentTarget\.reset\(\)/);
  assert.match(source, /This request does not book a call or create a quote/);
  assert.match(source, /name="website"/);
});
