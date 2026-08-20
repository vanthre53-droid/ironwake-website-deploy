'use client';

import { useId, useState } from 'react';
import Field from '../components/ui/Field.jsx';

const windows = ['Morning — 09:00–12:00 IST', 'Afternoon — 13:00–16:00 IST', 'Evening — 16:00–18:00 IST'];

export function BookingPreview() {
  const reactId = useId();
  const ids = {
    date: `${reactId}-date`,
    window: `${reactId}-window`,
    scope: `${reactId}-scope`,
    business: `${reactId}-business`,
    email: `${reactId}-email`,
    consent: `${reactId}-consent`,
    consentError: `${reactId}-consent-error`,
    status: `${reactId}-status`
  };

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [consentTouched, setConsentTouched] = useState(false);
  const [consentError, setConsentError] = useState(null);

  async function submit(event) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const consentValue = data.get('consent') === 'on';
    if (!consentValue) {
      setConsentTouched(true);
      setConsentError('Consent is required before IronWake can reply.');
      setStatus('error');
      setMessage('Please tick the consent box so IronWake can follow up.');
      return;
    }
    const payload = {
      business: data.get('business'),
      email: data.get('email'),
      leak: `Booking preference: ${data.get('date')} / ${data.get('window')}. First-call scope: ${data.get('scope')}`,
      consent: consentValue,
      website: ''
    };
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...payload, source: 'website_booking' })
      });
      const result = await response.json();
      setStatus(response.ok ? 'success' : 'error');
      setMessage(
        response.ok
          ? 'BOOKING REQUEST RECEIVED. IronWake will review the request and reply separately; no appointment is confirmed yet.'
          : result.error || 'Please try again.'
      );
      if (response.ok) form.reset();
    } catch {
      setStatus('error');
      setMessage('Your request could not be sent. Please try again.');
    }
  }

  return (
    <section className="booking-preview" aria-labelledby="booking-preview-heading">
      <div>
        <span className="eyebrow">Your preference</span>
        <h2 id="booking-preview-heading">Choose a date and time window.</h2>
        <p>
          IronWake will review this request and reply separately. Nothing is
          booked when you press send.
        </p>
      </div>
      <form
        className="booking-form"
        onSubmit={submit}
        aria-busy={status === 'loading'}
        aria-describedby={ids.status}
        noValidate
      >
        <Field
          id={ids.date}
          name="date"
          type="date"
          label="Preferred date"
          required
          autoComplete="off"
          inputMode="numeric"
          className="booking-field"
        />

        <Field
          id={ids.window}
          name="window"
          as="select"
          label="Preferred window"
          required
          defaultValue=""
          className="booking-field"
        >
          <option value="" disabled>
            Select a window
          </option>
          {windows.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </Field>

        <Field
          id={ids.scope}
          name="scope"
          label="What should the first call cover?"
          multiline
          rows={4}
          required
          minLength={10}
          maxLength={4000}
          placeholder="Describe the main topic or problem you want to discuss"
          className="booking-field"
        />

        <Field
          id={ids.business}
          name="business"
          type="text"
          label="Business name"
          required
          autoComplete="organization"
          minLength={2}
          maxLength={120}
          placeholder="Your business name"
          className="booking-field"
        />

        <Field
          id={ids.email}
          name="email"
          type="email"
          label="Work email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          placeholder="you@company.com"
          className="booking-field"
        />

        <label
          className={`check${consentError ? ' has-error' : ''}`}
          htmlFor={ids.consent}
        >
          <input
            id={ids.consent}
            name="consent"
            type="checkbox"
            required
            aria-invalid={Boolean(consentError)}
            aria-describedby={consentError ? ids.consentError : undefined}
            onBlur={() => {
              setConsentTouched(true);
              const value = document.getElementById(ids.consent)?.checked;
              setConsentError(value ? null : 'Consent is required before IronWake can reply.');
            }}
          />
          <span>I agree to be contacted about this request.</span>
        </label>
        {consentError ? (
          <span id={ids.consentError} className="field-error" role="alert">
            {consentError}
          </span>
        ) : null}

        <button
          className="button"
          type="submit"
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? 'Sending request…' : 'Request this time'}
        </button>
        {message ? (
          <p
            id={ids.status}
            className={`notice ${status}`}
            role={status === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}