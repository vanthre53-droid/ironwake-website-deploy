import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const migrationUrl = new URL('./20260809171000_fix_targeted_notification_claim_ambiguity.sql', import.meta.url);

test('targeted claim repair qualifies attempt RETURNING columns and preserves service-role-only access', async () => {
  const sql = await readFile(migrationUrl, 'utf8');
  assert.match(sql, /returning notification_attempts\.id, notification_attempts\.outbox_event_id,[\s\S]*?notification_attempts\.retry_cycle, notification_attempts\.attempt_number/i);
  assert.match(sql, /\(p_event_id is null or e\.id = p_event_id\)/i);
  assert.match(sql, /for update skip locked/i);
  assert.match(sql, /revoke all on function public\.claim_notification_events\(text, text, integer, uuid, uuid\)[\s\S]*?from public, anon, authenticated, service_role/i);
  assert.match(sql, /grant execute on function public\.claim_notification_events\(text, text, integer, uuid, uuid\)[\s\S]*?to service_role/i);
  assert.doesNotMatch(sql, /http_post|fetch|smtp|resend\.emails|send_email/i);
});
