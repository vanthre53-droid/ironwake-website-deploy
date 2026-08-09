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

function taskDueStatus(dueAt) {
  if (!dueAt) return 'No due date';
  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return date.getTime() < Date.now() ? 'Overdue' : 'Open';
}

export function OwnerDashboard() {
  const [client] = useState(authClient);
  const [session, setSession] = useState(null);
  const [authorization, setAuthorization] = useState({ checked: false, allowed: false, reason: '' });
  const [inquiries, setInquiries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activity, setActivity] = useState([]);
  const [consents, setConsents] = useState([]);
  const [stage, setStage] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState('');
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [savingStage, setSavingStage] = useState(false);
  const [withdrawingConsent, setWithdrawingConsent] = useState(false);

  useEffect(() => {
    if (!client) return;
    client.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = client.auth.onAuthStateChange((_event, next) => setSession(next ?? null));
    return () => listener.subscription.unsubscribe();
  }, [client]);

  // ponytail: every authorization decision routes through the server-only
  // /api/owner/whoami endpoint. The dashboard never trusts the client-side
  // session object alone; the server compares the validated email against
  // the designated owner address before the dashboard reveals CRM data.
  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!session?.access_token) {
        if (!cancelled) setAuthorization({ checked: true, allowed: false, reason: 'Not signed in.' });
        return;
      }
      try {
        const res = await fetch('/api/owner/whoami', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
          body: '{}',
        });
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && body.authorized) {
          setAuthorization({ checked: true, allowed: true, reason: '' });
        } else {
          setAuthorization({ checked: true, allowed: false, reason: body.reason || 'This account is not the authorized owner.' });
        }
      } catch {
        if (!cancelled) setAuthorization({ checked: true, allowed: false, reason: 'Authorization check failed.' });
      }
    }
    check();
    return () => { cancelled = true; };
  }, [session]);

  useEffect(() => {
    if (!client || !authorization.allowed) { setInquiries([]); return; }
    let cancelled = false;
    let builder = client.from('inquiries').select('id,business_name,email,leak_description,source,booking_status,lead_stage,next_action,due_at,created_at,triage_status,triage_priority,triage_category,triage_summary,triage_suggested_reply,triage_provider,triage_model,triage_error_code,triage_attempted_at,triaged_at').order('created_at', { ascending: false }).limit(25);
    if (stage !== 'all') builder = builder.eq('lead_stage', stage);
    builder.then(({ data, error }) => {
      if (cancelled) return;
      if (error) return setStatus('CRM records are unavailable for this account.');
      setInquiries(data ?? []);
    });
    return () => { cancelled = true; };
  }, [client, authorization.allowed, stage]);

  useEffect(() => {
    if (!client || !authorization.allowed || !inquiries.length) { setTasks([]); return; }
    let cancelled = false;
    client.from('tasks').select('id,inquiry_id,category,due_at,completed_at').in('inquiry_id', inquiries.map((inquiry) => inquiry.id)).is('completed_at', null).order('due_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) return setStatus('Follow-up tasks are unavailable for this account.');
        setTasks(data ?? []);
      });
    return () => { cancelled = true; };
  }, [client, authorization.allowed, inquiries]);

  useEffect(() => {
    if (!client || !authorization.allowed || !inquiries.length) { setNotes([]); setActivity([]); setConsents([]); return; }
    let cancelled = false;
    const inquiryIds = inquiries.map((inquiry) => inquiry.id);
    Promise.all([
      client.from('owner_notes').select('id,inquiry_id,body,created_at').in('inquiry_id', inquiryIds).order('created_at', { ascending: false }),
      client.from('audit_logs').select('id,inquiry_id,action,actor_type,created_at').in('inquiry_id', inquiryIds).order('created_at', { ascending: false }).limit(100),
      client.from('consents').select('id,inquiry_id,withdrawn_at').in('inquiry_id', inquiryIds).eq('consent_type', 'contact'),
    ]).then(([notesResult, activityResult, consentsResult]) => {
      if (cancelled) return;
      if (notesResult.error || activityResult.error || consentsResult.error) return setStatus('Owner notes, consent, or activity are unavailable for this account.');
      setNotes(notesResult.data ?? []);
      setActivity(activityResult.data ?? []);
      setConsents(consentsResult.data ?? []);
    });
    return () => { cancelled = true; };
  }, [client, authorization.allowed, inquiries]);

  async function signIn(event) {
    event.preventDefault();
    if (!client) return setStatus('Owner login is not connected yet.');
    const form = new FormData(event.currentTarget);
    const { error } = await client.auth.signInWithPassword({ email: form.get('email'), password: form.get('password') });
    setStatus(error ? 'Sign-in failed. Check your credentials and try again.' : 'Signed in.');
  }

  async function signOut() {
    await client?.auth.signOut();
    setAuthorization({ checked: true, allowed: false, reason: 'Not signed in.' });
    setStatus('Signed out.');
  }

  const visibleInquiries = useMemo(() => inquiries.filter((inquiry) => `${inquiry.business_name} ${inquiry.email}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'oldest' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at)), [inquiries, query, sort]);
  const selected = visibleInquiries.find(({ id }) => id === selectedId) || visibleInquiries[0];
  const selectedTask = selected ? tasks.find((task) => task.inquiry_id === selected.id) : null;
  const selectedNotes = selected ? notes.filter((note) => note.inquiry_id === selected.id) : [];
  const selectedActivity = selected ? activity.filter((event) => event.inquiry_id === selected.id) : [];
  const selectedConsent = selected ? consents.find((consent) => consent.inquiry_id === selected.id) : null;
  const overdueTasks = tasks.filter((task) => taskDueStatus(task.due_at) === 'Overdue');

  async function completeTask(task) {
    if (!client || !authorization.allowed || !task) return;
    setCompletingTaskId(task.id);
    const { data, error } = await client.rpc('owner_complete_task', { p_task_id: task.id });
    setCompletingTaskId(null);
    if (error || !data) return setStatus('The follow-up task could not be completed.');
    setTasks((current) => current.filter(({ id }) => id !== task.id));
    setInquiries((current) => current.map((inquiry) => inquiry.id === task.inquiry_id
      ? { ...inquiry, next_action: 'Review follow-up outcome', due_at: null }
      : inquiry));
    setStatus('Follow-up task completed and recorded.');
  }

  async function addNote(event) {
    event.preventDefault();
    if (!client || !authorization.allowed || !selected || !noteText.trim()) return;
    setSavingNote(true);
    const body = noteText.trim();
    const { data, error } = await client.rpc('owner_add_inquiry_note', { p_inquiry_id: selected.id, p_body: body });
    setSavingNote(false);
    if (error || !data) return setStatus('The owner note could not be recorded.');
    setNotes((current) => [{ id: data, inquiry_id: selected.id, body, created_at: new Date().toISOString() }, ...current]);
    setActivity((current) => [{ id: `local-${data}`, inquiry_id: selected.id, action: 'owner_note_added', actor_type: 'owner', created_at: new Date().toISOString() }, ...current]);
    setNoteText('');
    setStatus('Owner note recorded.');
  }

  async function updateLeadStage(nextStage) {
    if (!client || !authorization.allowed || !selected || !nextStage || nextStage === selected.lead_stage) return;
    setSavingStage(true);
    const { data, error } = await client.rpc('owner_update_inquiry_stage', { p_inquiry_id: selected.id, p_lead_stage: nextStage });
    setSavingStage(false);
    if (error || !data) return setStatus('The lead stage could not be updated.');
    setInquiries((current) => current.map((inquiry) => inquiry.id === selected.id ? { ...inquiry, lead_stage: nextStage } : inquiry));
    setActivity((current) => [{ id: `local-stage-${selected.id}-${nextStage}`, inquiry_id: selected.id, action: 'lead_stage_updated', actor_type: 'owner', created_at: new Date().toISOString() }, ...current]);
    setStatus('Lead stage updated and recorded.');
  }

  async function withdrawContactConsent() {
    if (!client || !authorization.allowed || !selected || !selectedConsent || selectedConsent.withdrawn_at) return;
    if (!window.confirm('Withdraw contact consent and cancel only unsent customer notifications for this inquiry? This does not delete the record.')) return;
    setWithdrawingConsent(true);
    const { data, error } = await client.rpc('owner_withdraw_inquiry_consent', { p_inquiry_id: selected.id });
    setWithdrawingConsent(false);
    if (error || !data) return setStatus('Contact consent could not be withdrawn.');
    const withdrawnAt = new Date().toISOString();
    setConsents((current) => current.map((consent) => consent.id === selectedConsent.id ? { ...consent, withdrawn_at: withdrawnAt } : consent));
    setInquiries((current) => current.map((inquiry) => inquiry.id === selected.id ? { ...inquiry, next_action: 'Contact consent withdrawn — do not contact', due_at: null } : inquiry));
    setActivity((current) => [{ id: `local-consent-${selected.id}`, inquiry_id: selected.id, action: 'contact_consent_withdrawn', actor_type: 'owner', created_at: withdrawnAt }, ...current]);
    setStatus('Contact consent withdrawn and unsent customer notifications cancelled.');
  }

  function exportVisible() {
    if (!visibleInquiries.length) return setStatus('There are no visible inquiries to export.');
    const rows = [['Business', 'Email', 'Source', 'Booking status', 'Stage', 'Next action', 'Due'], ...visibleInquiries.map((item) => [item.business_name, item.email, item.source, item.booking_status || '', item.lead_stage, item.next_action || '', item.due_at || ''])];
    const blob = new Blob([rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'ironwake-inquiries.csv'; link.click(); URL.revokeObjectURL(url); setStatus(`Exported ${visibleInquiries.length} visible inquiries.`);
  }

  async function exportSnapshot() {
    if (!client || !session?.access_token) return setStatus('A current owner session is required before exporting CRM records.');
    setStatus('Preparing the bounded CRM export…');
    try {
      const response = await fetch('/api/owner/export', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!response.ok) return setStatus('The CRM export could not be prepared.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'ironwake-owner-crm-export.json'; link.click(); URL.revokeObjectURL(url);
      setStatus('Downloaded a bounded owner CRM export.');
    } catch {
      setStatus('The CRM export could not be prepared.');
    }
  }

  return <main className="shell owner-shell">
    <section className="owner-card">
      <span className="eyebrow">Private / owner only</span>
      <h1>Owner CRM</h1>
      {!session ? <>
        <p>This screen is private. Only the designated owner account can read CRM records.</p>
        <form className="owner-form" onSubmit={signIn}>
          <p>Use the owner account. This screen never accepts or exposes service credentials.</p>
          {!client && <p className="notice" role="status">Owner login is not connected on this preview.</p>}
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="button" type="submit" disabled={!client}>Sign in</button>
        </form>
      </> : !authorization.allowed ? <>
        <p>This account is not the authorized owner for the IronWake CRM.</p>
        <p className="notice" role="status">{authorization.reason || 'Sign in with the designated owner email to continue.'}</p>
        <button className="button" onClick={signOut}>Sign out</button>
      </> : <>
        <p>Authenticated session active. CRM records remain protected by database owner policy.</p>
        <div className="dashboard-links"><a href="/admin">Notification status →</a></div>
        <div className="crm-toolbar"><label>Search inquiries<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label><button type="button" className="button secondary" onClick={exportVisible} disabled={!visibleInquiries.length}>Export visible</button><button type="button" className="button secondary" onClick={exportSnapshot}>Export CRM snapshot</button></div>
        <div role="group" aria-label="Filter by lead stage" className="stage-filter">
          {STAGES.map((value) => <button type="button" key={value} aria-pressed={stage === value} onClick={() => setStage(value)}>{value.replace('_', ' ')}</button>)}
        </div>
        <section className="crm-detail-note" aria-label="Open follow-up work"><span className="eyebrow">Current CRM window</span><h2>Open follow-up work</h2><p>{tasks.length} open task{tasks.length === 1 ? '' : 's'}; {overdueTasks.length} overdue. Provider notification state is tracked separately in <a href="/admin">Notification operations</a>.</p>{tasks.length ? <ul>{tasks.map((task) => <li key={task.id}><strong>{taskDueStatus(task.due_at)}</strong> · {task.category.replaceAll('_', ' ')} · due {formatDue(task.due_at)}</li>)}</ul> : <p>No open follow-up tasks in the currently accessible inquiry window.</p>}</section>
        <div className="crm-workspace"><ul className="record-list" aria-label="Recent inquiries">
          {visibleInquiries.length ? visibleInquiries.map((inquiry) => <li key={inquiry.id}><button type="button" className={`record-card${selected?.id === inquiry.id ? ' selected' : ''}`} onClick={() => setSelectedId(inquiry.id)}>
            <h3>{inquiry.business_name}</h3>
            <dl>
              <div><dt>Email</dt><dd>{inquiry.email}</dd></div>
              <div><dt>Stage</dt><dd>{inquiry.lead_stage}</dd></div>
              <div><dt>Next action</dt><dd>{inquiry.next_action || 'Not set'}</dd></div>
              <div><dt>Due</dt><dd>{formatDue(inquiry.due_at)}</dd></div>
              <div><dt>Triage</dt><dd>{inquiry.triage_status || 'Pending'}</dd></div>
              <div><dt>Source</dt><dd>{inquiry.source}</dd></div>
              {inquiry.booking_status && <div><dt>Booking</dt><dd>{inquiry.booking_status}</dd></div>}
            </dl>
          </button></li>) : <li>No accessible inquiries for this filter yet.</li>}
        </ul><aside className="crm-detail" aria-live="polite"><span className="eyebrow">Inquiry detail</span>{selected ? <><h2>{selected.business_name}</h2><p>{selected.email}</p><dl><div><dt>Source</dt><dd>{selected.source}</dd></div><div><dt>Lead stage</dt><dd>{selected.lead_stage}</dd></div><div><dt>Next action</dt><dd>{selected.next_action || 'Not set'}</dd></div><div><dt>Due date</dt><dd>{formatDue(selected.due_at)}</dd></div><div><dt>Contact consent</dt><dd>{selectedConsent?.withdrawn_at ? `Withdrawn ${formatDue(selectedConsent.withdrawn_at)}` : selectedConsent ? 'Active' : 'No contact consent record'}</dd></div><div><dt>Booking request</dt><dd>{selected.booking_status || 'Not a booking request'}</dd></div><div><dt>Follow-up</dt><dd>{selectedTask ? `${selectedTask.category} due ${formatDue(selectedTask.due_at)}` : 'No open follow-up task'}</dd></div><div><dt>AI triage</dt><dd>{selected.triage_status || 'Pending'}</dd></div><div><dt>Provider / model</dt><dd>{selected.triage_provider && selected.triage_model ? `${selected.triage_provider} / ${selected.triage_model}` : 'Not recorded'}</dd></div><div><dt>Priority / category</dt><dd>{selected.triage_priority || 'normal'} / {selected.triage_category || 'other'}</dd></div><div><dt>Attempted</dt><dd>{formatDue(selected.triage_attempted_at)}</dd></div>{selected.leak_description && <div><dt>Request summary</dt><dd>{selected.leak_description}</dd></div>}{selected.triage_summary && <div><dt>Summary</dt><dd>{selected.triage_summary}</dd></div>}{selected.triage_suggested_reply && <div><dt>Suggested reply</dt><dd>{selected.triage_suggested_reply}</dd></div>}{selected.triage_error_code && <div><dt>Safe triage status</dt><dd>{selected.triage_error_code}</dd></div>}</dl><label className="owner-stage-control">Update lead stage<select value={selected.lead_stage} onChange={(event) => updateLeadStage(event.target.value)} disabled={savingStage}>{STAGES.filter((value) => value !== 'all').map((value) => <option value={value} key={value}>{value.replaceAll('_', ' ')}</option>)}</select></label>{savingStage && <p className="micro">Updating lead stage…</p>}{selectedTask && <button type="button" className="button secondary" onClick={() => completeTask(selectedTask)} disabled={completingTaskId === selectedTask.id}>{completingTaskId === selectedTask.id ? 'Completing task…' : 'Complete follow-up task'}</button>}{selectedConsent && <button type="button" className="button secondary" onClick={withdrawContactConsent} disabled={withdrawingConsent || Boolean(selectedConsent.withdrawn_at)}>{selectedConsent.withdrawn_at ? 'Contact consent withdrawn' : withdrawingConsent ? 'Withdrawing contact consent…' : 'Withdraw contact consent'}</button>}<section className="crm-detail-note"><strong>Owner notes</strong><p>Notes are private to the authorized owner and are never included in notification payloads.</p><form className="assistant-form" onSubmit={addNote}><label>Add owner note<textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} maxLength="2000" required /></label><button type="submit" className="button secondary" disabled={savingNote || !noteText.trim()}>{savingNote ? 'Saving note…' : 'Save owner note'}</button></form>{selectedNotes.length ? <ul>{selectedNotes.map((note) => <li key={note.id}><p>{note.body}</p><span className="micro">{formatDue(note.created_at)}</span></li>)}</ul> : <p>No owner notes recorded.</p>}</section><section className="crm-detail-note"><strong>Activity timeline</strong>{selectedActivity.length ? <ul>{selectedActivity.map((event) => <li key={event.id}><span>{event.action.replaceAll('_', ' ')}</span><span className="micro">{event.actor_type} · {formatDue(event.created_at)}</span></li>)}</ul> : <p>No recorded activity for this inquiry.</p>}</section><div className="crm-detail-note"><strong>Tasks, notes, timeline, retry/dead-letter, and retention actions</strong><p>These private records are available only when the authorized owner schema and account session expose them. This screen never seeds or invents CRM activity.</p></div></> : <p>Select an inquiry to view its available details. Empty lists remain empty until a real authorized record exists.</p>}</aside></div>
        <button className="button" onClick={signOut}>Sign out</button>
      </>}
      {status && <p className="notice" role="status">{status}</p>}
    </section>
  </main>;
}
