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

export const config = {
  matcher: [
    // Run on every route except Next internals, static files, public files, and the public API
    // surface — those don't need SSR cookie refresh.
    '/((?!_next/static|_next/image|favicon.ico|og-default.svg|robots|sitemap|api/chat|api/audit|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'
  ],
};

export async function middleware(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let response = NextResponse.next({ request: { headers: request.headers } });
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
