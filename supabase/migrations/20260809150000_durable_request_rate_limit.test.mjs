import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('durable rate limit is RLS-protected, bounded, and service-role-only', async () => {
  const sql = await readFile(new URL('./20260809150000_durable_request_rate_limit.sql', import.meta.url), 'utf8');
  assert.match(sql, /create table if not exists public\.request_rate_limits/i);
  assert.match(sql, /char_length\(key_hash\) = 64/i);
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /create or replace function public\.consume_request_rate_limit/i);
  assert.match(sql, /security definer/i);
  assert.match(sql, /p_limit not between 1 and 100/i);
  assert.match(sql, /p_window_seconds not between 1 and 86400/i);
  assert.match(sql, /on conflict \(key_hash\) do update/i);
  assert.match(sql, /return v_count <= p_limit/i);
  assert.match(sql, /revoke all on function public\.consume_request_rate_limit\(text, integer, integer\)[\s\S]*?from public, anon, authenticated, service_role/i);
  assert.match(sql, /grant execute on function public\.consume_request_rate_limit\(text, integer, integer\) to service_role/i);
  const executable = sql.replace(/^--.*$/gm, '');
  assert.doesNotMatch(executable, /http_post|fetch|smtp|resend\.emails|send_email/i);
});
