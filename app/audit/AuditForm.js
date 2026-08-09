'use client';

import { useRef, useState } from 'react';
import { submitAudit } from './submit-audit.mjs';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

const TRACE_STEPS = [
  { id: 'inquiry', label: 'Inquiry', next: 'response' },
  { id: 'response', label: 'Response' },
  { id: 'booking', label: 'Booking', next: 'next-action' },
  { id: 'next-action', label: 'Next action' },
  { id: 'recovery', label: 'Recovery', next: 'human-review' },
  { id: 'human-review', label: 'Human review' }
];

function readPayload(form, consentEl) {
  return {
    business: form.elements['business']?.value?.trim() ?? '',
    email: form.elements['email']?.value?.trim() ?? '',
    leak: form.elements['leak']?.value?.trim() ?? '',
    consent: consentEl ? consentEl.checked : false,
    website: form.elements['website']?.value ?? ''
  };
}

export function AuditForm() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const consentRef = useRef(null);
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget; // ponytail: capture before any await
    if (!form) return;
    const consentEl = consentRef.current;
    const payload = readPayload(form, consentEl);
    setStatus('loading');
    setMessage('');
    const ui = await submitAudit({ payload, fetchImpl: fetch, form });
    setStatus(ui.status);
    setMessage(ui.message);
    if (ui.status === 'success' && consentEl) consentEl.checked = false;
  }
  return (
    <main className="shell">
      <SiteHeader />
      <section className="hero compact">
        <span className="eyebrow">Business Leak Audit</span>
        <h1>Find the step where an enquiry loses momentum.</h1>
        <p>
          Describe one customer journey that feels unreliable. IronWake reviews where ownership
          becomes unclear and identifies the smallest useful next step.
        </p>
      </section>
      <section className="audit-grid">
        <div>
          <span className="eyebrow">What we trace</span>
          <div className="diagnostic" aria-label="Illustrated inquiry workflow">
            {TRACE_STEPS.map((step) => (
              <p key={step.id}>
                {step.label}
                {step.next ? ` → ${step.next}` : ''}
              </p>
            ))}
          </div>
        </div>
        <form
          className="audit-form"
          onSubmit={submit}
          aria-busy={status === 'loading'}
          noValidate
        >
          <span className="eyebrow">Request a Business Leak Audit</span>
          <p>
            Tell us what happens now and where customers or staff get stuck. Pricing for the
            audit tiers is published on /pricing. This request does not book a call or create a
            quote.
          </p>
          <label>
            <span>Business name *</span>
            <input
              name="business"
              required
              minLength={2}
              maxLength={120}
              autoComplete="organization"
              placeholder="Your business name"
            />
          </label>
          <label>
            <span>Work email *</span>
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@company.com"
            />
          </label>
          <label>
            <span>What happens, and where does it break? *</span>
            <textarea
              name="leak"
              required
              minLength={10}
              maxLength={4000}
              placeholder="Describe the customer journey and where it loses momentum"
            />
          </label>
          <label className="check">
            <input ref={consentRef} name="consent" type="checkbox" required /> I agree to be
            contacted about this request.
          </label>
          <label className="trap" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <button className="button" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending request…' : 'Send my audit request'}
          </button>
          {message && (
            <p className={`notice ${status}`} role="status">
              {message}
            </p>
          )}
        </form>
      </section>
      <section className="section">
        <span className="eyebrow">Audit deliverables</span>
        <h2>A concise review, not a theatre report.</h2>
        <div className="system-grid">
          <article className="system-card">
            <span className="micro">01 / map</span>
            <h3>Bounded Review</h3>
            <p>Identify the path where a visitor can lose context or ownership.</p>
          </article>
          <article className="system-card">
            <span className="micro">02 / evidence</span>
            <h3>Visible Constraints</h3>
            <p>Separate what is verified from assumptions and pending provider proof.</p>
          </article>
          <article className="system-card">
            <span className="micro">03 / next step</span>
            <h3>Smallest System</h3>
            <p>Recommend only the next appropriate operational step.</p>
          </article>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
