'use client';

import { useState } from 'react';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export function AuditForm() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.consent = form.get('consent') === 'on';
    try {
      const response = await fetch('/api/audit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      setStatus(response.ok ? 'success' : 'error');
      setMessage(result.message || result.error || 'Try again.');
      if (response.ok) event.currentTarget.reset();
    } catch {
      setStatus('error');
      setMessage('The request could not be sent. Try again.');
    }
  }
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Live demonstration / Business Leak Audit</span><h1>Find where a real inquiry can disappear.</h1><p>IronWake diagnoses the gaps in an enquiry workflow to identify the smallest fix that protects the highest-intent recovery. We acknowledge requests only after they are saved.</p></section>
    <section className="audit-grid"><div><span className="eyebrow">Visual diagnostic path</span><div className="diagnostic" aria-label="Illustrated inquiry workflow"><p>Inquiry → response</p><p>Booking → next action</p><p>Recovery → human review</p></div></div><form className="audit-form" onSubmit={submit} aria-busy={status === 'loading'}><span className="eyebrow">Request a free leak check</span><p>Share the business-critical handoff you want reviewed. No booking, quote, or provider connection is implied by this request.</p><label><span>Business name</span><input name="business" required minLength="2" maxLength="120" /></label><label><span>Work email</span><input name="email" type="email" required maxLength="254" /></label><label><span>Where is the leak?</span><textarea name="leak" required minLength="10" maxLength="4000" /></label><label className="check"><input name="consent" type="checkbox" required /> I agree to be contacted about this request.</label><label className="trap" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label><button className="button" disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : 'Request audit'}</button>{message && <p className={`notice ${status}`} role="status">{message}</p>}</form></section>
    <section className="section"><span className="eyebrow">Audit deliverables</span><h2>A concise review, not a theatre report.</h2><div className="system-grid"><article className="system-card"><span className="micro">01 / map</span><h3>Bounded Review</h3><p>Identify the path where a visitor can lose context or ownership.</p></article><article className="system-card"><span className="micro">02 / evidence</span><h3>Visible Constraints</h3><p>Separate what is verified from assumptions and pending provider proof.</p></article><article className="system-card"><span className="micro">03 / next step</span><h3>Smallest System</h3><p>Recommend only the next appropriate operational step.</p></article></div></section>
    <SiteFooter />
  </main>;
}
