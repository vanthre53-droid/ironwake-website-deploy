import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('consent withdrawal is canonical-owner authorized, idempotent, and cancels only unsent customer notifications', async () => {
  const sql = await readFile(new URL('./20260809153000_owner_consent_withdrawal.sql', import.meta.url), 'utf8');
  assert.match(sql, /create or replace function public\.owner_withdraw_inquiry_consent/i);
  assert.match(sql, /security definer/i);
  assert.match(sql, /if not \(select public\.is_owner\(\)\)/i);
  assert.match(sql, /if v_withdrawn_at is not null then\s+return true/i);
  assert.match(sql, /set withdrawn_at = now\(\)/i);
  assert.match(sql, /target_type = 'customer'/i);
  assert.match(sql, /status in \('queued', 'retry_scheduled'\)/i);
  assert.match(sql, /contact_consent_withdrawn/i);
  assert.match(sql, /cancelled_customer_notifications/i);
  assert.match(sql, /revoke all on function public\.owner_withdraw_inquiry_consent\(uuid\)[\s\S]*?from public, anon, authenticated, service_role/i);
  assert.match(sql, /grant execute on function public\.owner_withdraw_inquiry_consent\(uuid\) to authenticated/i);
  const executable = sql.replace(/^--.*$/gm, '');
  assert.doesNotMatch(executable, /delete from|http_post|fetch|smtp|resend\.emails|send_email/i);
});
