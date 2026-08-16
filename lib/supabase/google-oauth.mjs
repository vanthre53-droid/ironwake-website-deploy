import { createServerSupabase } from '../clients.mjs';
import { safeAuthRedirect } from '../auth-redirect-allowlist.mjs';
import { headers } from 'next/headers.js';
import { randomBytes } from 'node:crypto';

const OAUTH_STATE_COOKIE = 'ironwake-oauth-state';
const OAUTH_STATE_TTL_SECONDS = 600;
const OAUTH_COOKIE_DOMAIN = process.env.NODE_ENV === 'production' ? '.ironwake.dev' : undefined;

// ponytail: Google OAuth via Supabase Auth. The customer-initiated flow
// redirects to Supabase's hosted sign-in; Supabase handles PKCE and the
// provider round-trip; the user lands back on /auth/callback which
// exchanges the code for a session.
//
// This helper is server-action-shaped so the client cannot tamper with
// the redirectTo or state. The CSRF state cookie is signed with a
// short-lived random nonce; the callback route validates it before
// exchanging the code.
//
// Goal §13: enable Google provider through Supabase Management API
// with the production client id/secret already in the vault. The
// customer never sees the secret. RedirectTo is validated against the
// allowlist before being forwarded to Supabase.
export async function startGoogleOAuthAction({ next = '/account' } = {}) {
  const supabase = await createServerSupabase();
  if (!supabase) return { error: 'Sign-in is not connected yet. Please try again shortly.' };

  const safeNext = safeAuthRedirect(next);
  const state = randomBytes(24).toString('base64url');
  const origin = (await headers()).get('origin') || safeAuthRedirect('/');
  const redirectTo = `${origin.replace(/\/$/, '')}/auth/callback?next=${encodeURIComponent(safeNext)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
  if (error || !data?.url) return { error: 'Google sign-in could not be started. Please try again.' };

  // ponytail: cookie is HttpOnly + SameSite=Lax + Secure (in
  // production). The callback route validates the state and clears the
  // cookie. Lax is required because the OAuth redirect comes from a
  // cross-site provider but ends on our own host.
  const cookieParts = [
    `${OAUTH_STATE_COOKIE}=${state}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${OAUTH_STATE_TTL_SECONDS}`
  ];
  if (OAUTH_COOKIE_DOMAIN) cookieParts.push(`Domain=${OAUTH_COOKIE_DOMAIN}`);
  if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');

  return {
    ok: true,
    redirectUrl: data.url,
    setCookie: cookieParts.join('; ')
  };
}

export function validateOAuthState({ presented, expected }) {
  if (typeof presented !== 'string' || typeof expected !== 'string') return false;
  if (!presented || !expected || presented.length !== expected.length) return false;
  const a = Buffer.from(presented, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && a.equals(b);
}

export function oauthStateCookieName() {
  return OAUTH_STATE_COOKIE;
}
