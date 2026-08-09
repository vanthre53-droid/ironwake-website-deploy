'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  isRetryableNotification,
  latestNotificationAttempt,
  notificationStatusDescription
} from './notification-operations.mjs';

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

const NOTIFICATION_SELECT = [
  'id', 'inquiry_id', 'event_type', 'target_type', 'status', 'attempts',
  'retry_cycle', 'provider', 'provider_message_id', 'available_at',
  'last_attempt_at', 'accepted_at', 'delivered_at', 'dead_lettered_at',
  'safe_error_code', 'last_error_code', 'created_at',
  'inquiry:inquiries!outbox_events_inquiry_id_fkey(business_name,source,created_at)',
  'notification_attempts(id,retry_cycle,attempt_number,provider,status,provider_message_id,safe_error_code,retryable,started_at,finished_at)'
].join(',');

export function AdminDashboard() {
  const [client] = useState(authClient);
  const [session, setSession] = useState(null);
  const [authorization, setAuthorization] = useState({ checked: false, allowed: false, reason: '' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!client) return;
    client.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = client.auth.onAuthStateChange((_event, next) => setSession(next ?? null));
    return () => listener.subscription.unsubscribe();
  }, [client]);

  useEffect(() => {
    let cancelled = false;
    async function checkAuthorization() {
      setAuthorization({ checked: false, allowed: false, reason: '' });
      setEvents([]);
      if (!session?.access_token) {
        if (!cancelled) setAuthorization({ checked: true, allowed: false, reason: 'Not signed in.' });
        return;
      }
      try {
        const response = await fetch('/api/owner/whoami', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
          body: '{}'
        });
        const body = await response.json().catch(() => ({}));
        if (cancelled) return;
        setAuthorization(response.ok && body.authorized
          ? { checked: true, allowed: true, reason: '' }
          : { checked: true, allowed: false, reason: body.reason || 'This account is not the authorized owner.' });
      } catch {
        if (!cancelled) setAuthorization({ checked: true, allowed: false, reason: 'Authorization check failed.' });
      }
    }
    checkAuthorization();
    return () => { cancelled = true; };
  }, [session]);

  useEffect(() => {
    if (!client || !authorization.allowed) {
      setEvents([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    client.from('outbox_events').select(NOTIFICATION_SELECT).order('created_at', { ascending: false }).limit(50)
      .then(({ data, error }) => {
        if (cancelled) return;
        setLoading(false);
        if (error) {
          setEvents([]);
          setStatus('Notification records are unavailable for this account.');
          return;
        }
        setEvents(data ?? []);
      });
    return () => { cancelled = true; };
  }, [client, authorization.allowed, refreshKey]);

  async function signIn(event) {
    event.preventDefault();
    if (!client) return setStatus('Owner login is not connected yet.');
    const form = new FormData(event.currentTarget);
    const { error } = await client.auth.signInWithPassword({ email: form.get('email'), password: form.get('password') });
    setStatus(error ? 'Sign-in failed. Check your credentials and try again.' : 'Signed in. Verifying owner access.');
  }

  async function signOut() {
    await client?.auth.signOut();
    setAuthorization({ checked: true, allowed: false, reason: 'Not signed in.' });
    setEvents([]);
    setStatus('Signed out.');
  }

  async function retryNotification(event) {
    if (!client || !authorization.allowed || !isRetryableNotification(event)) {
      setStatus('This notification is not eligible for owner retry.');
      return;
    }
    setRetryingId(event.id);
    const { error } = await client.rpc('owner_retry_notification', { p_event_id: event.id });
    setRetryingId(null);
    if (error) {
      setStatus('Notification retry was not accepted. Refresh and check its current state.');
      return;
    }
    setStatus('Notification returned to the durable queue. This does not mean it was sent or delivered.');
    setRefreshKey((value) => value + 1);
  }

  return <main className="shell owner-shell">
    <section className="owner-card operations-card">
      <span className="eyebrow">Private / authorized owner only</span>
      <h1>Notification operations</h1>
      {!session ? <>
        <p>This screen is private. Only the designated owner account can read or retry notification records.</p>
        <form className="owner-form" onSubmit={signIn}>
          <p>Use the owner account. This screen never accepts or exposes service credentials.</p>
          {!client && <p className="notice" role="status">Owner login is not connected on this preview.</p>}
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="button" type="submit" disabled={!client}>Sign in</button>
        </form>
      </> : !authorization.checked ? <>
        <p role="status">Verifying the designated owner session…</p>
        <button className="button" onClick={signOut}>Sign out</button>
      </> : !authorization.allowed ? <>
        <p>This account is not authorized to view notification operations.</p>
        <p className="notice" role="status">{authorization.reason || 'Sign in with the designated owner email to continue.'}</p>
        <button className="button" onClick={signOut}>Sign out</button>
      </> : <>
        <p>Saved lead, queue, attempt, provider-acceptance, delivery, failure, and replay state are shown separately. Provider acceptance is not delivery.</p>
        <div className="dashboard-links"><a href="/owner">Owner CRM →</a></div>
        {loading ? <p role="status">Loading notification records…</p> : <ul className="record-list notification-records" aria-label="Notification operations">
          {events.length ? events.map((event) => {
            const attempt = latestNotificationAttempt(event.notification_attempts);
            const safeError = event.safe_error_code || event.last_error_code || attempt?.safe_error_code || 'None';
            const providerMessageId = event.provider_message_id || attempt?.provider_message_id || 'Not assigned';
            return <li key={event.id}><article>
              <header className="notification-record-header">
                <div><span className="eyebrow">{event.target_type} notification</span><h3>{event.event_type}</h3></div>
                <span className="status-pill">{event.status}</span>
              </header>
              <p>{notificationStatusDescription(event.status)}</p>
              <dl>
                <div><dt>Saved lead</dt><dd>{event.inquiry_id ? 'Persisted inquiry' : 'Unknown'}</dd></div>
                <div><dt>Business</dt><dd>{event.inquiry?.business_name || 'Not available'}</dd></div>
                <div><dt>Source</dt><dd>{event.inquiry?.source || 'Not available'}</dd></div>
                <div><dt>Inquiry received</dt><dd>{formatTimestamp(event.inquiry?.created_at)}</dd></div>
                <div><dt>Target / event</dt><dd>{event.target_type} / {event.event_type}</dd></div>
                <div><dt>Attempts / retry cycle</dt><dd>{event.attempts} / {event.retry_cycle}</dd></div>
                <div><dt>Latest attempt</dt><dd>{attempt ? `#${attempt.attempt_number} ${attempt.status}` : 'No attempt yet'}</dd></div>
                <div><dt>Attempt time</dt><dd>{formatTimestamp(attempt?.finished_at || attempt?.started_at || event.last_attempt_at)}</dd></div>
                <div><dt>Provider message ID</dt><dd className="break-value">{providerMessageId}</dd></div>
                <div><dt>Provider accepted</dt><dd>{formatTimestamp(event.accepted_at)}</dd></div>
                <div><dt>Delivered callback</dt><dd>{formatTimestamp(event.delivered_at)}</dd></div>
                <div><dt>Safe error</dt><dd>{safeError}</dd></div>
                <div><dt>Next available</dt><dd>{formatTimestamp(event.available_at)}</dd></div>
                <div><dt>Event created</dt><dd>{formatTimestamp(event.created_at)}</dd></div>
              </dl>
              {isRetryableNotification(event) && <button type="button" className="button secondary" disabled={retryingId === event.id} onClick={() => retryNotification(event)}>
                {retryingId === event.id ? 'Returning to queue…' : 'Retry notification'}
              </button>}
            </article></li>;
          }) : <li>No accessible notification records yet.</li>}
        </ul>}
        <button className="button" onClick={signOut}>Sign out</button>
      </>}
      {status && <p className="notice" role="status">{status}</p>}
    </section>
  </main>;
}
