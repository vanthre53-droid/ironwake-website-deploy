import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('notification readiness exposes only safe configuration state to the validated owner', async () => {
  const source = await readFile(new URL('./route.js', import.meta.url), 'utf8');
  assert.match(source, /readNotificationConfig/);
  assert.match(source, /parseBearerToken/);
  assert.match(source, /auth\.getUser\(token\)/);
  assert.doesNotMatch(source, /global:\s*\{\s*headers/);
  assert.match(source, /ironwakee@gmail\.com/);
  assert.match(source, /configured: config\.configured/);
  assert.match(source, /safeErrorCode/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY|RESEND_API_KEY/);
});

test('notification readiness rejects unsupported methods with a private response', async () => {
  const { GET } = await import('./route.js');
  const res = await GET(new Request('http://localhost/api/owner/notification-readiness', { method: 'GET' }));
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'POST');
  assert.equal(res.headers.get('cache-control'), 'private, no-store, max-age=0');
  assert.deepEqual(await res.json(), { authorized: false, reason: 'Method not allowed.' });
});
