// ponytail: Retell webhook receiver. Goal §16 requires:
//   - raw body preserved
//   - X-Retell-Signature verified with the designated webhook API key (HMAC-SHA256, base64)
//   - constant-time comparison (verifyRetellSignature)
//   - reject invalid / missing / stale signatures
//   - deduplicate providerEventId
//   - tolerate out-of-order delivery
//   - redaction in logs
//
// The store's recordProviderEvent is the durable idempotency key for the
// notifier pipeline. Voice call detail is written to voice_calls (if the
// migration is present) for analytics.

import { createClient } from '@supabase/supabase-js';
import { createSupabaseNotificationStore } from '../../../../lib/notifications/supabase-store.mjs';
import {
  verifyRetellSignature,
  normalizeRetellEvent,
  SUPPORTED_EVENTS,
} from '../../../../lib/notifications/retell-webhook.mjs';
import { allowRequest, requestIdentity } from '../../../../lib/request-rate-limit.mjs';

export const runtime = 'nodejs';
const MAX_WEBHOOK_BYTES = 512 * 1024;

function json(body, status) {
  return Response.json(body, { status, headers: { 'cache-control': 'no-store' } });
}

function methodNotAllowed() {
  return json({ received: false, error: 'Method not allowed.' }, 405);
}

async function readRawBody(request) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_WEBHOOK_BYTES) return null;
  try {
    const text = await request.text();
    if (!text || Buffer.byteLength(text, 'utf8') > MAX_WEBHOOK_BYTES) return null;
    return text;
  } catch {
    return null;
  }
}

async function safeCallUpsert(supabase, normalized) {
  // ponytail: this best-effort write is wrapped so a missing voice_calls table
  // (older Supabase) doesn't break the webhook. The provider event is still
  // recorded in the durable notifier pipeline.
  if (!normalized) return false;
  try {
    const row = {
      provider: 'retell',
      call_id: normalized.callId,
      event_type: normalized.eventType,
      agent_id: normalized.agentId || null,
      call_type: normalized.callType || null,
      from_number: normalized.fromNumber || null,
      to_number: normalized.toNumber || null,
      disconnection_reason: normalized.disconnectionReason || null,
      start_timestamp: normalized.startTimestamp || null,
      end_timestamp: normalized.endTimestamp || null,
      call_summary: normalized.callAnalysis?.call_summary || null,
      call_successful: normalized.callAnalysis?.call_successful ?? null,
      user_sentiment: normalized.callAnalysis?.user_sentiment || null,
      occurred_at: normalized.occurredAt,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('voice_calls')
      .upsert(row, { onConflict: 'provider,call_id,event_type' });
    if (error) return false;
    return true;
  } catch {
    return false;
  }
}

export async function handleRetellWebhook(request, {
  env = process.env,
  verify = verifyRetellSignature,
  store: injectedStore,
  supabase: injectedSupabase,
} = {}) {
  const identity = requestIdentity(request);
  const budget = allowRequest(`retell-webhook:${identity}`, { limit: 600, windowMs: 60_000 });
  if (!budget) {
    return json({ received: false, error: "Too many requests" }, 429);
  }
  const webhookSecret = String(env.RETELL_WEBHOOK_API_KEY || env.RETELL_API_KEY || '').trim();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!webhookSecret || (!injectedStore && (!url || !serviceKey))) {
    return json({ received: false, error: 'Webhook is not configured.' }, 503);
  }

  const raw = await readRawBody(request);
  if (!raw) {
    return json({ received: false, error: 'Webhook payload is invalid.' }, 400);
  }

  const sig = request.headers.get('x-retell-signature') || request.headers.get('X-Retell-Signature');
  const result = verify(raw, sig, webhookSecret);
  if (!result.ok) {
    // ponytail: do not echo internal reason to caller.
    return json({ received: false, error: 'Invalid webhook signature.' }, 401);
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return json({ received: false, error: 'Webhook payload is invalid.' }, 400);
  }

  let normalized;
  try {
    normalized = normalizeRetellEvent(event);
  } catch {
    return json({ received: false, error: 'Webhook payload is invalid.' }, 400);
  }
  if (!normalized) {
    // Uninteresting event type. Acknowledge so Retell stops retrying.
    return json({ received: true, ignored: true, supported: [...SUPPORTED_EVENTS] }, 200);
  }

  const supabase = injectedSupabase || createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const store = injectedStore || createSupabaseNotificationStore(supabase);

  try {
    const result = await store.recordProviderEvent({
      provider: normalized.provider,
      providerEventId: normalized.providerEventId,
      eventType: normalized.eventType,
      providerMessageId: normalized.callId,
      occurredAt: normalized.occurredAt,
    });
    await safeCallUpsert(supabase, normalized);
    return json({ received: true, duplicate: result === false, eventType: normalized.eventType }, 200);
  } catch {
    return json({ received: false, error: 'Webhook could not be stored.' }, 503);
  }
}

export async function POST(request) {
  return handleRetellWebhook(request);
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
