'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [selectedId, setSelectedId] = useState(null);
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

  const visibleInquiries = useMemo(() => inquiries.filter((inquiry) => `${inquiry.business_name} ${inquiry.email}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'oldest' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at)), [inquiries, query, sort]);
  const selected = visibleInquiries.find(({ id }) => id === selectedId) || visibleInquiries[0];

  function exportVisible() {
    if (!visibleInquiries.length) return setStatus('There are no visible inquiries to export.');
    const rows = [['Business', 'Email', 'Stage', 'Next action', 'Due'], ...visibleInquiries.map((item) => [item.business_name, item.email, item.lead_stage, item.next_action || '', item.due_at || ''])];
    const blob = new Blob([rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'ironwake-inquiries.csv'; link.click(); URL.revokeObjectURL(url); setStatus(`Exported ${visibleInquiries.length} visible inquiries.`);
  }

  return <main className="shell owner-shell">
    <section className="owner-card">
      <span className="eyebrow">Private / owner only</span>
      <h1>Owner CRM</h1>
      {user ? <>
        <p>Authenticated session active. CRM records remain protected by database owner policy.</p>
        <div className="dashboard-links"><a href="/admin">Notification status →</a></div>
        <div className="crm-toolbar"><label>Search inquiries<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label><button type="button" className="button secondary" onClick={exportVisible} disabled={!visibleInquiries.length}>Export visible</button></div>
        <div role="group" aria-label="Filter by lead stage" className="stage-filter">
          {STAGES.map((value) => <button type="button" key={value} aria-pressed={stage === value} onClick={() => setStage(value)}>{value.replace('_', ' ')}</button>)}
        </div>
        <div className="crm-workspace"><ul className="record-list" aria-label="Recent inquiries">
          {visibleInquiries.length ? visibleInquiries.map((inquiry) => <li key={inquiry.id}><button type="button" className={`record-card${selected?.id === inquiry.id ? ' selected' : ''}`} onClick={() => setSelectedId(inquiry.id)}>
            <h3>{inquiry.business_name}</h3>
            <dl>
              <div><dt>Email</dt><dd>{inquiry.email}</dd></div>
              <div><dt>Stage</dt><dd>{inquiry.lead_stage}</dd></div>
              <div><dt>Next action</dt><dd>{inquiry.next_action || 'Not set'}</dd></div>
              <div><dt>Due</dt><dd>{formatDue(inquiry.due_at)}</dd></div>
            </dl>
          </button></li>) : <li>No accessible inquiries for this filter yet.</li>}
        </ul><aside className="crm-detail" aria-live="polite"><span className="eyebrow">Inquiry detail</span>{selected ? <><h2>{selected.business_name}</h2><p>{selected.email}</p><dl><div><dt>Lead stage</dt><dd>{selected.lead_stage}</dd></div><div><dt>Next action</dt><dd>{selected.next_action || 'Not set'}</dd></div><div><dt>Due date</dt><dd>{formatDue(selected.due_at)}</dd></div><div><dt>Booking request</dt><dd>Not connected</dd></div></dl><div className="crm-detail-note"><strong>Tasks, notes, timeline, retry/dead-letter, and retention actions</strong><p>These private records are available only when the authorized owner schema and account session expose them. This screen never seeds or invents CRM activity.</p></div></> : <p>Select an inquiry to view its available details. Empty lists remain empty until a real authorized record exists.</p>}</aside></div>
        <button className="button" onClick={signOut}>Sign out</button>
      </> : <form className="owner-form" onSubmit={signIn}>
        <p>Use the owner account. This screen never accepts or exposes service credentials.</p>
        {!client && <p className="notice" role="status">Owner login is not connected on this preview.</p>}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="button" type="submit" disabled={!client}>Sign in</button>
      </form>}
      {status && <p className="notice" role="status">{status}</p>}
    </section>
  </main>;
}
