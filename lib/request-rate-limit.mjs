// ponytail: in-process rate limiter for the anonymous public endpoints
// (/api/chat, /api/audit, etc). The bucket store itself is intentionally
// simple — durable per-identity limits live in Supabase via
// consume_request_rate_limit RPC; this helper only blocks hot loops.
//
// ponytail: identity source. NEVER trust client-supplied forwarding headers
// (x-forwarded-for, x-real-ip, cf-connecting-ip, etc) — they are
// attacker-controlled and would let a single real client mint a fresh
// bucket per request by rotating the header value. IronWake deploys on
// Netlify, which populates `x-nf-client-connection-ip` (and
// `client-ip` on Edge Functions) from the actual TCP connection. We use
// only that trusted platform-populated header. When the platform
// supplies no client IP, we return the sentinel "unknown" so all such
// requests share one bucket rather than each becoming its own.

const TRUSTED_CLIENT_IP_HEADERS = Object.freeze([
  'x-nf-client-connection-ip',
  'client-ip'
]);

export function requestIdentity(request) {
  for (const headerName of TRUSTED_CLIENT_IP_HEADERS) {
    const value = request.headers.get(headerName)?.trim();
    if (value) return value;
  }
  return 'unknown';
}

const buckets = new Map();

export function allowRequest(key, { now = Date.now(), limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const active = (buckets.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  if (active.length >= limit) return false;
  active.push(now);
  buckets.set(key, active);
  return true;
}