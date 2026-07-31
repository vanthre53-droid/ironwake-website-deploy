import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('forward migration repairs the invalid task due-date interval', async () => {
  const sql = await readFile(new URL('./004_fix_task_due_date.sql', import.meta.url), 'utf8');
  assert.match(sql, /create or replace function public\.submit_audit_inquiry/);
  assert.doesNotMatch(sql, /interval '1 business day'/);
  assert.match(sql, /extract\(isodow from now\(\)\)/i);
});
