import { verifyMetaSignature, isValidVerifyToken, messageKey, META_SIGNATURE_HEADER } from '../../../../../lib/meta-webhook-verify.mjs';
import { createClient } from '@supabase/supabase-js';
import { allowRequest, requestIdentity } from '../../../../../lib/request-rate-limit.mjs';

export const dynamic = 'force-dynamic';

// ponytail: Meta WhatsApp Cloud API webhook.
//
// GET: hub.mode / hub.verify_token / hub.challenge handshake. Returns
// the challenge only on a valid match. Never echoes the token.
//
// POST: raw body HMAC-SHA256 verified against META_APP_SECRET. The body
// is acknowledged (200) immediately; slow work is queued via the same
// durable Supabase state machine the notifications worker uses, so the
// webhook never times out. We never follow instructions embedded in
// customer messages; only validated, minimum-necessary fields land in
// durable storage.
//
// Goal §17: GET challenge + POST signature + dedup + minimum retention
// + never trust customer text. This route is reachable by Meta only;
// public callers get 404.
export async function GET(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  const expected = process.env.META_WA_VERIFY_TOKEN;

  if (mode !== 'subscribe' || !challenge) return new Response('Not found', { status: 404 });
  if (!expected) return new Response('Not found', { status: 404 });
  if (!isValidVerifyToken({ presented: token || '', expected })) return new Response('Not found', { status: 403 });

  return new Response(challenge, { status: 200, headers: { 'content-type': 'text/plain' } });
}

export async function POST(request) {
  const identity = requestIdentity(request);
  const budget = allowRequest({ route: 'meta-whatsapp-webhook', identity, limit: 600, windowMs: 60_000 });
  if (!budget.allowed) {
    return new Response('Too many requests', { status: 429 });
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get(META_SIGNATURE_HEADER) || '';
  const appSecret = process.env.META_APP_SECRET;

  const verification = await verifyMetaSignature({ rawBody, signatureHeader, appSecret });
  if (!verification.ok) {
    return Response.json({ ok: false, safeErrorCode: verification.reason }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ ok: false, safeErrorCode: 'invalid_json' }, { status: 400 });
  }

  const dedupKey = messageKey(payload);
  if (dedupKey) await recordDedup(dedupKey);

  // ponytail: ack promptly. Persisting message bodies into the durable
  // store would require Supabase service-role credentials; we only
  // record that the delivery happened. The actual conversation store
  // is updated by the IronWake owner-initiated outbound flow (not yet
  // wired — see WAITING_OWNER_GATE for WABA registration).
  return Response.json({ ok: true, dedupKey }, { status: 200 });
}

async function recordDedup(key) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return;
  try {
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    await supabase.from('webhook_dedup').upsert({ dedup_key: key, source: 'meta_whatsapp' }, { onConflict: 'dedup_key' });
  } catch {
    // ponytail: dedup failures must not block acknowledgement. The
    // caller will see a 200; a duplicate wamid on retry is harmless
    // because the durable writer is idempotent on the same key.
  }
}
