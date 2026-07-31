'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

function authClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? createClient(url, anonKey) : null;
}

function formatTimestamp(value) {
  if (!value) return 'Not set';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not set' : date.toLocaleString();
}

export function AdminDashboard() {
  const [client] = useState(authClient);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!client) return;
    client.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, [client]);

  useEffect(() => {
    if (!client || !user) return;
    client.from('outbox_events').select('id,event_type,status,attempts,available_at,last_error_code,created_at').order('created_at', { ascending: false }).limit(50)
      .then(({ data, error }) => {
        if (error) return setStatus('Notification records are unavailable for this account.');
        setEvents(data ?? []);
      });
  }, [client, user]);

  async function signIn(event) {
    event.preventDefault();
    if (!client) return setStatus('Owner login is not connected yet.');
    const form = new FormData(event.currentTarget);
    const { error } = await client.auth.signInWithPassword({ email: form.get('email'), password: form.get('password') });
    setStatus(error ? 'Sign-in failed. Check your credentials and try again.' : 'Signed in.');
  }

  async function signOut() {
    await client?.auth.signOut();
    setStatus('Signed out.');
  }

  return <main className="shell owner-shell">
    <section className="owner-card">
      <span className="eyebrow">Private / owner only</span>
      <h1>Notification status</h1>
      {user ? <>
        <p>Outbox events are queued, delivered, or dead-lettered here. This is a status view; it does not resend or edit an event.</p>
        <div className="dashboard-links"><a href="/owner">Owner CRM →</a></div>
        <ul className="record-list" aria-label="Outbox events">
          {events.length ? events.map((event) => <li key={event.id}><article>
            <h3>{event.event_type}</h3>
            <dl>
              <div><dt>Status</dt><dd><span className="status-pill">{event.status}</span></dd></div>
              <div><dt>Attempts</dt><dd>{event.attempts}</dd></div>
              <div><dt>Available at</dt><dd>{formatTimestamp(event.available_at)}</dd></div>
              <div><dt>Last error</dt><dd>{event.last_error_code || 'None'}</dd></div>
              <div><dt>Created</dt><dd>{formatTimestamp(event.created_at)}</dd></div>
            </dl>
          </article></li>) : <li>No accessible outbox events yet.</li>}
        </ul>
        <button className="button" onClick={signOut}>Sign out</button>
      </> : <form className="owner-form" onSubmit={signIn}>
        <p>Use the owner account. This screen never accepts or exposes service credentials.</p>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="button" type="submit">Sign in</button>
      </form>}
      {status && <p className="notice" role="status">{status}</p>}
    </section>
  </main>;
}
