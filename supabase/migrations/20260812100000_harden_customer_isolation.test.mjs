import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

// ponytail: the obsolete `netlify/functions/migrate-customer-auth.mjs`
// bootstrap endpoint has been retired. The customer-auth migration is now
// applied by the standard Supabase migration runner (see
// supabase/migrations/), which already executes each migration file inside
// a transaction. The bootstrap was an emergency escape hatch that the
// hardened migration has rendered redundant.

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, '20260812100000_harden_customer_isolation.sql'), 'utf8');
const authActions = readFileSync(join(here, '..', '..', 'lib', 'supabase', 'auth-actions.mjs'), 'utf8');
test('hardened customer isolation migration exists as a forward-only Supabase migration', () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const sqlPath = join(here, '20260812100000_harden_customer_isolation.sql');
  assert.ok(existsSync(sqlPath), 'expected hardened customer isolation migration SQL to exist');
});

test('customer tables grant only the operations required by their RLS policies', () => {
  assert.match(sql, /grant select, insert, update on table public\.profiles to authenticated/i);
  assert.match(sql, /grant select, insert, update, delete on table public\.chat_sessions to authenticated/i);
  assert.match(sql, /grant select, insert, update, delete on table public\.chat_messages to authenticated/i);
  assert.doesNotMatch(sql, /grant\s+all/i);
});

test('public inquiry intake cannot overwrite an existing contact by reusing its email', () => {
  // The hardening migration must reuse an existing contact row keyed by
  // email_normalized; it must NOT blindly UPSERT and clear anonymized_at or
  // overwrite business_name on contact rows that already belong to another
  // customer. Either order (insert-then-select, or select-then-insert) is
  // acceptable as long as the SELECT is keyed by email_normalized and the
  // INSERT does not perform a do-update that overwrites the contact.
  assert.match(
    sql,
    /select id into v_contact_id[\s\S]*?from public\.contacts[\s\S]*?where email_normalized = v_email/i,
  );
  assert.match(sql, /on conflict \(email_normalized\) do nothing/i);
  assert.doesNotMatch(sql, /on conflict \(email_normalized\) do update/i);
  assert.doesNotMatch(sql, /anonymized_at\s*=\s*null/i);
});

test('chat messages enforce that session and message belong to the same customer', () => {
  assert.match(sql, /unique\s*\(id, user_id\)/i);
  assert.match(sql, /foreign key\s*\(session_id, user_id\)\s*references public\.chat_sessions\s*\(id, user_id\)/i);
});

test('customer isolation policies are replaced deterministically', () => {
  assert.match(sql, /drop policy if exists chat_sessions_all_own on public\.chat_sessions/i);
  assert.match(sql, /drop policy if exists chat_messages_all_own on public\.chat_messages/i);
  assert.match(sql, /with check \(auth\.uid\(\) = user_id\)/i);
});

test('customer code has no arbitrary service-role inquiry ownership relinker', () => {
  assert.doesNotMatch(authActions, /linkInquiryToUserAction/);
  assert.doesNotMatch(authActions, /createServiceSupabase/);
});

test('hardened migration is applied through the standard Supabase migration runner (no Netlify bootstrap)', () => {
  // ponytail: the obsolete Netlify bootstrap endpoint must not be
  // referenced anywhere in the active runtime or test surface. The
  // migration is forward-only and committed; it is applied by Supabase.
  assert.doesNotMatch(authActions, /migrate-customer-auth/);
});
