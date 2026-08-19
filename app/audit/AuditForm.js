'use client';
import { useId, useMemo, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Field from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import { submitAudit } from './submit-audit.mjs';

const PRICING_OFFERS = [
  { id: 'recovery-retainer', name: 'Recovery Retainer' },
  { id: 'growth-retainer', name: 'Growth Retainer' },
  { id: 'foundation-build', name: 'Foundation Build' },
  { id: 'sprint-fix', name: 'Sprint Fix' }
];
const PRICING_TIERS = ['lite', 'standard', 'pro'];
const TIER_LABEL = { lite: 'Lite', standard: 'Standard', pro: 'Pro' };

function resolveOffer(offerId) {
  return PRICING_OFFERS.find((o) => o.id === offerId);
}
function resolveTier(tier) {
  const key = (tier || '').toLowerCase();
  return PRICING_TIERS.includes(key) ? key : null;
}

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

export function AuditForm() {
  return (
    <Suspense fallback={<AuditFormSkeleton />}>
      <AuditFormInner />
    </Suspense>
  );
}

function AuditFormSkeleton() {
  return (
    <section className="audit-shell">
      <article className="audit-form" aria-busy="true">
        <header className="audit-form__head">
          <span className="eyebrow">Business Leak Audit</span>
          <h1>Tell IronWake where the leaks are.</h1>
        </header>
        <p className="audit-form__intro">Loading the audit form…</p>
      </article>
    </section>
  );
}

function AuditFormInner() {
  const formId = useId();
  const searchParams = useSearchParams();
  const ids = useMemo(
    () => ({
      business: `${formId}-business`,
      email: `${formId}-email`,
      leak: `${formId}-leak`,
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

  const rawOffer = searchParams?.get('offer');
  const rawTier = searchParams?.get('tier');
  const offerMatch = resolveOffer(rawOffer);
  const tierMatch = resolveTier(rawTier);
  const selectedOffer = offerMatch || null;
  const selectedTier = tierMatch && offerMatch ? tierMatch : null;
  const selectedLabel = selectedOffer && selectedTier
    ? `${selectedOffer.name} · ${TIER_LABEL[selectedTier]} tier`
    : null;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      business: String(data.get('business') ?? ''),
      email: String(data.get('email') ?? ''),
      leak: String(data.get('leak') ?? ''),
      consent: data.get('consent') === 'on',
      website: String(data.get('website') ?? ''),
      offer: selectedOffer?.id || undefined,
      tier: selectedTier || undefined
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
          <h2 id={`${ids.status}-title`} className="audit-success__title" aria-live="polite">
            Your audit request is in.
          </h2>
          <p className="audit-success__body">
            IronWake reviews each request by hand. You will hear back from a
            person, not a bot, once the intake has been read.
          </p>
          <div className="audit-success__actions">
            <Link href="/pricing" className="button secondary">Back to pricing</Link>
          </div>
        </article>
      </section>
    );
  }

  const consentError = touched.consent ? errors.consent : null;

  return (
    <section className="audit-shell">
      <article className="audit-form">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={ids.status}
        >
          {selectedLabel ? (
            <div
              id={`${formId}-selected`}
              className="audit-form__context-banner"
              role="status"
            >
              <span className="audit-form__context-eyebrow">Pre-filled from Pricing</span>
              <strong className="audit-form__context-title">{selectedLabel}</strong>
              <p className="audit-form__context-body">
                We&rsquo;ll review this against your leak description and reply
                with what we can deliver for this tier. You can refine either below.
              </p>
              <input type="hidden" name="offer" value={selectedOffer.id} />
              <input type="hidden" name="tier" value={selectedTier} />
              <Link
                href="/pricing"
                className="audit-form__context-clear"
                aria-label="Clear pre-filled offer and tier"
              >
                Change offer
              </Link>
            </div>
          ) : null}
          <header className="audit-form__head">
            <span className="eyebrow">Business Leak Audit</span>
            <h1>Tell IronWake where the leaks are.</h1>
            <p className="audit-form__intro">
              This request does not create a quote or schedule a meeting. It
              sends a written summary to IronWake for a human review.
            </p>
          </header>

          <Field
            id={ids.business}
            name="business"
            type="text"
            label="Business name"
            required
            autoComplete="organization"
            minLength={MIN_BUSINESS_LEN}
            maxLength={MAX_BUSINESS_LEN}
            error={touched.business ? errors.business : null}
            className="audit-field"
          />

          <Field
            id={ids.email}
            name="email"
            type="email"
            label="Email for the follow-up"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={MAX_EMAIL_LEN}
            error={touched.email ? errors.email : null}
            className="audit-field"
          />

          <Field
            id={ids.leak}
            name="leak"
            label="Where are calls or bookings slipping?"
            multiline
            rows={4}
            required
            minLength={MIN_LEAK_LEN}
            maxLength={MAX_LEAK_LEN}
            error={touched.leak ? errors.leak : null}
            className="audit-field"
          />

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
            className={`check${consentError ? ' has-error' : ''}`}
            htmlFor={`${formId}-consent`}
          >
            <input
              id={`${formId}-consent`}
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(consentError)}
              aria-describedby={consentError ? ids.consentError : undefined}
              onBlur={() => setTouched((p) => ({ ...p, consent: true }))}
            />
            <span>
              I agree to be contacted about this request and to the storage of
              this enquiry in IronWake&rsquo;s internal CRM.
            </span>
          </label>
          {consentError ? (
            <span id={ids.consentError} className="field-error" role="alert">
              {consentError}
            </span>
          ) : null}

          <div className="audit-form__actions">
            <Button
              type="submit"
              variant="primary"
              loading={status === 'submitting'}
              block
              className="audit-form__submit"
            >
              {status === 'submitting' ? 'Sending request…' : 'Send the request'}
            </Button>
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
