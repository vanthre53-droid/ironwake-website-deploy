// ponytail: server-only helper to derive the current request origin
// without trusting any client-supplied header. Used by:
//   - app/api/voice/session/route.js (returns the origin so the SDK can
//     confirm it is talking to the right host)
//   - lib/supabase/auth-actions.mjs (auth emailRedirectTo fallback)
//   - any other route that needs the canonical host
//
// Cloudflare Workers expose the real connection host through the
// `host` header on the request; in production we hard-code
// `https://ironwake.dev` as the canonical fallback so a misconfigured
// preview or accidental host header cannot leak a wrong origin into
// Supabase email links, Retell webhook URLs, or Resend reply-to.

const PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev';

const PRODUCTION_HOSTS = new Set(['ironwake.dev', 'www.ironwake.dev']);

export function getServerOrigin(request) {
  if (!request || !request.headers) return PRODUCTION_CANONICAL_ORIGIN;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();
  if (PRODUCTION_HOSTS.has(hostname)) {
    return host.startsWith('localhost') ? PRODUCTION_CANONICAL_ORIGIN : `https://${host}`;
  }
  return PRODUCTION_CANONICAL_ORIGIN;
}

export function canonicalSiteOrigin() {
  return PRODUCTION_CANONICAL_ORIGIN;
}
