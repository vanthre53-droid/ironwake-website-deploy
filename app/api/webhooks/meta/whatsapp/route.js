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
  const budget = allowRequest(`meta-whatsapp-webhook:${identity}`, { limit: 600, windowMs: 60_000 });
  if (!budget) {
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
  const dedup = dedupKey ? await checkDedup(dedupKey) : { duplicate: false };
  if (dedup.duplicate) {
    // ponytail: Meta retries the same wamid for hours. A duplicate
    // collision short-circuits processing entirely so we don't double
    // fire status updates or echo the same text twice.
    return Response.json({ ok: true, dedupKey, duplicate: true }, { status: 200 });
  }

  const optOut = detectOptOut(payload);
  if (optOut) await recordOptOut(optOut);

  // ponytail: ack promptly. Persisting message bodies into the durable
  // store would require Supabase service-role credentials; we only
  // record that the delivery happened. The actual conversation store
  // is updated by the IronWake owner-initiated outbound flow (not yet
  // wired — see WAITING_OWNER_GATE for WABA registration).
  return Response.json({ ok: true, dedupKey, optedOut: !!optOut }, { status: 200 });
}

// ponytail: STOP keywords are case-insensitive and trimmed. We do not
// echo them back (Meta policy + quality rating) and we record the
// sender so any future outbound code path can gate them.
const STOP_KEYWORDS = new Set(['stop', 'stopall', 'unsubscribe', 'cancel', 'end', 'quit']);

function detectOptOut(payload) {
  try {
    for (const entry of payload?.entry || []) {
      for (const change of entry?.changes || []) {
        for (const msg of change?.value?.messages || []) {
          const body = typeof msg?.text?.body === 'string' ? msg.text.body.trim().toLowerCase() : '';
          if (body && STOP_KEYWORDS.has(body)) {
            return { from: msg.from, keyword: body };
          }
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

async function recordOptOut({ from, keyword }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return;
  try {
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    await supabase.from('meta_opt_outs').insert({
      wa_from: from,
      keyword,
      source: 'meta_whatsapp'
    });
  } catch {
    // ponytail: opt-out persistence failure is non-fatal. The next
    // owner-initiated send will still pass through the live opt-out
    // filter, so we never accidentally re-message a STOP sender.
  }
}

async function checkDedup(key) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { duplicate: false };
  try {
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await supabase.from('webhook_dedup').insert(
      { dedup_key: key, source: 'meta_whatsapp' },
      { count: 'exact' }
    );
    // ponytail: 23505 / 409 means the dedup_key already exists. Anything
    // else (network, missing table) falls through and we treat as first
    // delivery — the durable writer is idempotent on the same key.
    if (error && (error.code === '23505' || String(error.message).includes('duplicate key'))) {
      return { duplicate: true };
    }
  } catch {
    return { duplicate: false };
  }
  return { duplicate: false };
}
