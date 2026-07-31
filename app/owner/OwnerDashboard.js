'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

function authClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? createClient(url, anonKey) : null;
}

const STAGES = ['all', 'new', 'reviewed', 'contacted', 'qualified', 'discovery_booked', 'proposal_sent', 'won', 'lost'];

function formatDue(due_at) {
  if (!due_at) return 'No due date set';
  const date = new Date(due_at);
  return Number.isNaN(date.getTime()) ? 'No due date set' : date.toLocaleDateString();
}

export function OwnerDashboard() {
  const [client] = useState(authClient);
  const [user, setUser] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [stage, setStage] = useState('all');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!client) return;
    client.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, [client]);

  useEffect(() => {
    if (!client || !user) return;
    let query = client.from('inquiries').select('id,business_name,email,lead_stage,next_action,due_at,created_at').order('created_at', { ascending: false }).limit(25);
    if (stage !== 'all') query = query.eq('lead_stage', stage);
    query.then(({ data, error }) => {
      if (error) return setStatus('CRM records are unavailable for this account.');
      setInquiries(data ?? []);
    });
  }, [client, user, stage]);

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
      <h1>Owner CRM</h1>
      {user ? <>
        <p>Authenticated session active. CRM records remain protected by database owner policy.</p>
        <div className="dashboard-links"><a href="/admin">Notification status →</a></div>
        <div role="group" aria-label="Filter by lead stage" className="stage-filter">
          {STAGES.map((value) => <button type="button" key={value} aria-pressed={stage === value} onClick={() => setStage(value)}>{value.replace('_', ' ')}</button>)}
        </div>
        <ul className="record-list" aria-label="Recent inquiries">
          {inquiries.length ? inquiries.map((inquiry) => <li key={inquiry.id}><article>
            <h3>{inquiry.business_name}</h3>
            <dl>
              <div><dt>Email</dt><dd>{inquiry.email}</dd></div>
              <div><dt>Stage</dt><dd>{inquiry.lead_stage}</dd></div>
              <div><dt>Next action</dt><dd>{inquiry.next_action || 'Not set'}</dd></div>
              <div><dt>Due</dt><dd>{formatDue(inquiry.due_at)}</dd></div>
            </dl>
          </article></li>) : <li>No accessible inquiries for this filter yet.</li>}
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
