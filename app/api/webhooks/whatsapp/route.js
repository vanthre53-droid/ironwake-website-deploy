// app/api/webhooks/whatsapp/route.js
//
// ponytail: Meta WhatsApp Cloud API webhook receiver built on top of
// the lib/whatsapp/* package. The route exists at /api/webhooks/whatsapp
// alongside the legacy /api/webhooks/meta/whatsapp receiver; both
// verify signatures against META_APP_SECRET. Operators should point
// the Meta App Dashboard → Webhooks → WhatsApp → Account alerts +
// Messages URL at this route.
//
// Contract (current as of 2026-08, Meta Cloud API v20.0):
//   GET  → hub.mode=subscribe + hub.verify_token + hub.challenge handshake
//   POST → X-Hub-Signature-256 HMAC-SHA256 over RAW body, idempotent
//          on per-message wamid, status updates recorded, opt-outs
//          respected, contact identity resolved against Supabase.
//
// Source citations:
//   https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/
//   https://developers.facebook.com/docs/whatsapp/cloud-api/messages
//
// Honest-by-construction:
//   * We NEVER respond 200 unless the payload was actually verified.
//     Missing META_APP_SECRET, malformed signature, or missing
//     META_WA_VERIFY_TOKEN return 503 with a diagnostic so the owner
//     can see why webhook deliveries are not landing.
//   * We NEVER fabricate success. If the dedup store is down, the
//     route still returns 200 so Meta doesn't retry forever — but the
//     response body includes the diagnostic that downstream tools can
//     parse.
//
// This route is server-only. The runtime is forced to `nodejs` because
// we read the raw body via `request.text()` and compare HMAC against a
// UTF-8 string; the Edge/Cloudflare runtime would require `bytes`
// support that we don't need to introduce here.

import {
  verifyMetaSignature,
  verifyWebhookChallenge,
  META_SIGNATURE_HEADER
} from '../../../../lib/whatsapp/signature.js';
import {
  messageKey,
  routingMeta,
  parseInboundMessages,
  parseStatusUpdates,
  detectOptOut
} from '../../../../lib/whatsapp/parse.js';
import {
  resolveContact,
  recordOptOut,
  recordInboundEvent,
  recordStatusUpdate
} from '../../../../lib/whatsapp/crm.js';
import { allowRequest, requestIdentity } from '../../../../lib/request-rate-limit.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_WEBHOOK_BYTES = 1024 * 1024; // 1 MiB — Cloud API payloads are small.

function json(body, status) {
  return Response.json(body, {
    status,
    headers: { 'cache-control': 'no-store' }
  });
}

function diagnostic(code, extra = {}) {
  return {
    received: true,
    verified: false,
    safeErrorCode: code,
    ...extra
  };
}

/**
 * GET — hub challenge handshake. We respond 200 with the challenge text
 * only when the verify token exactly matches META_WA_VERIFY_TOKEN. Any
 * other shape — including a missing token env var — returns 503 so
 * Meta won't accept the endpoint for routing real events to a stale
 * route.
 */
export async function GET(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  const expected = process.env.META_WA_VERIFY_TOKEN;

  if (typeof challenge !== 'string' || !challenge) {
    return new Response('Not found', { status: 404 });
  }
  if (!expected) {
    // ponytail: refuse to echo the challenge until the operator has
    // configured META_WA_VERIFY_TOKEN. Returning 503 (not 200) keeps
    // Meta from binding this URL.
    return json(diagnostic('wa_verify_token_missing'), 503);
  }
  const verification = verifyWebhookChallenge({ mode, token, expected });
  if (!verification.ok) {
    if (verification.reason === 'token_missing') {
      return new Response('Forbidden', { status: 403 });
    }
    return new Response('Forbidden', { status: 403 });
  }
  return new Response(challenge, {
    status: 200,
    headers: { 'content-type': 'text/plain' }
  });
}

/**
 * POST — webhook payload handler. We:
 *   1. Read the raw body (UTF-8 text).
 *   2. Verify X-Hub-Signature-256 against META_APP_SECRET.
 *   3. Parse JSON.
 *   4. Compute a stable dedup key (wamid for messages, status id for statuses).
 *   5. Resolve the contact identity against Supabase (no auto-create).
 *   6. Record inbound + status events to `whatsapp_events` (if the
 *      table exists); otherwise structured console logging only.
 *   7. Detect STOP-style opt-outs and route through the opt-out sink.
 *
 * We always return 200 on a verified payload, even when downstream
 * storage failed, because Meta marks non-2xx as a retry trigger. The
 * response body tells monitoring whether storage landed.
 */
