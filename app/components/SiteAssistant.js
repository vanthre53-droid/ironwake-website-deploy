'use client';

import { useState } from 'react';

const answers = {
  services: 'IronWake maps and improves inquiry, booking, follow-up, and reception workflows. Each engagement begins with a Business Leak Audit so the next step stays scoped to the actual handoff.',
  pricing: 'IronWake does not publish prices before scope, provider costs, and legal terms are approved. You can request scope and receive a human-reviewed outline instead.',
  booking: 'Calendar booking is currently a request-preview, not a confirmed time. You can choose a preferred window and IronWake will review it before anything is confirmed.'
};

export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = {
      business: form.get('business'),
      email: form.get('email'),
      leak: form.get('request'),
      consent: form.get('consent') === 'on',
      website: ''
    };
    try {
      const response = await fetch('/api/audit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      setStatus(response.ok ? 'success' : 'error');
      setMessage(result.message || result.error || 'Please try again.');
      if (response.ok) event.currentTarget.reset();
    } catch {
      setStatus('error');
      setMessage('Your request could not be sent. Please try again.');
    }
  }

  return <aside id="ironwake-assistant" className={`site-assistant${open ? ' is-open' : ''}`} aria-label="IronWake request guide">
    {open && <section className="assistant-panel" aria-live="polite">
      <div className="assistant-heading"><div><span className="eyebrow">Quick help</span><h2>What do you need?</h2></div><button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close request guide">×</button></div>
      <p>Choose a common question or send a request for human review. This is a simple guide, not a live AI chat.</p>
      <div className="assistant-prompts" aria-label="Common questions">
        {Object.entries(answers).map(([key, value]) => <button type="button" key={key} onClick={() => setAnswer(value)}>{key === 'services' ? 'What does IronWake do?' : key === 'pricing' ? 'How does pricing work?' : 'How do I book?'}</button>)}
      </div>
      {answer && <p className="assistant-answer" role="status">{answer}</p>}
      <form className="assistant-form" onSubmit={submit} aria-busy={status === 'loading'}>
        <label>Business name<input name="business" minLength="2" maxLength="120" autoComplete="organization" required /></label>
        <label>Work email<input name="email" type="email" maxLength="254" autoComplete="email" required /></label>
        <label>What would you like reviewed?<textarea name="request" minLength="10" maxLength="4000" required /></label>
        <label className="check"><input name="consent" type="checkbox" required /> I agree to be contacted about this request.</label>
        <button className="button" disabled={status === 'loading'}>{status === 'loading' ? 'Sending request…' : 'Send for review'}</button>
        <a className="text-link" href="/book">Prefer to request a call? →</a>
        {message && <p className={`notice ${status}`} role="status">{message}</p>}
      </form>
    </section>}
    <button className="assistant-trigger" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="ironwake-assistant">{open ? 'Close help' : 'Need help?'}</button>
  </aside>;
}
