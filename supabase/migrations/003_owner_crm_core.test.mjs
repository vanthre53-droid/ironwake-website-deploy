import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const migration = new URL('./003_owner_crm_core.sql', import.meta.url);

test('owner CRM migration keeps inquiry, outbox, audit, retention, and RLS controls together', async () => {
  const sql = await readFile(migration, 'utf8');
  for (const marker of [
    'create table if not exists public.contacts',
    'create table if not exists public.consents',
    'create table if not exists public.outbox_events',
    'create table if not exists public.audit_logs',
    'create or replace function public.submit_audit_inquiry',
    'create or replace function public.anonymize_expired_inquiries',
    'enable row level security',
    'revoke all on table public.outbox_events from anon, authenticated',
    "select (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'",
    'using (public.is_owner()) with check (public.is_owner())'
  ]) assert.match(sql, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