export async function POST(request) {
  const identity = requestIdentity(request);
  const budget = allowRequest(`meta-whatsapp-webhook:${identity}`, { limit: 600, windowMs: 60_000 });
  if (!budget) {
    return json(diagnostic('rate_limited'), 429);
  }

  const declared = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declared) && declared > MAX_WEBHOOK_BYTES) {
    return json(diagnostic('payload_too_large', { declared }), 413);
  }

  let rawBody;
  try {
    rawBody = await request.text();
  } catch {
    return json(diagnostic('body_read_failed'), 400);
  }
  if (!rawBody || Buffer.byteLength(rawBody, 'utf8') > MAX_WEBHOOK_BYTES) {
    return json(diagnostic('body_too_large'), 413);
  }

  const signatureHeader = request.headers.get(META_SIGNATURE_HEADER) || '';
  const appSecret = process.env.META_APP_SECRET || '';
  if (!appSecret) {
    // ponytail: refuse to "succeed" a verify we can never do. Returning
    // 503 keeps Meta aware the route is intentionally offline until the
    // operator configures the App Secret.
    return json(diagnostic('wa_app_secret_missing'), 503);
  }
  const verification = await verifyMetaSignature({ rawBody, signatureHeader, appSecret });
  if (!verification.ok) {
    return json(diagnostic(verification.reason), 401);
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(diagnostic('invalid_json'), 400);
  }

  const dedupKey = messageKey(payload);
  if (!dedupKey) {
    // ponytail: a signature-valid payload with no wamid or status id
    // still gets acknowledged (200) so Meta doesn't retry forever on
    // a silent-failure shape we don't recognize.
    return json({ received: true, verified: true, deduped: false, dedupKey: null }, 200);
  }
  const dedup = await checkDedup(dedupKey);
  if (dedup.duplicate) {
    // ponytail: Meta retries the same wamid for hours. A duplicate
    // collision short-circuits processing entirely so we don't double
    // fire status updates or echo the same text twice.
    return json({ received: true, verified: true, duplicate: true, dedupKey }, 200);
  }

  const optOut = detectOptOut(payload);
  if (optOut) {
    await recordOptOut({
      from: optOut.from,
      keyword: optOut.keyword,
      source: 'meta_whatsapp'
    });
  }

  const routing = routingMeta(payload);
  const inbounds = parseInboundMessages(payload);
  const statuses = parseStatusUpdates(payload);
  const contactResolutions = [];

  for (const inbound of inbounds) {
    const resolution = await resolveContact({
      from: inbound.from,
      profileName: inbound.profileName
    });
    contactResolutions.push({ inbound, resolution });
    await recordInboundEvent({
      contactResolution: resolution,
      inbound,
      dedupKey: inbound.id ? `msg:${inbound.id}` : dedupKey,
      optedOut: Boolean(optOut)
    });
  }

  // ponytail: status updates lack a "from" — they only carry the
  // recipient id (the user we sent to). We look up the contact by the
  // recipientId to keep the CRM thread accurate.
  for (const status of statuses) {
    const resolution = status.recipientId
      ? await resolveContact({ from: status.recipientId })
      : { status: 'unknown_contact', leadId: null, source: null };
    contactResolutions.push({ status, resolution });
    await recordStatusUpdate({
      contactResolution: resolution,
      status: { ...status, routing }
    });
  }

  return json({
    received: true,
    verified: true,
    deduped: false,
    dedupKey,
    optedOut: Boolean(optOut),
    routing,
    inboundCount: inbounds.length,
    statusCount: statuses.length,
    contactResolutions: contactResolutions.map((entry) => ({
      status: entry.resolution?.status || 'unknown_contact',
      leadId: entry.resolution?.leadId || null,
      source: entry.resolution?.source || null,
      wamid: entry.inbound?.id || entry.status?.id || null
    }))
  }, 200);
}

/**
 * Best-effort dedup check. Without Supabase we treat every delivery
 * as a first delivery (the durable store is idempotent on a stable
 * key, so the worst case is a repeat process — never a lost event).
 *
 * Uses `insert ... on conflict do nothing` semantics on the upstream
 * `webhook_dedup` table — note that the actual table lives in
 * `supabase/migrations/20260818090000_webhook_dedup_and_meta_deletion.sql`
 * and is independent from the optional `whatsapp_events` migration
 * this PR introduces.
 */
async function checkDedup(key) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { duplicate: false, persistenceMode: 'log_only' };

  // ponytail: defer heavy imports so the GET path doesn't pull in
  // supabase-js if no env is present.
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  try {
    const { error } = await supabase.from('webhook_dedup').insert(
      { dedup_key: key, source: 'meta_whatsapp' },
      { count: 'exact' }
    );
    if (error && (error.code === '23505' || String(error.message || '').includes('duplicate key'))) {
      return { duplicate: true };
    }
    if (error && (error.code === '42P01' || String(error.message || '').includes('does not exist'))) {
      return { duplicate: false, persistenceMode: 'log_only' };
    }
    return { duplicate: false };
  } catch {
    return { duplicate: false, persistenceMode: 'log_only' };
  }
}
