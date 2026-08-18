'use client';
// ponytail: every public write path lands on /api/audit. AuditForm is the audit
// intake; BookingPreview reuses the same endpoint with source='website_booking'.

import { useId, useMemo, useRef, useState } from 'react';
import { submitAudit } from './submit-audit.mjs';

// Ponytail: validation mirrors lib/audit-validation.mjs (server zod schema) so
// the client never wastes a round-trip on values the server rejects. Field
// messages are short, specific, and never invent a guarantee (no "your audit
// is queued" — the API only confirms receipt, which is what we say).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_LEAK_LEN = 10;
const MIN_BUSINESS_LEN = 2;
const MAX_BUSINESS_LEN = 120;
const MAX_EMAIL_LEN = 254;
const MAX_LEAK_LEN = 4000;

function validate(values) {
  const errors = {};
  const business = values.business.trim();
  if (!business) errors.business = 'Tell IronWake which business this is for.';
  else if (business.length < MIN_BUSINESS_LEN)
    errors.business = `Use at least ${MIN_BUSINESS_LEN} characters for the business name.`;
  else if (business.length > MAX_BUSINESS_LEN)
    errors.business = `Keep the business name under ${MAX_BUSINESS_LEN} characters.`;

  const email = values.email.trim();
  if (!email) errors.email = 'An email address is required for the follow-up.';
  else if (email.length > MAX_EMAIL_LEN)
    errors.email = 'That email address is too long.';
  else if (!EMAIL_PATTERN.test(email))
    errors.email = 'Enter a complete email address (e.g. you@business.com).';

  const leak = values.leak.trim();
  if (!leak) errors.leak = 'Describe the leak in one or two sentences.';
  else if (leak.length < MIN_LEAK_LEN)
    errors.leak = `A few more words helps — at least ${MIN_LEAK_LEN} characters.`;
  else if (leak.length > MAX_LEAK_LEN)
    errors.leak = `Keep the description under ${MAX_LEAK_LEN} characters.`;

  if (!values.consent)
    errors.consent = 'Consent is required before IronWake can reply.';
  return errors;
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <span id={id} className="field-error" role="alert">
      {children}
    </span>
  );
}

export function AuditForm() {
  const formId = useId();
  const ids = useMemo(
    () => ({
      business: `${formId}-business`,
      email: `${formId}-email`,
      leak: `${formId}-leak`,
      consent: `${formId}-consent`,
      businessError: `${formId}-business-error`,
      emailError: `${formId}-email-error`,
      leakError: `${formId}-leak-error`,
      consentError: `${formId}-consent-error`,
      status: `${formId}-status`
    }),
    [formId]
  );

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const formRef = useRef(null);

  const markTouched = (name) =>
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));

  const fieldClass = (name) => {
    if (!touched[name] || !errors[name]) return '';
    return ' has-error';
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      business: String(data.get('business') ?? ''),
      email: String(data.get('email') ?? ''),
      leak: String(data.get('leak') ?? ''),
      consent: data.get('consent') === 'on',
      website: String(data.get('website') ?? '')
    };
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ business: true, email: true, leak: true, consent: true });
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setMessage('Fix the highlighted fields and send again.');
      return;
    }
    setStatus('submitting');
    setMessage('');
    const ui = await submitAudit({
      payload: { ...values, source: 'website_audit' },
      fetchImpl: fetch.bind(window),
      form
    });
    setStatus(ui.status);
    setMessage(ui.message);
    if (ui.status === 'success') {
      setErrors({});
      setTouched({});
    }
  }

  if (status === 'success') {
    return (
      <section className="audit-shell">
        <article
          className="audit-form audit-success"
          aria-labelledby={`${ids.status}-title`}
        >
          <span className="eyebrow">Request received</span>
          <h2 id={`${ids.status}-title`} className="audit-success__title">
            Your audit request is in.
          </h2>
          <p className="audit-success__body">
            IronWake reviews each request by hand. You will hear back from a
            person, not a bot, once the intake has been read.
          </p>
          <div
            id={ids.status}
            className="notice notice-success"
            role="status"
          >
            {message ||
              'We received your request. We will review it and follow up if needed.'}
          </div>
          <button
            type="button"
            className="audit-success__reset"
            onClick={() => {
              setStatus('idle');
              setMessage('');
              setErrors({});
              setTouched({});
              if (formRef.current) formRef.current.reset();
            }}
          >
            Submit another request
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="audit-shell">
      <article className="audit-form" aria-describedby={`${ids.status}`}>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          onBlur={(event) => {
            const name = event.target.getAttribute('name');
            if (name) markTouched(name);
          }}
          noValidate
        >
          <header className="audit-form__head">
            <span className="eyebrow">Business Leak Audit</span>
            <h2>Tell IronWake where the leaks are.</h2>
            <p className="audit-form__intro">
              This request does not create a quote or schedule a meeting. It
              sends a written summary to IronWake for a human review.
            </p>
          </header>

          <label className={fieldClass('business')} htmlFor={ids.business}>
            <span>Business name</span>
            <input
              id={ids.business}
              name="business"
              type="text"
              autoComplete="organization"
              required
              minLength={MIN_BUSINESS_LEN}
              maxLength={MAX_BUSINESS_LEN}
              aria-invalid={Boolean(errors.business)}
              aria-describedby={errors.business ? ids.businessError : undefined}
            />
            <FieldError id={ids.businessError}>
              {touched.business ? errors.business : null}
            </FieldError>
          </label>

          <label className={fieldClass('email')} htmlFor={ids.email}>
            <span>Email for the follow-up</span>
            <input
              id={ids.email}
              name="email"
              type="email"
              autoComplete="email"
              required
              inputMode="email"
              maxLength={MAX_EMAIL_LEN}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? ids.emailError : undefined}
            />
            <FieldError id={ids.emailError}>
              {touched.email ? errors.email : null}
            </FieldError>
          </label>

          <label className={fieldClass('leak')} htmlFor={ids.leak}>
            <span>Where are calls or bookings slipping?</span>
            <textarea
              id={ids.leak}
              name="leak"
              rows={4}
              required
              minLength={MIN_LEAK_LEN}
              maxLength={MAX_LEAK_LEN}
              aria-invalid={Boolean(errors.leak)}
              aria-describedby={errors.leak ? ids.leakError : undefined}
            />
            <FieldError id={ids.leakError}>
              {touched.leak ? errors.leak : null}
            </FieldError>
          </label>

          {/* honeypot — bots fill, humans never see */}
          <label className="trap" aria-hidden="true">
            <span>Website</span>
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          <label
            className={`check${fieldClass('consent')}`}
            htmlFor={ids.consent}
          >
            <input
              id={ids.consent}
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? ids.consentError : undefined}
            />
            <span>
              I agree to be contacted about this request and to the storage of
              this enquiry in IronWake&rsquo;s internal CRM.
            </span>
            <FieldError id={ids.consentError}>
              {touched.consent ? errors.consent : null}
            </FieldError>
          </label>

          <div className="audit-form__actions">
            <button
              type="submit"
              className="btn btn-primary audit-form__submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting'
                ? 'Sending request…'
                : 'Send the request'}
            </button>
            {status === 'submitting' ? (
              <span className="audit-form__busy" aria-hidden="true">
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
              </span>
            ) : null}
          </div>

          <p
            id={ids.status}
            className={`notice${
              status === 'error' && !Object.keys(errors).length
                ? ' error'
                : ''
            }`}
            role={status === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {message}
          </p>
        </form>
      </article>
    </section>
  );
}

export default AuditForm;