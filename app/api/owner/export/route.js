import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server.js';
import { parseBearerToken } from '../../../../../lib/owner-auth.mjs';

export const runtime = 'nodejs';
const OWNER_EMAIL = 'ironwakee@gmail.com';
const MAX_ROWS_PER_COLLECTION = 1_000;

const EXPORTS = [
  ['inquiries', 'id,contact_id,business_name,email,leak_description,source,consented_at,lead_stage,next_action,due_at,booking_status,retention_until,anonymized_at,created_at,updated_at,triage_status,triage_needs_human,triage_priority,triage_category,triage_summary,triage_suggested_reply,triage_provider,triage_model,triage_error_code,triage_attempted_at,triaged_at'],
  ['contacts', 'id,email_normalized,business_name,created_at,updated_at,anonymized_at'],
  ['consents', 'id,inquiry_id,consent_type,granted_at,source,withdrawn_at'],
  ['tasks', 'id,inquiry_id,category,due_at,completed_at,created_at'],
  ['outbox_events', 'id,inquiry_id,event_type,target_type,status,idempotency_key,attempts,retry_cycle,available_at,last_error_code,accepted_at,delivered_at,created_at,updated_at'],
  ['notification_attempts', 'id,outbox_event_id,retry_cycle,attempt_number,provider,status,provider_message_id,safe_error_code,retryable,started_at,finished_at'],
  ['provider_events', 'id,provider,provider_event_id,event_type,provider_message_id,outbox_event_id,occurred_at,received_at'],
  ['owner_notes', 'id,inquiry_id,body,created_at'],
  ['audit_logs', 'id,inquiry_id,action,actor_type,metadata,created_at']
];

function unauthorized(reason, status) {
  return NextResponse.json({ exported: false, reason }, { status });
}

export async function POST(request) {
  const token = parseBearerToken(request.headers.get('authorization'));
  if (!token) return unauthorized('No active session.', 401);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return unauthorized('Auth is not connected.', 503);

  const auth = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await auth.auth.getUser(token);
  if (authError || !authData?.user) return unauthorized('Session is not valid.', 401);
  if ((authData.user.email || '').toLowerCase() !== OWNER_EMAIL) return unauthorized('This account is not the authorized owner.', 403);

  const database = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  let results;
  try {
    results = await Promise.all(EXPORTS.map(async ([table, fields]) => {
      const { data, error } = await database.from(table).select(fields).limit(MAX_ROWS_PER_COLLECTION);
      if (error) throw new Error('owner_export_query_failed');
      return [table, data || []];
    }));
  } catch {
    return unauthorized('The CRM export is temporarily unavailable.', 503);
  }

  const collections = Object.fromEntries(results);
  const payload = JSON.stringify({
    exported_at: new Date().toISOString(),
    max_rows_per_collection: MAX_ROWS_PER_COLLECTION,
    collections
  });
  return new NextResponse(payload, {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': 'attachment; filename="ironwake-owner-crm-export.json"',
      'cache-control': 'no-store'
    }
  });
}
