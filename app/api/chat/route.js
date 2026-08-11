import { NextResponse } from 'next/server.js';
import { chatCompletion } from '../../../lib/ai-chat.mjs';
import { requestIdentity } from '../../../lib/request-rate-limit.mjs';
import { createHash } from 'node:crypto';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 8_192;
const MAX_TOTAL_MESSAGES = 20;
const MAX_CONTENT_CHARS = 1000;
const MUTATION_RESPONSE_HEADERS = { 'cache-control': 'no-store' };
const RATE_LIMIT = { limit: 20, windowSeconds: 600 };

function response(body, status) {
  return NextResponse.json(body, { status, headers: MUTATION_RESPONSE_HEADERS });
}

function methodNotAllowed() {
  return NextResponse.json(
    { error: 'Method not allowed.' },
    { status: 405, headers: { ...MUTATION_RESPONSE_HEADERS, allow: 'POST' } }
  );
}

function normaliseMessages(input) {
  if (!Array.isArray(input)) return null;
  const trimmed = input.slice(-MAX_TOTAL_MESSAGES);
  const out = [];
  for (const entry of trimmed) {
    if (!entry || typeof entry !== 'object') return null;
    if (entry.role !== 'user' && entry.role !== 'assistant') return null;
    if (typeof entry.content !== 'string') return null;
    const content = entry.content.slice(0, MAX_CONTENT_CHARS);
    if (!content.trim()) return null;
    out.push({ role: entry.role, content });
  }
  return out.length > 0 ? out : null;
}

// ponytail: in-memory rate limiter so an unauthenticated public chat cannot
// drain the MiniMax budget. Per-IP + per-identity hash. Restart-safe for
// serverless cold-starts; survives only within the warm instance lifetime.
const buckets = new Map();
function allowChat(identity) {
  const now = Date.now();
  const windowMs = RATE_LIMIT.windowSeconds * 1000;
  const active = (buckets.get(identity) || []).filter((t) => now - t < windowMs);
  if (active.length >= RATE_LIMIT.limit) {
    buckets.set(identity, active);
    return false;
  }
  active.push(now);
  buckets.set(identity, active);
  return true;
}

export async function POST(request, { env = process.env, fetchImpl = fetch } = {}) {
  const mediaType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (mediaType !== 'application/json') {
    return response({ error: 'Send a JSON request.' }, 415);
  }
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return response({ error: 'Request is too large.' }, 413);
  }
  let body;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return response({ error: 'Request is too large.' }, 413);
    }
    body = JSON.parse(raw);
  } catch {
    return response({ error: 'Send a valid JSON request.' }, 400);
  }
  const messages = normaliseMessages(body?.messages);
  if (!messages) {
    return response({ error: 'Provide an array of user/assistant messages.' }, 400);
  }

  const identity = requestIdentity(request);
  const rateKey = createHash('sha256').update(`chat:${identity}`).digest('hex').slice(0, 16);
  if (!allowChat(rateKey)) {
    return response({ error: 'You are sending messages too quickly. Please wait a moment.' }, 429);
  }

  const result = await chatCompletion(messages, { apiKey: env.AI_API_KEY, model: env.AI_MODEL, baseUrl: env.AI_API_BASE, fetchImpl });

  // ponytail: do NOT echo raw provider/model identifiers to anonymous
  // visitors. Surface only the user-facing reply plus a safe status hint so
  // the UI can degrade gracefully.
  const safeStatus = result.status === 'complete'
    ? 'complete'
    : (result.status === 'unconfigured' ? 'unconfigured'
       : (result.status === 'out_of_scope' ? 'out_of_scope' : 'provider_error'));
  const httpStatus = result.status === 'complete' ? 200
    : (result.status === 'out_of_scope' ? 200
       : (result.status === 'unconfigured' ? 503 : 503));

  return response({
    status: safeStatus,
    reply: result.reply,
    needs_human: result.needs_human,
    handoff: result.handoff,
    priority: result.priority,
    category: result.category,
    confidence: result.confidence
  }, httpStatus);
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
