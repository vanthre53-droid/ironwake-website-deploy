import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('owner dashboard uses Supabase auth and does not expose service credentials', async () => {
  const source = await readFile(new URL('./OwnerDashboard.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /signInWithPassword/);
  assert.match(source, /signOut/);
  assert.match(source, /from\('inquiries'\)\.select/);
  assert.match(source, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
});

test('owner dashboard exposes lead_stage/next_action/due_at with a stage filter', async () => {
  const source = await readFile(new URL('./OwnerDashboard.js', import.meta.url), 'utf8');
  assert.match(source, /lead_stage,next_action,due_at/);
  assert.match(source, /aria-label="Filter by lead stage"/);
  assert.match(source, /STAGES = \[.*'won', 'lost'\]/);
  assert.match(source, /builder\.eq\('lead_stage', stage\)/);
  assert.match(source, /Next action/);
  assert.match(source, /formatDue/);
  assert.match(source, /Search inquiries/);
  assert.match(source, /Export visible/);
  assert.match(source, /Inquiry detail/);
  assert.match(source, /Booking request/);
  assert.match(source, /triage_status,triage_priority,triage_category/);
  assert.match(source, /triage_provider,triage_model,triage_error_code/);
  assert.match(source, /AI triage/);
  assert.match(source, /Provider \/ model/);
  assert.match(source, /Safe triage status/);
  assert.match(source, /leak_description,source,booking_status/);
  assert.match(source, /booking_status \|\| 'Not a booking request'/);
  assert.match(source, /Request summary/);
  assert.match(source, /from\('tasks'\)\.select/);
  assert.match(source, /owner_complete_task/);
  assert.match(source, /Complete follow-up task/);
  assert.match(source, /Follow-up task completed and recorded/);
  assert.match(source, /This screen never seeds or invents CRM activity/);
});
