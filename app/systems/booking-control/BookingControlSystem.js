'use client';
import { useState } from 'react';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';

// v13: Capability vs status — what the system WOULD do vs what is currently live.
// STATES represent the BOOKING STATE MACHINE: requested → confirmed | disputed.
// They are derived from real provider acknowledgements, never from form submission alone.
const STATES = [
  {
    id: 'requested',
    label: 'Requested',
    description: 'Customer submitted the form. No provider has acknowledged the slot.',
    proof: 'Form submission alone can never reach this state.',
    confirmed: false,
  },
  {
    id: 'confirmed',
    label: 'Confirmed',
    description:
      'Provider (calendar, scheduling, or receptionist) has acknowledged the slot and returned a confirmation token.',
    proof: 'Provider acknowledgement is required.',
    confirmed: true,
  },
  {
    id: 'disputed',
    label: 'Disputed',
    description:
      'The customer or operator has flagged the slot. The system marks it for review instead of silently confirming.',
    proof: 'Operator acknowledgement is required to clear.',
    confirmed: false,
  },
];

const CAPABILITIES = [
  'Separate *requested* and *confirmed* slot states on every booking record.',
  'Reject form-submission-only bookings from being labelled as confirmed.',
  'Surface the booking state in the operator dashboard and the customer reply.',
  'Log provider acknowledgement with the actual confirmation token.',
];

export function BookingControlSystem() {
  const [active, setActive] = useState('requested');

  return (
    <main className="shell" aria-labelledby="bc-hero-heading">
      <section className="hero compact bc-hero">
        <span className="eyebrow">Systems / Booking Certainty</span>
        <h1 id="bc-hero-heading">Booking Certainty — keep requested and confirmed honestly separate.</h1>
        <p className="reading-width">
          Most booking systems silently confirm when the form submits. IronWake keeps the
          gap visible: requested means requested, confirmed means a provider acknowledged
          it. Nothing in between is described as confirmed.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a Business Leak Audit</a>
          <a className="button ghost" href="#states">See the three states</a>
          <a className="button ghost" href="/pricing">View pricing</a>
        </div>
      </section>

      <MotionReveal>
        <section className="section" aria-labelledby="bc-what-heading">
          <span className="eyebrow">What it does</span>
          <h2 id="bc-what-heading">Three slot states, kept apart.</h2>
          <p className="reading-width">
            A booking record is one of three things: requested, confirmed, or disputed.
            Each transition is logged with the evidence that produced it. Form submission
            is never enough to reach the confirmed state.
          </p>
          <div className="bc-state-tabs" role="tablist" aria-label="Booking slot states">
            {STATES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-pressed={active === s.id}
                className={`bc-state-tab ${active === s.id ? 'is-active' : ''} ${s.confirmed ? 'is-confirmed' : ''}`}
                onClick={() => setActive(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="bc-state-display" id="states" role="region" aria-live="polite">
            {STATES.filter((s) => s.id === active).map((s) => (
              <article key={s.id} className="bc-state-card">
                <span className="micro">{s.confirmed ? 'confirmed' : 'pending'}</span>
                <h3>{s.label}</h3>
                <p>{s.description}</p>
                <p className="bc-state-proof">{s.proof}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="bc-how-heading">
          <span className="eyebrow">How it works</span>
          <h2 id="bc-how-heading">Capability versus status.</h2>
          <p className="reading-width">
            The capability list below is what the system is built to do. The status
            column tells you which of those capabilities are wired to a verified
            provider today.
          </p>
          <div className="bc-capability-grid" role="list">
            {CAPABILITIES.map((cap, i) => (
              <article key={cap} className="bc-capability" role="listitem">
                <span className="micro">0{i + 1} / capability</span>
                <h3>{cap}</h3>
                <p>Each capability is documented in the audit; none is described as
                  live without provider evidence.</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="bc-outcomes-heading">
          <span className="eyebrow">Outcomes</span>
          <h2 id="bc-outcomes-heading">What changes for the operator.</h2>
          <p className="reading-width">
            Operators stop chasing phantom bookings. The dashboard shows the actual state
            of every slot. No fabricated metrics, no fake no-show rates.
          </p>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="bc-fit-heading">
          <span className="eyebrow">Industry fit</span>
          <h2 id="bc-fit-heading">Where this system is scoped.</h2>
          <div className="system-grid" role="list">
            <a className="system-card" href="/industries/dental-clinics" role="listitem">
              <span className="micro">01 / dental clinics</span>
              <h3>Dental clinics</h3>
              <p>Slot control without any instant or auto promise.</p>
            </a>
            <a className="system-card" href="/industries/salons-spas" role="listitem">
              <span className="micro">02 / salons and spas</span>
              <h3>Salons and spas</h3>
              <p>Same-day and next-day slot tracking for small service teams.</p>
            </a>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="bc-pricing-heading">
          <span className="eyebrow">Pricing reference</span>
          <h2 id="bc-pricing-heading">Engagement tier and next step.</h2>
          <PricingReference systemId="booking-control" />
          <div className="hero-actions">
            <a className="button" href="/audit">Request a Business Leak Audit</a>
            <a className="button ghost" href="/pricing">View pricing</a>
          </div>
        </section>
      </MotionReveal>
    </main>
  );
}