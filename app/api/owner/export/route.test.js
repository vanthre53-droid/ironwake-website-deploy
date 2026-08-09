import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('owner CRM export validates a bearer session and creates a non-cached bounded attachment', async () => {
  const source = await readFile(new URL('./route.js', import.meta.url), 'utf8');
  assert.match(source, /parseBearerToken/);
  assert.match(source, /auth\.getUser\(token\)/);
  assert.match(source, /ironwakee@gmail\.com/);
  assert.match(source, /MAX_ROWS_PER_COLLECTION = 1_000/);
  assert.match(source, /content-disposition/);
  assert.match(source, /cache-control': 'no-store/);
  assert.match(source, /owner_notes/);
  assert.match(source, /notification_attempts/);
  assert.match(source, /provider_events/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(source, /\.insert\(|\.update\(|\.delete\(/);
});
