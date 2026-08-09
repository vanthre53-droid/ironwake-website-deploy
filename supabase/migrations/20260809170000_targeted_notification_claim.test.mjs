import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const migrationUrl = new URL('./20260809170000_targeted_notification_claim.sql', import.meta.url);

test('targeted notification claims remain service-role-only and cannot broaden ordinary claim selection', async () => {
  const sql = await readFile(migrationUrl, 'utf8');
  assert.match(sql, /drop function if exists public\.claim_notification_events\(text, text, integer, uuid\)/i);
  assert.match(sql, /p_event_id uuid default null/i);
  assert.match(sql, /\(p_event_id is null or e\.id = p_event_id\)/i);
  assert.match(sql, /for update skip locked/i);
  assert.match(sql, /revoke all on function public\.claim_notification_events\(text, text, integer, uuid, uuid\)[\s\S]*?from public, anon, authenticated, service_role/i);
  assert.match(sql, /grant execute on function public\.claim_notification_events\(text, text, integer, uuid, uuid\)[\s\S]*?to service_role/i);
  assert.doesNotMatch(sql, /http_post|fetch|smtp|resend\.emails|send_email/i);
});
