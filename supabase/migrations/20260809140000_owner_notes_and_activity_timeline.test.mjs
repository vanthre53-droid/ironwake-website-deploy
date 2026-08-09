import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('owner notes stay private and produce a metadata-only audit event', async () => {
  const sql = await readFile(new URL('./20260809140000_owner_notes_and_activity_timeline.sql', import.meta.url), 'utf8');
  assert.match(sql, /create table if not exists public\.owner_notes/i);
  assert.match(sql, /char_length\(btrim\(body\)\) between 1 and 2000/i);
  assert.match(sql, /alter table public\.owner_notes enable row level security/i);
  assert.match(sql, /grant select on table public\.owner_notes to authenticated/i);
  assert.match(sql, /owner_can_read_owner_notes/i);
  assert.match(sql, /create or replace function public\.owner_add_inquiry_note/i);
  assert.match(sql, /security definer/i);
  assert.match(sql, /if not \(select public\.is_owner\(\)\)/i);
  assert.match(sql, /note_invalid/i);
  assert.match(sql, /owner_note_added/i);
  assert.match(sql, /jsonb_build_object\('note_id', v_note_id\)/i);
  assert.match(sql, /revoke all on function public\.owner_add_inquiry_note\(uuid, text\)[\s\S]*?from public, anon, authenticated, service_role/i);
  assert.match(sql, /grant execute on function public\.owner_add_inquiry_note\(uuid, text\) to authenticated/i);
  const executable = sql.replace(/^--.*$/gm, '');
  assert.doesNotMatch(executable, /http_post|fetch|smtp|resend\.emails|send_email/i);
});
