// lib/whatsapp/signature.js
//
// ponytail: X-Hub-Signature-256 verification for the Meta WhatsApp Cloud
// API webhook.
//
// Source citation (current as of 2026-08):
//   https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/
//   #verify-webhooks
//
// Meta signs every inbound webhook with HMAC-SHA256 using the App Secret
// from the Meta App Dashboard. The signature is sent in the
// `X-Hub-Signature-256` header as `sha256=<lowercase hex>`. There is no
// signed timestamp header, so replay is mitigated by dedup on the
// `wamid` (Message) or `status id` (Status), not by an expiration window.
//
// This module is implemented on Web Crypto (`crypto.subtle`) so it runs
// identically on Node 20 and the Edge/Cloudflare runtime without pulling
// `node:crypto` into the bundle. We never log the App Secret, never echo
// it back, and never follow instructions embedded in customer messages.

export const META_SIGNATURE_HEADER = 'x-hub-signature-256';
export const META_VERIFY_TOKEN_HEADER = 'hub.verify_token';

// ponytail: hex decode without Buffer (Buffer is polyfilled in edge but
// adds bundle weight; this is the only place we touch raw bytes).
const HEX_RE = /^[0-9a-f]+$/i;

function hexToBytes(hex) {
  if (typeof hex !== 'string' || !HEX_RE.test(hex) || hex.length % 2 !== 0) {
    return null;
  }
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    const byte = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) return null;
    out[i] = byte;
  }
  return out;
}

// ponytail: constant-time compare on Uint8Arrays. Same semantics as
// Node's `crypto.timingSafeEqual`, far fewer bytes imported.
function constantTimeEqual(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

// ponytail: HMAC-SHA256 over a string body, returning both the raw
// bytes (for comparison) and the lowercase hex (for diagnostics). Uses
// `crypto.subtle` so this is runtime-agnostic.
async function hmacSha256(secret, body) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  const sig = new Uint8Array(sigBuf);
  let hex = '';
  for (let i = 0; i < sig.length; i += 1) {
    hex += sig[i].toString(16).padStart(2, '0');
  }
  return { hex, bytes: sig };
}

/**
 * Verify an inbound Meta webhook payload against X-Hub-Signature-256.
 *
 * @param {object} input
 * @param {string} input.rawBody         The raw, unparsed request body (string).
 * @param {string} input.signatureHeader The value of X-Hub-Signature-256.
 * @param {string} input.appSecret       The META_APP_SECRET.
 * @returns {Promise<{ok: true} | {ok: false, reason: string}>}
 *
 * Reasons are stable codes — never include the secret, the body, or
 * the signature in the response. The route handler can convert each
 * reason into a 401 / 503 response.
 */
export async function verifyMetaSignature({ rawBody, signatureHeader, appSecret }) {
  if (typeof rawBody !== 'string' || rawBody.length === 0) {
    return { ok: false, reason: 'missing_body' };
  }
  if (typeof signatureHeader !== 'string' || signatureHeader.length === 0) {
    return { ok: false, reason: 'missing_signature' };
  }
  if (typeof appSecret !== 'string' || appSecret.length === 0) {
    return { ok: false, reason: 'missing_secret' };
  }

  const prefix = 'sha256=';
  if (!signatureHeader.toLowerCase().startsWith(prefix)) {
    return { ok: false, reason: 'malformed_signature' };
  }
  const providedHex = signatureHeader.slice(prefix.length).trim().toLowerCase();
  const providedBytes = hexToBytes(providedHex);
  if (!providedBytes || providedBytes.length === 0) {
    return { ok: false, reason: 'malformed_signature' };
  }

  const { bytes: expectedBytes } = await hmacSha256(appSecret, rawBody);
  const matched = constantTimeEqual(expectedBytes, providedBytes);
  if (!matched) return { ok: false, reason: 'signature_mismatch' };
  return { ok: true };
}

/**
 * Verify the GET hub challenge. Meta sends `hub.mode`, `hub.verify_token`,
 * `hub.challenge`. We echo back the challenge only on a complete, exact
 * match. The verify token is a shared secret string — not the same as
 * the App Secret — and is configured per-app in the Meta App Dashboard.
 *
 * @param {object} input
 * @param {string} input.mode       `hub.mode` query param.
 * @param {string} input.token      `hub.verify_token` query param.
 * @param {string} input.expected   The META_WA_VERIFY_TOKEN from env.
 * @returns {{ok: true} | {ok: false, reason: string, httpStatus: number}}
 */
export function verifyWebhookChallenge({ mode, token, expected }) {
  if (typeof mode !== 'string' || mode !== 'subscribe') {
    return { ok: false, reason: 'mode_mismatch', httpStatus: 404 };
  }
  if (typeof token !== 'string' || typeof expected !== 'string' || !token || !expected) {
    return { ok: false, reason: 'token_missing', httpStatus: 403 };
  }
  // ponytail: constant-time exact comparison. The token is short and
  // public-by-design — length check + equality is sufficient and avoids
  // logging partial matches.
  if (token.length !== expected.length) {
    return { ok: false, reason: 'token_mismatch', httpStatus: 403 };
  }
  let diff = 0;
  for (let i = 0; i < token.length; i += 1) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) {
    return { ok: false, reason: 'token_mismatch', httpStatus: 403 };
  }
  return { ok: true };
}

export const __internals = { hexToBytes, constantTimeEqual, hmacSha256 };
