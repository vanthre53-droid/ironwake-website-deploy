import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { parseAuditPayload } from '../../../lib/audit-validation.mjs';
import { triageInquiry } from '../../../lib/ai-triage.mjs';
import { allowRequest, requestIdentity } from '../../../lib/request-rate-limit.mjs';
import { createSupabaseNotificationStore } from '../../../lib/notifications/supabase-store.mjs';
import { needsPriorityAlert, runNotificationWorkerBestEffort } from '../../../lib/notifications/worker.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Send a valid JSON request.' }, { status: 400 }); }
  const parsed = parseAuditPayload(body);
  if (!parsed.success) return NextResponse.json({ error: 'Check the required fields and try again.' }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ received: true }, { status: 202 });
  // ponytail: process-local abuse brake; replace with a shared store before multi-instance production.
  if (!allowRequest(requestIdentity(request, 'audit'))) return NextResponse.json({ error: 'You are sending requests too quickly. Please wait a moment and try again.' }, { status: 429 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // ponytail: diagnostic in deployed logs — print URL host (no full URL/secret) when vars are missing.
  if (!url || !serviceKey) {
    console.error('[audit] missing env', { hasUrl: Boolean(url), hasServiceKey: Boolean(serviceKey) });
    return NextResponse.json({ error: 'Intake is not connected yet.' }, { status: 503 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: inquiryId, error } = await supabase.rpc('submit_audit_inquiry', {
    p_business_name: parsed.data.business,
    p_email: parsed.data.email,
    p_leak_description: parsed.data.leak,
    p_source: parsed.data.source,
  });
  if (error) {
    // Keep production diagnostics useful without logging provider details that can echo submitted values.
    let urlHost = 'unknown';
    try { urlHost = new URL(url).host; } catch {}
    console.error('[audit] submit_audit_inquiry failed', { urlHost, code: error.code || 'unknown' });
    return NextResponse.json({ error: 'We could not save this request. Please try again.' }, { status: 502 });
  }

  const triage = await triageInquiry(parsed.data);
  const triageStatus = triage.status === 'complete'
    ? (triage.needs_human ? 'needs_human' : 'complete')
    : (triage.status === 'unconfigured' ? 'pending' : triage.status);
  const { error: triageStorageError } = await supabase.from('inquiries').update({
    triage_status: triageStatus,
    triage_needs_human: triage.needs_human,
    triage_priority: triage.priority,
    triage_category: triage.category,
    triage_summary: triage.summary,
    triage_suggested_reply: triage.suggested_reply,
    triage_provider: triage.provider || null,
    triage_model: triage.model || process.env.AI_MODEL || null,
    triage_error_code: triage.safe_error_code || null,
    triage_attempted_at: triage.status === 'unconfigured' ? null : new Date().toISOString(),
    triaged_at: triage.status === 'complete' ? new Date().toISOString() : null
  }).eq('id', inquiryId);
  if (triageStorageError) {
    console.error('[audit] triage persistence failed', { safeCode: triageStorageError.code || 'triage_storage_failed' });
    return NextResponse.json({ error: 'We received your request but could not complete its private review.' }, { status: 202 });
  }

  // Notification work is best-effort after the inquiry transaction and triage.
  // Missing provider configuration claims nothing and consumes no attempt.
  const notificationStore = createSupabaseNotificationStore(supabase);
  if (needsPriorityAlert(triage)) {
    try {
      await notificationStore.queuePriority(inquiryId);
    } catch (priorityError) {
      console.error('[audit] priority notification queue failed', {
        safeCode: priorityError?.safeCode || 'notification_priority_queue_failed'
      });
    }
  }
  const notificationResult = await runNotificationWorkerBestEffort({
    env: process.env,
    store: notificationStore,
    inquiryId,
    limit: 10
  });
  if (notificationResult.status === 'worker_error') {
    console.error('[audit] notification worker failed', { safeCode: notificationResult.safeErrorCode });
  }

  return NextResponse.json({ received: true, message: 'We received your request. We’ll review it and follow up if needed.' }, { status: 201 });
}
