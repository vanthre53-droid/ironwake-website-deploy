// ponytail: contract test for customer-auth migration. Verifies that the SQL
// contains the expected tables, RLS enable, policies, indexes, and the
// upsert_own_profile RPC grant.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, '20260811100000_customer_auth_and_chat.sql'), 'utf8');

test('customer-auth migration creates profiles table', () => {
  assert.match(sql, /create table if not exists public\.profiles/);
  assert.match(sql, /user_id uuid primary key references auth\.users/);
  assert.match(sql, /display_name text/);
});

test('customer-auth migration creates chat_sessions + chat_messages with FKs', () => {
  assert.match(sql, /create table if not exists public\.chat_sessions/);
  assert.match(sql, /create table if not exists public\.chat_messages/);
  assert.match(sql, /session_id uuid not null references public\.chat_sessions/);
  assert.match(sql, /user_id uuid not null references auth\.users/);
});

test('customer-auth migration enables RLS + creates own-row policies', () => {
  assert.match(sql, /alter table public\.profiles enable row level security/);
  assert.match(sql, /alter table public\.chat_sessions enable row level security/);
  assert.match(sql, /alter table public\.chat_messages enable row level security/);
  assert.match(sql, /profile_select_own/);
  assert.match(sql, /profile_insert_own/);
  assert.match(sql, /profile_update_own/);
  assert.match(sql, /chat_sessions_all_own/);
  assert.match(sql, /chat_messages_all_own/);
  assert.match(sql, /inquiry_select_own/);
});

test('customer-auth migration adds user_id to inquiries', () => {
  assert.match(sql, /add column if not exists user_id uuid references auth\.users/);
  assert.match(sql, /inquiries_user_idx/);
});

test('customer-auth migration exposes upsert_own_profile RPC to authenticated', () => {
  assert.match(sql, /create or replace function public\.upsert_own_profile/);
  assert.match(sql, /grant execute on function public\.upsert_own_profile\(text\) to authenticated/);
});
