import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('homepage keeps truthful audit CTA and operating path', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Request a Business Leak Audit/);
  assert.match(source, /Stop letting good leads disappear/);
  assert.match(source, /<SiteFooter \/>/);
});
