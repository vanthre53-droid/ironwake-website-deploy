// ponytail: in-process rate limiter for the anonymous public endpoints
// (/api/chat, /api/audit, etc). The bucket store itself is intentionally
// simple — durable per-identity limits live in Supabase via
// consume_request_rate_limit RPC; this helper only blocks hot loops.
//
// ponytail: identity source. NEVER trust client-supplied forwarding headers
// (x-forwarded-for, x-real-ip, etc) — they are attacker-controlled and would
// let a single real client mint a fresh bucket per request by rotating the
// header value. IronWake deploys on Cloudflare Workers, which populates
// `cf-connecting-ip` from the actual TCP connection. We trust ONLY that
// platform-populated header. When the platform supplies no client IP (e.g.
// local dev, malformed request), we return the sentinel "unknown" so all
// such requests share one bucket rather than each becoming its own.
//
// ponytail: tests can override the trusted header name via
// request-rate-limit.mjs#trustedClientIpHeader, but production MUST keep
// cf-connecting-ip as the single source of truth.

const TRUSTED_CLIENT_IP_HEADER = 'cf-connecting-ip';

export function trustedClientIpHeader() {
  return TRUSTED_CLIENT_IP_HEADER;
}

export function requestIdentity(request) {
  const value = request.headers?.get?.(TRUSTED_CLIENT_IP_HEADER)?.trim();
  return value || 'unknown';
}

const buckets = new Map();

export function allowRequest(key, { now = Date.now(), limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const active = (buckets.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  if (active.length >= limit) return false;
  active.push(now);
  buckets.set(key, active);
  return true;
}
