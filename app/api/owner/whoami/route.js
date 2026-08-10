// ponytail: server-side authorization check for the /owner dashboard.
// - Accepts the caller's Supabase access token in the Authorization header.
// - Calls supabase.auth.getUser(token) to validate the JWT against Supabase Auth.
// - Returns { authorized: true, email } ONLY if the validated email matches the
//   designated owner email. Otherwise returns 401/403 with no private data.
// - Never reads privileged server credentials. Never signs its own tokens. The
//   access token comes from the browser's existing @supabase/supabase-js
//   session, so refresh is handled by the existing client.

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server.js';
import { getAalFromJwt, parseBearerToken } from '../../../../lib/owner-auth.mjs';
import { getSupabasePublicKey } from '../../../../lib/supabase-public-key.mjs';

export const runtime = 'nodejs';

const OWNER_EMAIL = 'ironwakee@gmail.com';
const PRIVATE_RESPONSE_HEADERS = { 'cache-control': 'private, no-store, max-age=0', vary: 'authorization' };

function privateJson(payload, init = {}) {
  return NextResponse.json(payload, { ...init, headers: { ...PRIVATE_RESPONSE_HEADERS, ...init.headers } });
}

function unauthorized(reason) {
  return privateJson({ authorized: false, reason }, { status: 403 });
}

function methodNotAllowed() {
  return privateJson({ authorized: false, reason: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}

export async function POST(request) {
  const token = parseBearerToken(request.headers.get('authorization'));
  if (!token) return privateJson({ authorized: false, reason: 'No active session.' }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = getSupabasePublicKey({ publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY });
  if (!url || !publicKey) return privateJson({ authorized: false, reason: 'Auth is not connected.' }, { status: 503 });

  const supabase = createClient(url, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return privateJson({ authorized: false, reason: 'Session is not valid.' }, { status: 401 });

  const email = (data.user.email || '').toLowerCase();
  if (email !== OWNER_EMAIL) return unauthorized('This account is not the authorized owner.');

  const aal = getAalFromJwt(token) || 'aal1';
  if (aal !== 'aal2') return privateJson({ authorized: false, mfaRequired: true, aal, reason: 'MFA verification is required before private CRM access.' }, { status: 403 });

  return privateJson({ authorized: true, email, aal: 'aal2' });
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
