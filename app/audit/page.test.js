import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('audit page is a metadata wrapper around the audit form', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /Business Leak Audit/);
  assert.match(source, /<AuditForm \/>/);
});
