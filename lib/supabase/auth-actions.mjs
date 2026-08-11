// ponytail: server actions for customer auth. All Supabase calls go through
// @supabase/ssr's createServerClient so the response sets refreshed cookies
// on success and clears them on sign-out. Pages import these and pass plain
// form data; no Supabase client leaks to the browser through them.

'use server';

import { revalidatePath } from 'next/cache.js';
import { redirect } from 'next/navigation.js';
import { headers } from 'next/headers.js';
import { createServerSupabase, createServiceSupabase } from './clients.mjs';

function siteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return '';
}

function emailRedirect(path) {
  const origin = siteOrigin();
  if (!origin) return path;
  return `${origin}${path}`;
}

function passwordOk(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 200;
}

function displayNameOk(name) {
  return typeof name === 'string' && name.trim().length >= 1 && name.trim().length <= 80;
}

function emailOk(value) {
  return typeof value === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) && value.length <= 254;
}

export async function signUpAction(prevState, formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm') || '');
  const displayName = String(formData.get('display_name') || '').trim();
  const terms = formData.get('terms');

  if (!emailOk(email)) return { error: 'Enter a valid email address.' };
  if (!passwordOk(password)) return { error: 'Password must be at least 8 characters.' };
  if (password !== confirm) return { error: 'Passwords do not match.' };
  if (!displayNameOk(displayName)) return { error: 'Display name must be 1–80 characters.' };
  if (!terms) return { error: 'You must accept the privacy and terms to continue.' };

  const supabase = await createServerSupabase();
  if (!supabase) return { error: 'Sign-up is not connected yet. Please try again shortly.' };

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: emailRedirect('/auth/confirm'),
    },
  });
  if (error) {
    const code = String(error.code || '').toLowerCase();
    if (code.includes('email_address_invalid') || code.includes('invalid_email')) return { error: 'Enter a valid email address.' };
    if (code.includes('weak_password') || code.includes('password')) return { error: 'Choose a stronger password.' };
    if (code.includes('email_exists') || code.includes('user_already_exists')) return { error: 'An account with that email already exists. Sign in instead.' };
    return { error: 'Sign-up could not be completed. Please try again.' };
  }

  // ponytail: if email confirmation is disabled (data.session is set) we land
  // the user straight into /account. Otherwise we surface "check your inbox".
  if (data?.session) {
    revalidatePath('/', 'layout');
    redirect('/account');
  }
  return { ok: 'Check your inbox to confirm your account. The link is valid for a short window.' };
}

export async function signInAction(prevState, formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!emailOk(email)) return { error: 'Enter a valid email address.' };
  if (!password) return { error: 'Enter your password.' };

  const supabase = await createServerSupabase();
  if (!supabase) return { error: 'Sign-in is not connected yet. Please try again shortly.' };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const code = String(error.code || '').toLowerCase();
    if (code.includes('invalid_credentials') || code.includes('invalid_login')) return { error: 'Email or password is incorrect.' };
    if (code.includes('email_not_confirmed')) return { error: 'Confirm your email first — check your inbox for the confirmation link.' };
    if (code.includes('rate_limited') || code.includes('too_many')) return { error: 'Too many attempts. Wait a minute and try again.' };
    return { error: 'Sign-in could not be completed. Please try again.' };
  }
  revalidatePath('/', 'layout');
  redirect('/account');
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  if (supabase) await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function forgotPasswordAction(prevState, formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!emailOk(email)) return { error: 'Enter a valid email address.' };
  const supabase = await createServerSupabase();
  if (!supabase) return { error: 'Password recovery is not connected yet. Please try again shortly.' };
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: emailRedirect('/update-password') });
  if (error) return { error: 'Password recovery could not be sent. Please try again.' };
  return { ok: 'If that email is registered, a recovery link has been sent.' };
}

export async function updatePasswordAction(prevState, formData) {
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm') || '');
  if (!passwordOk(password)) return { error: 'Password must be at least 8 characters.' };
  if (password !== confirm) return { error: 'Passwords do not match.' };
  const supabase = await createServerSupabase();
  if (!supabase) return { error: 'Password update is not connected yet. Please try again shortly.' };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: 'Password could not be updated. The recovery link may have expired — request a new one.' };
  revalidatePath('/', 'layout');
  redirect('/account?updated=1');
}

// ponytail: server action used by /account to update the display name.
// Validates auth server-side, then calls the RLS-guarded upsert_own_profile RPC.
export async function updateProfileAction(prevState, formData) {
  const displayName = String(formData.get('display_name') || '').trim();
  if (!displayNameOk(displayName)) return { error: 'Display name must be 1–80 characters.' };
  const supabase = await createServerSupabase();
  if (!supabase) return { error: 'Profile update is not connected yet.' };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sign in again to update your profile.' };
  const { error } = await supabase.rpc('upsert_own_profile', { p_display_name: displayName });
  if (error) return { error: 'Profile could not be saved. Please try again.' };
  revalidatePath('/account');
  return { ok: 'Profile updated.' };
}

// ponytail: server action used by /chat to load the current user's chat
// sessions. Returns [] for anonymous visitors; the page treats the result as
// authoritative because the request reads cookies + RLS via the SSR client.
export async function listChatSessionsAction() {
  const supabase = await createServerSupabase();
  if (!supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id,title,created_at,updated_at')
    .order('updated_at', { ascending: false })
    .limit(50);
  if (error) return [];
  return data || [];
}

export async function loadChatSessionAction(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') return null;
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id,title,created_at,updated_at,messages:chat_messages(id,role,content,created_at)')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function startChatSessionAction() {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const title = `Conversation on ${new Date().toISOString().slice(0, 10)}`;
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: user.id, title })
    .select('id,title,created_at,updated_at')
    .single();
  if (error || !data) return null;
  return data;
}

export async function appendChatMessageAction(sessionId, role, content) {
  if (!sessionId || typeof sessionId !== 'string') return false;
  if (role !== 'user' && role !== 'assistant') return false;
  if (typeof content !== 'string' || !content.trim()) return false;
  const supabase = await createServerSupabase();
  if (!supabase) return false;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from('chat_messages').insert({
    session_id: sessionId,
    user_id: user.id,
    role,
    content: content.slice(0, 4000),
  });
  if (error) return false;
  await supabase.from('chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', sessionId).eq('user_id', user.id);
  return true;
}

export async function listOwnInquiriesAction() {
  const supabase = await createServerSupabase();
  if (!supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('inquiries')
    .select('id,business_name,email,leak_description,source,lead_stage,booking_status,status,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return [];
  return data || [];
}

// ponytail: associates an existing inquiry with the authenticated user. Used
// when a customer submits the audit form while signed in. The customer's own
// RLS policy (inquiry_select_own) only lets them see the row if they can also
// write it; we update via the service-role client because RLS UPDATE on
// inquiries is owner-only today.
export async function linkInquiryToUserAction(inquiryId) {
  if (!inquiryId || typeof inquiryId !== 'string') return false;
  const supabase = await createServerSupabase();
  if (!supabase) return false;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const service = createServiceSupabase();
  if (!service) return false;
  const { error } = await service.from('inquiries').update({ user_id: user.id }).eq('id', inquiryId);
  return !error;
}
