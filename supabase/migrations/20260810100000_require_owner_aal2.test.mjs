import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';

const sql = await fs.readFile(new URL('./20260810100000_require_owner_aal2.sql', import.meta.url), 'utf8');

test('owner predicate requires canonical email, owner role, and aal2', () => {
  assert.match(sql, /app_metadata.*role.*owner/s);
  assert.match(sql, /ironwakee@gmail\.com/);
  assert.match(sql, /auth\.jwt\(\)\s*->>\s*'aal'/);
  assert.match(sql, /'aal2'/);
});

test('AAL2 migration changes only the owner predicate', () => {
  assert.doesNotMatch(sql, /delete\s+from|truncate|drop\s+table/i);
  assert.match(sql, /create\s+or\s+replace\s+function\s+public\.is_owner/i);
});
