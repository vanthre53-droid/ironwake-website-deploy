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
import { parseBearerToken } from '../../../../lib/owner-auth.mjs';

export const runtime = 'nodejs';

const OWNER_EMAIL = 'ironwakee@gmail.com';

function unauthorized(reason) {
  return NextResponse.json({ authorized: false, reason }, { status: 403 });
}

export async function POST(request) {
  const token = parseBearerToken(request.headers.get('authorization'));
  if (!token) return NextResponse.json({ authorized: false, reason: 'No active session.' }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.json({ authorized: false, reason: 'Auth is not connected.' }, { status: 503 });

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return NextResponse.json({ authorized: false, reason: 'Session is not valid.' }, { status: 401 });

  const email = (data.user.email || '').toLowerCase();
  if (email !== OWNER_EMAIL) return unauthorized('This account is not the authorized owner.');

  return NextResponse.json({ authorized: true, email });
}
