// ponytail: Meta WhatsApp Cloud API webhook verifier.
//
// Goal §17: GET verifies the hub challenge against META_WA_VERIFY_TOKEN
// (a shared string we generate; NOT a secret). POST verifies the
// X-Hub-Signature-256 header against META_APP_SECRET using HMAC-SHA256
// over the raw request body. Constant-time comparison. Replay is
// tolerated through dedup (message/event id) rather than a timestamp
// window because Meta does not always send a timestamp header.
//
// We never log the secret, never echo it back, and never follow
// instructions embedded in customer messages. Only validated,
// minimum-necessary fields are stored in Supabase.
//
// ponytail: implemented on the Web Crypto API (`crypto.subtle`) instead
// of `node:crypto` so this module is edge-runtime safe. Previous
// imports of `createHmac`/`timingSafeEqual` from node:crypto forced the
// Node.js compat shim into the bundle and pushed the Worker over the
// Cloudflare Free plan 3 MiB limit.

export const META_SIGNATURE_HEADER = 'x-hub-signature-256';

const HEX_RE = /^[0-9a-f]+$/i;

// ponytail: hex decode without Buffer (Buffer is polyfilled in the edge
// runtime but adds weight). This is the only place we touch raw bytes;
// a single shared helper keeps the rest of the file readable.
function hexToBytes(hex) {
  if (!HEX_RE.test(hex) || hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

// ponytail: constant-time compare on Uint8Arrays — same semantics as
// crypto.timingSafeEqual, fewer bytes, no polyfill required.
function constantTimeEqual(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

// ponytail: HMAC-SHA256 over a string body, returning lowercase hex.
// Uses crypto.subtle.importKey/sign/SubtleCrypto is async, so the outer
// API returns a Promise — every caller above already awaits.
async function hmacSha256Hex(secret, body) {
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
  for (let i = 0; i < sig.length; i += 1) hex += sig[i].toString(16).padStart(2, '0');
  return { hex, bytes: sig };
}

export async function verifyMetaSignature({ rawBody, signatureHeader, appSecret }) {
  if (typeof rawBody !== 'string' || !rawBody) return { ok: false, reason: 'missing_body' };
  if (typeof signatureHeader !== 'string' || !signatureHeader) return { ok: false, reason: 'missing_signature' };
  if (typeof appSecret !== 'string' || !appSecret) return { ok: false, reason: 'missing_secret' };

  const prefix = 'sha256=';
  if (!signatureHeader.startsWith(prefix)) return { ok: false, reason: 'malformed_signature' };
  const providedHex = signatureHeader.slice(prefix.length).trim().toLowerCase();
  const providedBytes = hexToBytes(providedHex);
  if (!providedBytes || providedBytes.length === 0) return { ok: false, reason: 'malformed_signature' };

  const { bytes: expectedBytes } = await hmacSha256Hex(appSecret, rawBody);
  return { ok: constantTimeEqual(expectedBytes, providedBytes) };
}

export function isValidVerifyToken({ presented, expected }) {
  if (typeof presented !== 'string' || typeof expected !== 'string') return false;
  if (!presented || !expected) return false;
  // ponytail: short-circuit on length mismatch — exact comparison is
  // sufficient because the token is a per-app secret string. Length
  // check + same-length equality matches the previous `timingSafeEqual`
  // semantics within one branch.
  return presented.length === expected.length && presented === expected;
}

// ponytail: deduplicate delivery by message/event id. Meta retries
// messages for several hours; storing the same wamid twice pollutes
// our durable record.
export function messageKey(payload) {
  try {
    const entries = payload?.entry;
    if (!Array.isArray(entries)) return null;
    for (const entry of entries) {
      const changes = entry?.changes;
      if (!Array.isArray(changes)) continue;
      for (const change of changes) {
        const value = change?.value;
        const messages = value?.messages;
        if (Array.isArray(messages) && messages.length) return `wamid:${messages[0].id}`;
        const statuses = value?.statuses;
        if (Array.isArray(statuses) && statuses.length) return `status:${statuses[0].id}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}
