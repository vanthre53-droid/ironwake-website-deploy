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
  assert.match(source, /cache-control': 'private, no-store, max-age=0/);
  assert.match(source, /vary: 'authorization'/);
  assert.match(source, /owner_notes/);
  assert.match(source, /notification_attempts/);
  assert.match(source, /provider_events/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(source, /\.insert\(|\.update\(|\.delete\(/);
});

test('owner CRM export rejects unsupported methods with a private safe response', async () => {
  const { GET } = await import('./route.js');
  const res = await GET(new Request('http://localhost/api/owner/export', { method: 'GET' }));
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'POST');
  assert.equal(res.headers.get('cache-control'), 'private, no-store, max-age=0');
  assert.deepEqual(await res.json(), { exported: false, reason: 'Method not allowed.' });
});
