import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('admin page is a private, non-indexed metadata wrapper around the dashboard', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /export const metadata/);
  assert.match(source, /private/i);
  assert.match(source, /<AdminDashboard \/>/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
});
