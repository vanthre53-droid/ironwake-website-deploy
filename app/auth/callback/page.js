// ponytail: Supabase Auth redirects customers here after Google sign-in
// (and password recovery, magic links, etc.). The SSR client exchanges
// the `code` query parameter for a session cookie, then routes the user
// to /account. On failure, we land at /login with a clear reason.
//
// We never trust the `next` parameter directly — it is validated through
// safeAuthRedirect (see lib/auth-redirect-allowlist.mjs) so an attacker
// cannot use this endpoint as an open redirect.

import { redirect } from 'next/navigation.js';
import { createServerSupabase } from '../../../lib/supabase/clients.mjs';
import { safeAuthRedirect } from '../../../lib/auth-redirect-allowlist.mjs';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Signing you in…',
  robots: { index: false, follow: false },
};

const FALLBACK_NEXT = '/account';

export default async function AuthCallbackPage({ searchParams }) {
  const next = safeAuthRedirect(String(searchParams?.next || FALLBACK_NEXT)) || FALLBACK_NEXT;
  const code = typeof searchParams?.code === 'string' ? searchParams.code.trim() : '';
  const reasonParam = typeof searchParams?.error_description === 'string'
    ? searchParams.error_description
    : typeof searchParams?.error === 'string'
      ? searchParams.error
      : '';

  if (!code) {
    const reason = reasonParam ? `&reason=${encodeURIComponent(reasonParam)}` : '';
    redirect(`/login?error=oauth_missing_code${reason}`);
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    redirect('/login?error=auth_unavailable');
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const code_ = String(error.code || '').toLowerCase();
    const mapped =
      code_.includes('expired') || code_.includes('otp_expired')
        ? 'oauth_code_expired'
        : code_.includes('invalid') || code_.includes('bad_code')
          ? 'oauth_code_invalid'
          : 'oauth_exchange_failed';
    redirect(`/login?error=${mapped}`);
  }

  // The exchange succeeded — cookies are set by createServerSupabase.
  // Validate the destination one more time and route the user onward.
  const dest = next.startsWith('/') ? next : FALLBACK_NEXT;
  redirect(dest);
}
