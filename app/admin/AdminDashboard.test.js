import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('admin dashboard shows outbox_event status via authenticated Supabase access only', async () => {
  const source = await readFile(new URL('./AdminDashboard.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /signInWithPassword/);
  assert.match(source, /signOut/);
  assert.match(source, /from\('outbox_events'\)\.select/);
  assert.match(source, /event_type,status,attempts,available_at,last_error_code,created_at/);
  assert.match(source, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(source, /\.(update|delete|insert)\(/, 'this is a read-only status view');
});
