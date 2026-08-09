import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const migrationUrl = new URL(
  './20260809101143_secure_owner_and_privileged_rpcs.sql',
  import.meta.url
);

async function migrationSql() {
  return readFile(migrationUrl, 'utf8');
}

test('single-owner predicate requires the role marker and designated email', async () => {
  const sql = await migrationSql();
  assert.match(sql, /create or replace function public\.is_owner\(\)/i);
  assert.match(sql, /security invoker/i);
  assert.match(sql, /auth\.jwt\(\) -> 'app_metadata' ->> 'role'/);
  assert.match(sql, /auth\.jwt\(\) ->> 'email'/);
  assert.match(sql, /'ironwakee@gmail\.com'/);
  assert.match(sql, /coalesce\([\s\S]*false[\s\S]*\)/i);
});

test('all six private-table policies use the canonical owner predicate', async () => {
  const sql = await migrationSql();
  for (const table of ['inquiries', 'contacts', 'consents', 'tasks', 'outbox_events', 'audit_logs']) {
    assert.match(sql, new RegExp(`drop policy if exists owner_can_manage_${table} on public\\.${table}`, 'i'));
    assert.match(sql, new RegExp(`create policy owner_can_manage_${table} on public\\.${table}[\\s\\S]*?using \\(\\(select public\\.is_owner\\(\\)\\)\\)[\\s\\S]*?with check \\(\\(select public\\.is_owner\\(\\)\\)\\)`, 'i'));
  }
});

test('privileged functions explicitly deny public browser roles', async () => {
  const sql = await migrationSql();
  for (const signature of [
    'public\\.submit_audit_inquiry\\(text, text, text, text\\)',
    'public\\.anonymize_expired_inquiries\\(\\)',
    'public\\.rls_auto_enable\\(\\)'
  ]) {
    assert.match(
      sql,
      new RegExp(`revoke all on function ${signature}[\\s\\S]*?from public, anon, authenticated, service_role`, 'i')
    );
  }
  assert.match(sql, /grant execute on function public\.submit_audit_inquiry\(text, text, text, text\)[\s\S]*?to service_role/i);
  assert.match(sql, /grant execute on function public\.anonymize_expired_inquiries\(\)[\s\S]*?to service_role/i);
  assert.match(sql, /grant execute on function public\.rls_auto_enable\(\) to postgres/i);
  assert.doesNotMatch(sql, /grant execute on function public\.(?:submit_audit_inquiry|anonymize_expired_inquiries|rls_auto_enable)[\s\S]*?to (?:anon|authenticated|public)/i);
});

test('migration changes authorization metadata only, not customer rows', async () => {
  const sql = await migrationSql();
  assert.doesNotMatch(sql, /\b(?:insert|update|delete|truncate)\s+(?:into\s+|from\s+)?public\.(?:inquiries|contacts|consents|tasks|outbox_events|audit_logs)\b/i);
  assert.doesNotMatch(sql, /drop\s+table/i);
});
