import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('owner RLS policies also receive the required authenticated table privileges', async () => {
  const sql = await readFile(new URL('./005_grant_owner_crm_access.sql', import.meta.url), 'utf8');
  assert.match(sql, /grant select, insert, update, delete on table public\.inquiries to authenticated/i);
  assert.match(sql, /grant select, insert, update, delete on table public\.contacts, public\.consents, public\.tasks, public\.outbox_events, public\.audit_logs to authenticated/i);
});
