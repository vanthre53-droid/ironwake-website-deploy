import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('lead-stage updates are canonical-owner authorized and auditable', async () => {
  const sql = await readFile(new URL('./20260809143000_owner_lead_stage_updates.sql', import.meta.url), 'utf8');
  assert.match(sql, /create or replace function public\.owner_update_inquiry_stage/i);
  assert.match(sql, /security definer/i);
  assert.match(sql, /if not \(select public\.is_owner\(\)\)/i);
  assert.match(sql, /lead_stage_invalid/i);
  assert.match(sql, /'new', 'reviewed', 'contacted', 'qualified'/i);
  assert.match(sql, /where id = p_inquiry_id/i);
  assert.match(sql, /lead_stage_updated/i);
  assert.match(sql, /jsonb_build_object\('from_stage', v_previous_stage, 'to_stage', p_lead_stage\)/i);
  assert.match(sql, /revoke all on function public\.owner_update_inquiry_stage\(uuid, text\)[\s\S]*?from public, anon, authenticated, service_role/i);
  assert.match(sql, /grant execute on function public\.owner_update_inquiry_stage\(uuid, text\) to authenticated/i);
  const executable = sql.replace(/^--.*$/gm, '');
  assert.doesNotMatch(executable, /http_post|fetch|smtp|resend\.emails|send_email/i);
});
