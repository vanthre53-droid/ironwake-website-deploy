import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server.js';
import { readNotificationConfig } from '../../../../lib/notifications/config.mjs';
import { parseBearerToken } from '../../../../lib/owner-auth.mjs';

export const runtime = 'nodejs';
const OWNER_EMAIL = 'ironwakee@gmail.com';
const PRIVATE_RESPONSE_HEADERS = { 'cache-control': 'private, no-store, max-age=0', vary: 'authorization' };

function privateJson(payload, init = {}) {
  return NextResponse.json(payload, { ...init, headers: { ...PRIVATE_RESPONSE_HEADERS, ...init.headers } });
}

function methodNotAllowed() {
  return privateJson({ authorized: false, reason: 'Method not allowed.' }, { status: 405, headers: { allow: 'POST' } });
}

export async function POST(request) {
  const token = parseBearerToken(request.headers.get('authorization'));
  if (!token) return privateJson({ authorized: false, reason: 'No active session.' }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return privateJson({ authorized: false, reason: 'Auth is not connected.' }, { status: 503 });
  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return privateJson({ authorized: false, reason: 'Session is not valid.' }, { status: 401 });
  if ((data.user.email || '').toLowerCase() !== OWNER_EMAIL) return privateJson({ authorized: false, reason: 'This account is not the authorized owner.' }, { status: 403 });
  const config = readNotificationConfig();
  return privateJson({ authorized: true, configured: config.configured, safeErrorCode: config.configured ? null : config.safeErrorCode });
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
