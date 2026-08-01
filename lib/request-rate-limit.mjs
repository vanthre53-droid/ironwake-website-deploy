const buckets = new Map();

export function allowRequest(key, { now = Date.now(), limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const active = (buckets.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  if (active.length >= limit) return false;
  active.push(now);
  buckets.set(key, active);
  return true;
}

export function requestIdentity(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}
