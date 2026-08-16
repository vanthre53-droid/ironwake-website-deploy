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

import { createHmac, timingSafeEqual } from 'node:crypto';

export const META_SIGNATURE_HEADER = 'x-hub-signature-256';

export function verifyMetaSignature({ rawBody, signatureHeader, appSecret }) {
  if (typeof rawBody !== 'string' || !rawBody) return { ok: false, reason: 'missing_body' };
  if (typeof signatureHeader !== 'string' || !signatureHeader) return { ok: false, reason: 'missing_signature' };
  if (typeof appSecret !== 'string' || !appSecret) return { ok: false, reason: 'missing_secret' };

  const prefix = 'sha256=';
  if (!signatureHeader.startsWith(prefix)) return { ok: false, reason: 'malformed_signature' };
  const providedHex = signatureHeader.slice(prefix.length).trim().toLowerCase();

  const expectedHex = createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  let providedBuf;
  try {
    providedBuf = Buffer.from(providedHex, 'hex');
  } catch {
    return { ok: false, reason: 'malformed_signature' };
  }
  if (providedBuf.length === 0 || providedBuf.length !== expectedBuf.length) {
    return { ok: false, reason: 'malformed_signature' };
  }
  return { ok: timingSafeEqual(expectedBuf, providedBuf) };
}

export function isValidVerifyToken({ presented, expected }) {
  if (typeof presented !== 'string' || typeof expected !== 'string') return false;
  if (!presented || !expected) return false;
  const a = Buffer.from(presented, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
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
