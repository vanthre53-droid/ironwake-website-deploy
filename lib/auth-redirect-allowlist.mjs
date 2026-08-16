// ponytail: allowlist for Supabase Auth redirect targets. The customer
// can only return to one of these origins after email confirm, password
// recovery, OAuth callback, or magic link. Used by lib/supabase/auth-actions.mjs
// to validate redirectTo before passing it to Supabase.
//
// Goal §13: prevent open-redirect bypass. Only the canonical production
// origin (ironwake.dev) and an explicit list of local development
// origins are accepted. Anything else fails closed (returns null) and
// the caller falls back to the canonical site root.

const PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev';
const PRODUCTION_WWW_ORIGIN = 'https://www.ironwake.dev';

// ponytail: explicit local-development origins only. Production never
// trusts localhost; the only reason it appears is so the dev server can
// exercise the same flow.
const DEVELOPMENT_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const ALLOWED_AUTH_ORIGINS = new Set([
  PRODUCTION_CANONICAL_ORIGIN,
  PRODUCTION_WWW_ORIGIN,
  ...DEVELOPMENT_ORIGINS
]);

export function canonicalAuthOrigin() {
  return PRODUCTION_CANONICAL_ORIGIN;
}

export function isAllowedAuthOrigin(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return ALLOWED_AUTH_ORIGINS.has(`${url.protocol}//${url.host}`);
  } catch {
    return false;
  }
}

// ponytail: returns the safe absolute URL to redirect to. Validates the
// input path against the allowlist; rejects paths or query strings that
// contain embedded origins (e.g. //evil.example/path), protocol-relative
// URLs, or absolute URLs that point elsewhere. Defaults to the canonical
// production root.
export function safeAuthRedirect(input) {
  if (!input || typeof input !== 'string') return PRODUCTION_CANONICAL_ORIGIN;
  const trimmed = input.trim();
  if (!trimmed) return PRODUCTION_CANONICAL_ORIGIN;

  // Absolute URL form must parse and originate from the allowlist.
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (ALLOWED_AUTH_ORIGINS.has(`${url.protocol}//${url.host}`)) return url.toString();
      return PRODUCTION_CANONICAL_ORIGIN;
    } catch {
      return PRODUCTION_CANONICAL_ORIGIN;
    }
  }

  // Protocol-relative URLs are an open-redirect vector; reject.
  if (trimmed.startsWith('//')) return PRODUCTION_CANONICAL_ORIGIN;

  // Path-only form: must start with a single slash and not contain a scheme.
  if (!trimmed.startsWith('/')) return PRODUCTION_CANONICAL_ORIGIN;
  if (/[\r\n\t]/.test(trimmed)) return PRODUCTION_CANONICAL_ORIGIN;
  return `${PRODUCTION_CANONICAL_ORIGIN}${trimmed}`;
}
