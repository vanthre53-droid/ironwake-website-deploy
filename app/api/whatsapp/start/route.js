// IronWake WhatsApp conversation starter — Meta Cloud API integration.
// Sends a real WhatsApp template message to the visitor's phone so a real
// conversation opens in their WhatsApp app. Falls back to /contact if Meta
// credentials are missing or the visitor's phone is invalid.
//
// POST /api/whatsapp/start  body: { phone: "+91XXXXXXXXXX", template?: "hello_world" }
// Response: { ok: true, messageId } | { ok: false, error, code }
//
// The visitor-facing FAB posts here after collecting the phone. We NEVER
// auto-trigger from the page — only after explicit user submission, which
// satisfies Meta's 24h customer-service window rule (template messages are
// only legal outside the window).
//
// Idempotency: idempotency-key header required; we cache responses per key
// for 10 minutes so duplicate clicks do not double-send.
//
// Rate limit: 5 req/min/IP (template sends cost real money).

import { NextResponse } from 'next/server.js';
import { createHash } from 'node:crypto';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 2_048;
const RATE_LIMIT = { limit: 5, windowSeconds: 60 };
const TEMPLATES = new Set(['hello_world', 'ironwake_intro']);
const MUTATION_HEADERS = { 'cache-control': 'no-store' };
const PHONE_REGEX = /^\+\d{8,15}$/;

// In-memory idempotency cache. Per-process; survives only within the warm
// instance lifetime. For multi-region, swap for KV/Durable Object.
const idempotencyCache = new Map();
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;

// In-memory rate-limit buckets.
const rateBuckets = new Map();

function ok(body, status = 200) {
  return NextResponse.json(body, { status, headers: MUTATION_HEADERS });
}
function err(error, status, code) {
  return NextResponse.json({ ok: false, error, code }, { status, headers: MUTATION_HEADERS });
}

function rateKey(identity) {
  return `wa:start:${identity}`;
}
function allowRate(identity) {
  const now = Date.now();
  const windowMs = RATE_LIMIT.windowSeconds * 1000;
  const key = rateKey(identity);
  const active = (rateBuckets.get(key) || []).filter((t) => now - t < windowMs);
  if (active.length >= RATE_LIMIT.limit) {
    rateBuckets.set(key, active);
    return false;
  }
  active.push(now);
  rateBuckets.set(key, active);
  return true;
}

function idKey(identity) {
  return createHash('sha256').update(identity).digest('hex').slice(0, 16);
}

function getCachedIdempotent(key) {
  const hit = idempotencyCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.t > IDEMPOTENCY_TTL_MS) {
    idempotencyCache.delete(key);
    return null;
  }
  return hit.response;
}
function setCachedIdempotent(key, response) {
  idempotencyCache.set(key, { t: Date.now(), response });
}

function credentialsAvailable(env) {
  return Boolean(
    env.META_WA_ACCESS_TOKEN &&
      env.META_WA_PHONE_NUMBER_ID &&
      /^https?:\/\//.test(env.META_GRAPH_API_BASE || 'https://graph.facebook.com')
  );
}

async function sendMetaTemplate({ accessToken, phoneNumberId, to, template, language, graphBase }) {
  const url = `${graphBase}/v22.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to.replace(/^\+/, ''),
    type: 'template',
    template: {
      name: template,
      language: { code: language || 'en' },
    },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, body: json };
}

export async function POST(request, { env = process.env, fetchImpl = fetch } = {}) {
  // 1) Method/content-type guard
  const mediaType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (mediaType !== 'application/json') {
    return err('Send a JSON request.', 415, 'unsupported_media_type');
  }

  // 2) Identity + rate limit
  const ip = request.headers.get('x-forwarded-for')?.split(',', 1)[0]?.trim() || 'unknown';
  if (!allowRate(idKey(ip))) {
    return err('Too many WhatsApp start requests. Try again shortly.', 429, 'rate_limited');
  }

  // 3) Idempotency
  const idemKey = request.headers.get('idempotency-key') || '';
  if (!idemKey || idemKey.length < 8 || idemKey.length > 128) {
    return err('Idempotency-Key header is required (8-128 chars).', 400, 'idempotency_required');
  }
  const cached = getCachedIdempotent(idemKey);
  if (cached) {
    return NextResponse.json(cached, { status: cached.__status || 200, headers: MUTATION_HEADERS });
  }

  // 4) Body parsing + size guard
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return err('Phone payload too large.', 413, 'payload_too_large');
  }
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return err('Invalid JSON body.', 400, 'invalid_json');
  }
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const template = typeof body.template === 'string' && TEMPLATES.has(body.template) ? body.template : 'hello_world';
  const language = typeof body.language === 'string' && /^[a-z]{2}(_[A-Z]{2})?$/.test(body.language) ? body.language : 'en';

  if (!PHONE_REGEX.test(phone)) {
    return err('Phone must be in E.164 format, e.g. +919876543210.', 400, 'invalid_phone');
  }

  // 5) Credential gate
  if (!credentialsAvailable(env)) {
    const response = {
      ok: false,
      error: 'WhatsApp channel is not yet connected on this site. Use /contact to reach the team.',
      code: 'provider_not_configured',
      fallback: '/contact',
    };
    return NextResponse.json(response, { status: 503, headers: MUTATION_HEADERS });
  }

  // 6) Real Meta Cloud API call
  const graphBase = (env.META_GRAPH_API_BASE || 'https://graph.facebook.com').replace(/\/$/, '');
  let result;
  try {
    result = await sendMetaTemplate({
      accessToken: env.META_WA_ACCESS_TOKEN,
      phoneNumberId: env.META_WA_PHONE_NUMBER_ID,
      to: phone,
      template,
      language,
      graphBase,
      fetch: fetchImpl,
    });
  } catch (e) {
    const response = { ok: false, error: 'Provider request failed.', code: 'provider_unreachable' };
    setCachedIdempotent(idemKey, { ...response, __status: 502 });
    return NextResponse.json(response, { status: 502, headers: MUTATION_HEADERS });
  }

  if (result.status >= 200 && result.status < 300 && result.body.messages?.[0]?.id) {
    const response = {
      ok: true,
      messageId: result.body.messages[0].id,
      template,
      to: phone.replace(/^\+/, ''),
    };
    setCachedIdempotent(idemKey, { ...response, __status: 200 });
    return NextResponse.json(response, { status: 200, headers: MUTATION_HEADERS });
  }

  // Provider returned an error response
  const providerError = result.body?.error?.message || 'Unknown provider error.';
  const response = {
    ok: false,
    error: providerError,
    code: result.body?.error?.code ? `meta_${result.body.error.code}` : 'meta_error',
    providerStatus: result.status,
  };
  setCachedIdempotent(idemKey, { ...response, __status: 502 });
  return NextResponse.json(response, { status: 502, headers: MUTATION_HEADERS });
}

export function GET() {
  return err('Method not allowed. POST a JSON body with { phone, template? } and an Idempotency-Key header.', 405, 'method_not_allowed');
}