'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { classifyAuthError } from '../../../lib/owner-auth.mjs';
import { getSupabasePublicKey } from '../../../lib/supabase-public-key.mjs';

function authClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = getSupabasePublicKey({
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  return url && publicKey ? createClient(url, publicKey) : null;
}

function safeMessage(error) {
  const kind = classifyAuthError(error);
  if (kind === 'session_expired') return 'This recovery link has expired. Request a new link from the owner sign-in screen.';
  if (kind === 'configuration_error') return 'Password recovery is temporarily misconfigured.';
  if (kind === 'network_unavailable') return 'Password recovery is temporarily unavailable. Try again shortly.';
  return 'The password could not be updated. Check the fields and try again.';
}

export default function ResetPasswordPage() {
  const [client] = useState(authClient);
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('Checking the recovery session…');

  useEffect(() => {
    if (!client) return setStatus('Password recovery is not connected.');
    client.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) return setStatus('This recovery link is invalid or expired. Request a new link.');
      setSession(data.session);
      setStatus('Choose a new owner password.');
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, next) => {
      if (next) { setSession(next); setStatus('Choose a new owner password.'); }
    });
    return () => listener.subscription.unsubscribe();
  }, [client]);

  async function updatePassword(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    const confirmation = String(form.get('confirmation') || '');
    if (password.length < 10 || password !== confirmation) return setStatus('Use matching passwords of at least 10 characters.');
    const { error } = await client.auth.updateUser({ password });
    if (error) return setStatus(safeMessage(error));
    await client.auth.signOut();
    window.location.assign('/owner?recovery=complete');
  }

  return <main className="shell owner-shell"><section className="owner-card"><span className="eyebrow">Private / password recovery</span><h1>Set a new owner password</h1>{session ? <form className="owner-form" onSubmit={updatePassword}><label>New password<input name="password" type="password" minLength="10" autoComplete="new-password" required /></label><label>Confirm password<input name="confirmation" type="password" minLength="10" autoComplete="new-password" required /></label><button className="button" type="submit">Update password</button></form> : <p role="status">{status}</p>}<p className="notice" role="status">{status}</p><a href="/owner">Return to owner sign-in</a></section></main>;
}
