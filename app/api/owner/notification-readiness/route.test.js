import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('notification readiness exposes only safe configuration state to the validated owner', async () => {
  const source = await readFile(new URL('./route.js', import.meta.url), 'utf8');
  assert.match(source, /readNotificationConfig/);
  assert.match(source, /auth\.getUser/);
  assert.match(source, /ironwakee@gmail\.com/);
  assert.match(source, /configured: config\.configured/);
  assert.match(source, /safeErrorCode/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY|RESEND_API_KEY/);
});
