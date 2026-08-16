// ponytail: minimal server-side adapter for Retell's web-call creation.
// The browser never receives RETELL_API_KEY or RETELL_WEBHOOK_API_KEY;
// it calls this module's createWebCall(...) which calls Retell
// POST /v2/create-web-call and returns only the short-lived access token
// plus a safe call identifier. The agent ID and API key are read from
// environment so the same module runs in tests, in preview, and in
// production without code changes.
//
// The Retell response contract is documented at
//   https://docs.retellai.com/api-references/create-web-call
// We never invent fields; if Retell returns an error, we surface a safe
// stable shape the route handler can convert to a 4xx/5xx.
//
// Goal §16: server-only keys, short-lived token, real states, no fake
// waveform, no transcript exposure to the browser.

const RETELL_API_BASE = 'https://api.retellai.com';
const RETELL_AGENT_ID_ENV = 'RETELL_AGENT_ID';
const RETELL_API_KEY_ENV = 'RETELL_API_KEY';
// ponytail: RETELL_API_KEY is used for both general API auth and for
// the documented X-Retell-Signature HMAC verification on webhooks.
// Retell only supports a single key per workspace for verification;
// the value currently designated in Retell Dashboard → Settings →
// API Keys → webhook badge is the one that verifies signatures.

export function retellConfigured(env = process.env) {
  return Boolean(env[RETELL_API_KEY_ENV] && env[RETELL_AGENT_ID_ENV]);
}

export function retellUnconfiguredResult() {
  return {
    ok: false,
    safeErrorCode: 'retell_unconfigured',
    httpStatus: 503
  };
}

export async function createWebCall({
  env = process.env,
  fetchImpl = globalThis.fetch,
  metadata = {},
  customerSupabaseUserId = null
} = {}) {
  if (!retellConfigured(env)) return retellUnconfiguredResult();

  // ponytail: keep metadata minimal. Only the customer user id is
  // forwarded so the webhook can join back to a Supabase row. No
  // customer-provided free text or PII is attached.
  const safeMetadata = {};
  if (customerSupabaseUserId && typeof customerSupabaseUserId === 'string') {
    safeMetadata.supabase_user_id = customerSupabaseUserId.slice(0, 80);
  }
  if (metadata && typeof metadata === 'object') {
    if (metadata.source === 'demo' || metadata.source === 'account') {
      safeMetadata.source = metadata.source;
    }
  }

  let response;
  try {
    response = await fetchImpl(`${RETELL_API_BASE}/v2/create-web-call`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${env[RETELL_API_KEY_ENV]}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: env[RETELL_AGENT_ID_ENV],
        metadata: safeMetadata
      })
    });
  } catch (error) {
    return { ok: false, safeErrorCode: 'retell_network_unreachable', httpStatus: 502 };
  }

  if (!response.ok) {
    // ponytail: bucket Retell's status codes into safe codes the
    // route handler can show without leaking provider detail.
    if (response.status === 401 || response.status === 403) {
      return { ok: false, safeErrorCode: 'retell_key_invalid', httpStatus: 503 };
    }
    if (response.status === 429) {
      return { ok: false, safeErrorCode: 'retell_rate_limited', httpStatus: 429 };
    }
    return { ok: false, safeErrorCode: 'retell_provider_error', httpStatus: 502 };
  }

  let body;
  try {
    body = await response.json();
  } catch {
    return { ok: false, safeErrorCode: 'retell_malformed_response', httpStatus: 502 };
  }

  if (!body || typeof body !== 'object' || typeof body.access_token !== 'string' || !body.access_token) {
    return { ok: false, safeErrorCode: 'retell_malformed_response', httpStatus: 502 };
  }

  return {
    ok: true,
    accessToken: body.access_token,
    callId: typeof body.call_id === 'string' ? body.call_id : null,
    expiresInSeconds: typeof body.expires_in === 'number' ? body.expires_in : 30
  };
}

// ponytail: documented Retell signature verification. The header is
// `X-Retell-Signature: <hex-encoded HMAC-SHA256>`. The signing input is
// the exact raw request body. Comparison must be constant-time. A
// 5-minute timestamp window prevents replay; out-of-window deliveries
// are rejected even when the signature matches.
import { createHmac, timingSafeEqual } from 'node:crypto';

const RETELL_TIMESTAMP_HEADER = 'x-retell-timestamp';
const RETELL_SIGNATURE_HEADER = 'x-retell-signature';
const RETELL_TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;

export function verifyRetellSignature({
  rawBody,
  signatureHeader,
  timestampHeader,
  apiKey,
  nowMs = Date.now()
} = {}) {
  if (typeof rawBody !== 'string' || !rawBody) return { ok: false, reason: 'missing_body' };
  if (typeof signatureHeader !== 'string' || !signatureHeader) return { ok: false, reason: 'missing_signature' };
  if (typeof apiKey !== 'string' || !apiKey) return { ok: false, reason: 'missing_key' };

  const tsMs = typeof timestampHeader === 'string' ? Number(timestampHeader) : NaN;
  if (!Number.isFinite(tsMs)) return { ok: false, reason: 'invalid_timestamp' };
  if (Math.abs(nowMs - tsMs) > RETELL_TIMESTAMP_TOLERANCE_MS) {
    return { ok: false, reason: 'timestamp_out_of_window' };
  }

  const expected = createHmac('sha256', apiKey).update(rawBody, 'utf8').digest('hex');
  const provided = signatureHeader.trim().toLowerCase();
  const expectedBuf = Buffer.from(expected, 'hex');
  let providedBuf;
  try {
    providedBuf = Buffer.from(provided, 'hex');
  } catch {
    return { ok: false, reason: 'malformed_signature' };
  }
  if (providedBuf.length === 0 || providedBuf.length !== expectedBuf.length) {
    return { ok: false, reason: 'malformed_signature' };
  }
  return { ok: timingSafeEqual(expectedBuf, providedBuf) };
}

export const retellWebhookHeaders = {
  signature: RETELL_SIGNATURE_HEADER,
  timestamp: RETELL_TIMESTAMP_HEADER
};
