import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server.js';
import { readNotificationConfig } from '../../../../lib/notifications/config.mjs';

export const runtime = 'nodejs';
const OWNER_EMAIL = 'ironwakee@gmail.com';

export async function POST(request) {
  const match = (request.headers.get('authorization') || '').match(/^Bearer\s+(.+)$/i);
  if (!match) return NextResponse.json({ authorized: false, reason: 'No active session.' }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.json({ authorized: false, reason: 'Auth is not connected.' }, { status: 503 });
  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: `Bearer ${match[1].trim()}` } } });
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return NextResponse.json({ authorized: false, reason: 'Session is not valid.' }, { status: 401 });
  if ((data.user.email || '').toLowerCase() !== OWNER_EMAIL) return NextResponse.json({ authorized: false, reason: 'This account is not the authorized owner.' }, { status: 403 });
  const config = readNotificationConfig();
  return NextResponse.json({ authorized: true, configured: config.configured, safeErrorCode: config.configured ? null : config.safeErrorCode });
}
