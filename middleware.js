// ponytail: Next.js middleware runs on every matched request BEFORE the route
// handler executes. This is the canonical @supabase/ssr refresh hook: it
// reads the existing auth cookies, validates the session, and rewrites
// refreshed cookies onto the response so SSR never sees a stale user.
//
// The matcher skips static assets, _next internals, and the API chat/audit
// routes (those handle auth inline). Owner routes get the same refresh
// behaviour, but their authorization decision lives in /api/owner/whoami
// where the AAL2 + email allowlist is enforced server-side.

import { NextResponse } from 'next/server.js';
import { createServerClient } from '@supabase/ssr';

const NOINDEX_PATHS = ['/account', '/login', '/signup', '/forgot-password', '/update-password', '/owner', '/owner/login'];

// ponytail: apex host. www and any other alias host must 308 to this host preserving
// path/query. Goal §9 requires permanent apex canonicalization.
const APEX_HOST = 'ironwake.dev';
const APEX_ORIGIN = `https://${APEX_HOST}`;

export const config = {
  matcher: [
    // Run on every route except Next internals, static files, public files, and the public API
    // surface — those don't need SSR cookie refresh.
    '/((?!_next/static|_next/image|favicon.ico|og-default.svg|robots|sitemap|api/chat|api/audit|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'
  ],
};

// ponytail: per-request correlation ID. Every inbound request gets a UUID; we set it on the
// request headers (so route handlers can read x-request-id), the response headers (so the
// browser/curl can see it and operators can grep logs), and the Sentry scope tag. This is the
// canonical hook for distributed tracing across audit/booking/chat/auth/Retell/WhatsApp/CRM.
function cryptoRandomUUID() {
  // Node 19+ exposes crypto on globalThis; Cloudflare workerd does too.
  // We do NOT use randomUUID() alone because some test stubs override it.
  // eslint-disable-next-line no-undef
  const c = (typeof globalThis !== 'undefined' && globalThis.crypto) || null;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  // Fallback: 16 random bytes hex-encoded. Sufficient entropy for correlation.
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === 'function') {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

export function canonicalHostRedirect(request) {
  // ponytail: one apex. If the request comes in on www.ironwake.dev (or any
  // configured alias), return a permanent 308 to https://ironwake.dev preserving
  // the original path, query, and fragment via a clean location header.
  const host = request.nextUrl.hostname?.toLowerCase();
  if (!host || host === APEX_HOST) return null;
  // Localhost is the dev/CI bypass host — never 308 it to the apex so
  // Lighthouse audits and local previews can exercise the build directly.
  if (host === 'localhost' || host === '127.0.0.1') return null;
  const dest = new URL(request.nextUrl.pathname, APEX_ORIGIN);
  dest.search = request.nextUrl.search;
  return NextResponse.redirect(dest, 308);
}

export async function middleware(request) {
  const hostRedirect = canonicalHostRedirect(request);
  if (hostRedirect) return hostRedirect;

  // ponytail: stamp every request with a correlation ID. Prefer the inbound
  // x-request-id when present (so a retry preserves the trace), else mint a new one.
  const inboundId = request.headers.get('x-request-id');
  const requestId = inboundId && /^[A-Za-z0-9_\-]{8,128}$/.test(inboundId)
    ? inboundId
    : cryptoRandomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  // ponytail: surface the correlation ID on the response so callers can grep their logs.
  response.headers.set('x-request-id', requestId);
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        for (const { name, value } of toSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request: { headers: request.headers } });
        for (const { name, value, options } of toSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: do not put any code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  try {
    await supabase.auth.getUser();
  } catch {
    // network errors are non-fatal for the middleware pass.
  }

  // noindex headers for auth + owner surfaces.
  const pathname = request.nextUrl.pathname;
  for (const prefix of NOINDEX_PATHS) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      break;
    }
  }

  return response;
}
