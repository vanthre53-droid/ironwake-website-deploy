// ponytail: Retell webhook signature verification + idempotent event
// normalization. Goal §16 mandates:
//   - verify X-Retell-Signature with the designated webhook API key
//   - HMAC-SHA256 over the raw body (Retell's official scheme)
//   - constant-time comparison
//   - reject missing/invalid/stale signatures
//   - tolerate out-of-order call_started / call_ended / call_analyzed delivery
//   - redact PII before logging
//
// Retell publishes the recommended verification helper at
//   https://docs.retellai.com/api-references/webhook-signature
// and the field X-Retell-Signature contains a base64-encoded HMAC-SHA256.

import { createHmac, timingSafeEqual } from 'node:crypto';

export const SUPPORTED_EVENTS = new Set([
  'call_started',
  'call_ended',
  'call_analyzed',
  'transcript_updated',
]);

const MAX_SKEW_MS = 5 * 60 * 1000;
const ALLOWED_FIELDS = new Set(['id', 'agent_id', 'call_type', 'from_number', 'to_number', 'start_timestamp', 'end_timestamp', 'transcript', 'call_analysis', 'disconnection_reason', 'metadata']);

function safeStr(v, max = 1000) {
  if (v == null) return '';
  if (typeof v !== 'string') return '';
  return v.slice(0, max);
}

function safeNumber(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function safeInt(v) {
  const n = safeNumber(v);
  return n == null ? null : Math.trunc(n);
}

function safeAnalysis(input) {
  if (!input || typeof input !== 'object') return null;
  const out = {};
  if (typeof input.call_summary === 'string') out.call_summary = safeStr(input.call_summary, 8000);
  if (typeof input.call_successful === 'boolean') out.call_successful = input.call_successful;
  if (typeof input.user_sentiment === 'string') out.user_sentiment = safeStr(input.user_sentiment, 32);
  return Object.keys(out).length ? out : null;
}

export function verifyRetellSignature(rawBody, signatureHeader, secret) {
  if (typeof rawBody !== 'string' || !rawBody) {
    return { ok: false, reason: 'missing_body' };
  }
  if (typeof signatureHeader !== 'string' || !signatureHeader) {
    return { ok: false, reason: 'missing_signature' };
  }
  if (typeof secret !== 'string' || !secret) {
    return { ok: false, reason: 'missing_secret' };
  }
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signatureHeader.trim(), 'utf8');
  if (a.length !== b.length) return { ok: false, reason: 'invalid_signature' };
  try {
    return timingSafeEqual(a, b)
      ? { ok: true }
      : { ok: false, reason: 'invalid_signature' };
  } catch {
    return { ok: false, reason: 'invalid_signature' };
  }
}

export function normalizeRetellEvent(event, { receivedAtMs = Date.now() } = {}) {
  if (!event || typeof event !== 'object') throw new Error('payload_invalid');
  const type = safeStr(event.event, 64);
  if (!SUPPORTED_EVENTS.has(type)) return null;
  const data = event.data && typeof event.data === 'object' ? event.data : {};
  const callId = safeStr(data.call_id || data.id, 128);
  if (!callId) throw new Error('payload_invalid');
  const startMs = safeInt(data.start_timestamp);
  const endMs = safeInt(data.end_timestamp);
  const occurredAt =
    endMs ? new Date(endMs).toISOString()
    : startMs ? new Date(startMs).toISOString()
    : new Date(receivedAtMs).toISOString();

  // Skew check against call_analyzed (often delivered minutes later).
  // Started/ended events with timestamps far in the future are likely replays.
  const futureDelta = (startMs || endMs || 0) - receivedAtMs;
  if (futureDelta > MAX_SKEW_MS) throw new Error('event_too_far_in_future');

  const out = {
    provider: 'retell',
    providerEventId: `${type}:${callId}:${occurredAt}`,
    callId,
    eventType: type,
    occurredAt,
    fromNumber: safeStr(data.from_number, 32),
    toNumber: safeStr(data.to_number, 32),
    agentId: safeStr(data.agent_id, 128),
    callType: safeStr(data.call_type, 32),
    disconnectionReason: safeStr(data.disconnection_reason, 128),
    callAnalysis: safeAnalysis(data.call_analysis),
  };
  if (startMs) out.startTimestamp = startMs;
  if (endMs) out.endTimestamp = endMs;
  return out;
}

export const retellWebhookInternals = {
  MAX_SKEW_MS,
  ALLOWED_FIELDS,
  safeStr,
};
