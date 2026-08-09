import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { parseAuditPayload } from '../../../lib/audit-validation.mjs';
import { triageInquiry } from '../../../lib/ai-triage.mjs';
import { allowRequest, requestIdentity } from '../../../lib/request-rate-limit.mjs';

export const runtime = 'nodejs';

// ponytail: same-origin is the only legit call path; mirror the request Origin so browser preflight passes.
// Wildcard would let any origin POST, which we do not want for an intake form.
function corsHeaders(request) {
  const origin = request.headers.get('origin');
  const allow = origin && /^https:\/\/([a-z0-9-]+\.)?ironwake(|-site)\.netlify\.app$/i.test(origin)
    ? origin
    : 'https://ironwake-site.netlify.app';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Vary': 'Origin'
  };
}

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request) {
  // ponytail: apply CORS headers to every response so the browser does not abort the request.
  const cors = corsHeaders(request);
  const respond = (payload, init = {}) => {
    const headers = new Headers(init.headers || {});
    for (const [k, v] of Object.entries(cors)) headers.set(k, v);
    return NextResponse.json(payload, { ...init, headers });
  };
  let body;
  try { body = await request.json(); } catch { return respond({ error: 'Send a valid JSON request.' }, { status: 400 }); }
  const parsed = parseAuditPayload(body);
  if (!parsed.success) return respond({ error: 'Check the required fields and try again.' }, { status: 400 });
  if (parsed.data.website) return respond({ received: true }, { status: 202 });
  // ponytail: process-local abuse brake; replace with a shared store before multi-instance production.
  if (!allowRequest(requestIdentity(request, 'audit'))) return respond({ error: 'You are sending requests too quickly. Please wait a moment and try again.' }, { status: 429 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // ponytail: diagnostic in deployed logs — print URL host (no full URL/secret) when vars are missing.
  if (!url || !serviceKey) {
    console.error('[audit] missing env', { hasUrl: Boolean(url), hasServiceKey: Boolean(serviceKey) });
    return respond({ error: 'Intake is not connected yet.' }, { status: 503 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: inquiryId, error } = await supabase.rpc('submit_audit_inquiry', {
    p_business_name: parsed.data.business,
    p_email: parsed.data.email,
    p_leak_description: parsed.data.leak,
    p_source: 'website_audit'
  });
  if (error) {
    // ponytail: log the Supabase error so the deploy logs reveal the real failure (RLS, missing function, bad params). URL host only, no secret.
    let urlHost = 'unknown';
    try { urlHost = new URL(url).host; } catch {}
    console.error('[audit] submit_audit_inquiry failed', { urlHost, code: error.code, message: error.message, details: error.details, hint: error.hint });
    return respond({ error: 'We could not save this request. Please try again.' }, { status: 502 });
  }

  const triage = await triageInquiry(parsed.data);
  const triageStatus = triage.status === 'complete'
    ? (triage.needs_human ? 'needs_human' : 'complete')
    : (triage.status === 'unconfigured' ? 'pending' : triage.status);
  await supabase.from('inquiries').update({
    triage_status: triageStatus,
    triage_needs_human: triage.needs_human,
    triage_priority: triage.priority,
    triage_category: triage.category,
    triage_summary: triage.summary,
    triage_suggested_reply: triage.suggested_reply,
    triage_model: process.env.AI_MODEL || process.env.OPENAI_MODEL || null,
    triaged_at: triage.status === 'unconfigured' ? null : new Date().toISOString()
  }).eq('id', inquiryId);

  return respond({ received: true, message: 'We received your request. We’ll review it and follow up if needed.' }, { status: 201 });
}
