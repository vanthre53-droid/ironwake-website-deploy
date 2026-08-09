import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('follow-up migration makes task due state visible and completion owner-authorized', async () => {
  const sql = await readFile(new URL('./20260809133000_follow_up_task_operations.sql', import.meta.url), 'utf8');
  assert.match(sql, /tasks_open_due_idx/i);
  assert.match(sql, /where t\.inquiry_id = i\.id and t\.completed_at is null/i);
  assert.match(sql, /v_due_at timestamptz/i);
  assert.match(sql, /next_action, due_at, retention_until/i);
  assert.match(sql, /create or replace function public\.owner_complete_task/i);
  assert.match(sql, /security invoker/i);
  assert.match(sql, /if not \(select public\.is_owner\(\)\)/i);
  assert.match(sql, /follow_up_task_completed/i);
  assert.match(sql, /revoke all on function public\.owner_complete_task\(uuid\)[\s\S]*?from public, anon, authenticated, service_role/i);
  assert.match(sql, /grant execute on function public\.owner_complete_task\(uuid\)[\s\S]*?to authenticated/i);
  const executable = sql.replace(/^--.*$/gm, '');
  assert.doesNotMatch(executable, /http_post|fetch|smtp|resend\.emails|send_email/i);
});
