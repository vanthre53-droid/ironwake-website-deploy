import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const migrationUrl = new URL(
  './20260809103635_durable_notification_state_machine.sql',
  import.meta.url
);

async function migrationSql() {
  return readFile(migrationUrl, 'utf8');
}

test('legacy notification intents are cancelled and cannot be claimed or retried', async () => {
  const sql = await migrationSql();
  assert.match(sql, /event_type = 'inquiry_received'[\s\S]*?status in \('queued', 'processing', 'retry_scheduled'\)/i);
  assert.match(sql, /status = 'cancelled'[\s\S]*?target_type = 'legacy'[\s\S]*?safe_error_code = 'legacy_event_not_addressable'/i);
  assert.match(sql, /e\.event_type <> 'inquiry_received'/i);
  assert.match(sql, /v_event\.event_type = 'inquiry_received'[\s\S]*?v_event\.target_type = 'legacy'/i);
});

test('outbox supports distinct owner, customer, booking, audit, and priority events', async () => {
  const sql = await migrationSql();
  for (const eventType of [
    'owner_new_audit',
    'owner_new_booking_request',
    'customer_audit_received',
    'customer_booking_request_received',
    'owner_priority_alert'
  ]) {
    assert.match(sql, new RegExp(`'${eventType}'`));
  }
  assert.match(sql, /v_owner_event_type \|\| ':' \|\| v_inquiry_id/i);
  assert.match(sql, /v_customer_event_type \|\| ':' \|\| v_inquiry_id/i);
});

test('inquiry persistence atomically queues exactly one owner and one customer intent', async () => {
  const sql = await migrationSql();
  assert.match(sql, /create or replace function public\.submit_audit_inquiry/i);
  assert.match(sql, /if p_source = 'website_booking'[\s\S]*?owner_new_booking_request[\s\S]*?customer_booking_request_received/i);
  assert.match(sql, /insert into public\.outbox_events[\s\S]*?values[\s\S]*?v_owner_event_type[\s\S]*?v_customer_event_type/i);
  assert.doesNotMatch(sql, /inquiry_received:' \|\| v_inquiry_id/i);
});

test('attempt and provider-event tables store metadata without bodies, secrets, or recipient addresses', async () => {
  const sql = await migrationSql();
  assert.match(sql, /create table if not exists public\.notification_attempts/i);
  assert.match(sql, /unique \(outbox_event_id, retry_cycle, attempt_number\)/i);
  assert.match(sql, /create table if not exists public\.provider_events/i);
  assert.match(sql, /unique \(provider, provider_event_id\)/i);

  const tableDefinitions = sql.match(/create table if not exists public\.(?:notification_attempts|provider_events)[\s\S]*?\n\);/gi)?.join('\n') ?? '';
  assert.doesNotMatch(tableDefinitions, /\b(?:body|html|text_content|api_key|secret|recipient_email|payload)\b/i);
});

test('claiming is lease-based, concurrent-safe, and capped at three attempts', async () => {
  const sql = await migrationSql();
  assert.match(sql, /create or replace function public\.claim_notification_events/i);
  assert.match(sql, /for update skip locked/i);
  assert.match(sql, /p_limit not between 1 and 10/i);
  assert.match(sql, /e\.attempts < 3/i);
  assert.match(sql, /worker_lease_expired/i);
  assert.match(sql, /interval '10 minutes'/i);
});

test('attempt completion distinguishes acceptance, delivery, retry, and dead letter', async () => {
  const sql = await migrationSql();
  assert.match(sql, /create or replace function public\.finish_notification_attempt/i);
  assert.match(sql, /provider_message_id_required/i);
  assert.match(sql, /when 1 then interval '5 minutes'[\s\S]*?interval '30 minutes'/i);
  assert.match(sql, /v_next_status := 'accepted_by_provider'/i);
  assert.match(sql, /v_next_status := 'retry_scheduled'/i);
  assert.match(sql, /v_next_status := 'dead_letter'/i);
  assert.match(sql, /p_event_type = 'email\.delivered' then 'delivered'/i);
});

test('provider callbacks are deduplicated and never store raw payloads', async () => {
  const sql = await migrationSql();
  assert.match(sql, /create or replace function public\.record_notification_provider_event/i);
  assert.match(sql, /on conflict \(provider, provider_event_id\) do nothing/i);
  assert.match(sql, /if v_provider_event_id is null then[\s\S]*?return false/i);
  assert.doesNotMatch(sql, /jsonb\s+(?:not null\s+)?default/i);
});

test('new private tables are RLS-protected and browser roles get read-only owner access', async () => {
  const sql = await migrationSql();
  for (const table of ['notification_attempts', 'provider_events']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
    assert.match(sql, new RegExp(`create policy owner_can_read_${table}[\\s\\S]*?for select to authenticated[\\s\\S]*?public\\.is_owner`, 'i'));
  }
  assert.match(sql, /revoke all on table public\.outbox_events from authenticated/i);
  assert.match(sql, /grant select on table public\.outbox_events to authenticated/i);
  assert.doesNotMatch(sql, /grant (?:insert|update|delete|all)[^;]*to authenticated/i);
});

test('privileged queue functions are service-role-only and owner replay rechecks authorization', async () => {
  const sql = await migrationSql();
  for (const signature of [
    'public\\.queue_priority_lead_notification\\(uuid\\)',
    'public\\.claim_notification_events\\(text, text, integer, uuid\\)',
    'public\\.finish_notification_attempt\\(uuid, uuid, text, text, text, boolean\\)',
    'public\\.record_notification_provider_event\\(text, text, text, text, timestamptz\\)'
  ]) {
    assert.match(sql, new RegExp(`revoke all on function ${signature}[\\s\\S]*?from public, anon, authenticated, service_role`, 'i'));
    assert.match(sql, new RegExp(`grant execute on function ${signature}[\\s\\S]*?to service_role`, 'i'));
  }
  assert.match(sql, /create or replace function public\.owner_retry_notification[\s\S]*?security invoker/i);
  assert.match(sql, /if not \(select public\.is_owner\(\)\)/i);
  assert.match(sql, /grant execute on function public\.owner_retry_notification\(uuid\)[\s\S]*?to authenticated/i);
});

test('migration performs no send, customer deletion, or anonymization', async () => {
  const sql = await migrationSql();
  assert.doesNotMatch(sql, /\b(?:http_post|net\.http|fetch|smtp|resend\.emails|send_email)\b/i);
  assert.doesNotMatch(sql, /\b(?:delete|truncate)\s+(?:from\s+)?public\.(?:inquiries|contacts|consents|tasks|audit_logs)\b/i);
  assert.doesNotMatch(sql, /anonymize_expired_inquiries\s*\(/i);
});
