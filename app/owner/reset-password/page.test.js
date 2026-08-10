import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('./page.js', import.meta.url), 'utf8');

test('password recovery uses the public Supabase client and supported update operation', () => {
  assert.match(source, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(source, /owner\?recovery=complete/);
  assert.match(source, /auth\.updateUser\(\{ password \}\)/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(source, /localhost/);
});

test('password recovery validates a live session before rendering the update form', () => {
  assert.match(source, /getSession\(\)/);
  assert.match(source, /invalid or expired/);
});

test('password recovery exchanges PKCE code and handles PASSWORD_RECOVERY event', () => {
  assert.match(source, /exchangeCodeForSession\(code\)/);
  assert.match(source, /event === 'PASSWORD_RECOVERY'/);
  assert.match(source, /history\.replaceState/);
});
