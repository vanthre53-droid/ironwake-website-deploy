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
    <section className="hero compact"><span className="eyebrow">Business Leak Audit</span><h1>Find the step where an enquiry loses momentum.</h1><p>Describe one customer journey that feels unreliable. IronWake reviews where ownership becomes unclear and identifies the smallest useful next step.</p></section>
    <section className="audit-grid"><div><span className="eyebrow">What we trace</span><div className="diagnostic" aria-label="Illustrated inquiry workflow"><p>Inquiry → response</p><p>Booking → next action</p><p>Recovery → human review</p></div></div><form className="audit-form" onSubmit={submit} aria-busy={status === 'loading'}><span className="eyebrow">Request a free leak check</span><p>Tell us what happens now and where customers or staff get stuck. This request does not book a call or create a quote.</p><label><span>Business name *</span><input name="business" required minLength="2" maxLength="120" autoComplete="organization" placeholder="Your business name" /></label><label><span>Work email *</span><input name="email" type="email" required maxLength="254" autoComplete="email" placeholder="you@company.com" /></label><label><span>What happens, and where does it break? *</span><textarea name="leak" required minLength="10" maxLength="4000" placeholder="Describe the customer journey and where it loses momentum" /></label><label className="check"><input name="consent" type="checkbox" required /> I agree to be contacted about this request.</label><label className="trap" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label><button className="button" disabled={status === 'loading'}>{status === 'loading' ? 'Sending request…' : 'Send my audit request'}</button>{message && <p className={`notice ${status}`} role="status">{message}</p>}</form></section>
    <section className="section"><span className="eyebrow">Audit deliverables</span><h2>A concise review, not a theatre report.</h2><div className="system-grid"><article className="system-card"><span className="micro">01 / map</span><h3>Bounded Review</h3><p>Identify the path where a visitor can lose context or ownership.</p></article><article className="system-card"><span className="micro">02 / evidence</span><h3>Visible Constraints</h3><p>Separate what is verified from assumptions and pending provider proof.</p></article><article className="system-card"><span className="micro">03 / next step</span><h3>Smallest System</h3><p>Recommend only the next appropriate operational step.</p></article></div></section>
    <SiteFooter />
  </main>;
}
