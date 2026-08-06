'use client';

import { useState } from 'react';

const windows = ['Morning — 09:00–12:00 IST', 'Afternoon — 13:00–16:00 IST', 'Evening — 16:00–18:00 IST'];

export function BookingPreview() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    setStatus('loading'); setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = { business: form.get('business'), email: form.get('email'), leak: `Booking preference: ${form.get('date')} / ${form.get('window')}. First-call scope: ${form.get('scope')}`, consent: form.get('consent') === 'on', website: '' };
    try {
      const response = await fetch('/api/audit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      setStatus(response.ok ? 'success' : 'error');
      setMessage(result.message || result.error || 'Please try again.');
      if (response.ok) event.currentTarget.reset();
    } catch { setStatus('error'); setMessage('Your request could not be sent. Please try again.'); }
  }
  return <section className="booking-preview" aria-labelledby="booking-preview-heading">
    <div><span className="eyebrow">Your preference</span><h2 id="booking-preview-heading">Choose a date and time window.</h2><p>IronWake will review this request and reply separately. Nothing is booked when you press send.</p></div>
    <form className="booking-form" onSubmit={submit} aria-busy={status === 'loading'}>
      <label>Preferred date<input type="date" name="date" required /></label>
      <label>Preferred window<select name="window" required defaultValue=""><option value="" disabled>Select a window</option>{windows.map(window => <option key={window}>{window}</option>)}</select></label>
      <label>What should the first call cover?<textarea name="scope" minLength="10" maxLength="4000" required /></label>
      <label>Business name<input name="business" minLength="2" maxLength="120" autoComplete="organization" required /></label>
      <label>Work email<input name="email" type="email" maxLength="254" autoComplete="email" required /></label>
      <label className="check"><input name="consent" type="checkbox" required /> I agree to be contacted about this request.</label>
      <button className="button" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Sending request…' : 'Request this time'}</button>
      {message && <p className={`notice ${status}`} role="status">{message}</p>}
    </form>
  </section>;
}
