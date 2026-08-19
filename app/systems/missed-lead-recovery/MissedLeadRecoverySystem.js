'use client';
import { useState } from 'react';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';

// v13: Capability vs status — what the system WOULD do vs what is currently live.
// CHANNELS represent the LEAD RECOVERY STATE MACHINE: connected channels surface real events; pending ones are documented but not yet deployed.
const CHANNELS = [
  {
    id: 'webhook',
    label: 'Form webhook',
    detail: 'A verified POST endpoint writes the enquiry into the recovery queue.',
    status: 'connected',
  },
  {
    id: 'owner-email',
    label: 'Owner email delivery',
    detail:
      'Controlled owner-email delivery is connected via a configured Resend worker.',
    status: 'connected',
  },
  {
    id: 'named-assignee',
    label: 'Named assignee routing',
    detail:
      'owner-session evidence remains incomplete. The named assignee is not yet implemented.',
    status: 'pending',
  },
];

const CAPABILITIES = [
  'Capture after-hours enquiry signals from a verified form endpoint.',
  'Queue the enquiry with the source, payload, and timestamp.',
  'Send a real owner-email reply using the configured Resend worker.',
  'Mark the enquiry as delivered once the worker reports success.',
];

const OUTCOMES = [
  'The operator gets a real, verified reply in the inbox they already read.',
  'Enquiry capture does not depend on any single human being awake.',
  'No fabricated benchmarks or fake response-time guarantees are published.',
];

export function MissedLeadRecoverySystem() {
  const [active, setActive] = useState('webhook');

  return (
    <main className="shell" aria-labelledby="ml-hero-heading">
      <section className="hero compact ml-hero">
        <span className="eyebrow">Systems / Missed Lead Recovery</span>
        <h1 id="ml-hero-heading">Missed Lead Recovery — capture the after-hours enquiry.</h1>
        <p className="reading-width">
          When a real form submission lands after hours, IronWake queues it and sends
          a real owner-email reply. The worker that sends the reply is configured.
          The named-assignee routing on top of it is not.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a Business Leak Audit</a>
          <a className="button ghost" href="#channels">See the channels</a>
          <a className="button ghost" href="/pricing">View pricing</a>
        </div>
      </section>

      <MotionReveal>
        <section className="section" aria-labelledby="ml-what-heading">
          <span className="eyebrow">What it does</span>
          <h2 id="ml-what-heading">Three channels, each with its own status.</h2>
          <p className="reading-width">
            Pick a channel to see what is wired today. The connected ones already run;
            the pending ones are documented but not yet deployed.
          </p>
          <div className="ml-channel-tabs" role="tablist" aria-label="Lead recovery channels">
            {CHANNELS.map((c) => {
              const id = c.id;
              return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-pressed={active === id}
                className={`ml-channel-tab ${active === id ? 'is-active' : ''} ${c.status === 'connected' ? 'is-connected' : 'is-pending'}`}
                onClick={() => setActive(id)}
              >
                {c.label}
              </button>
              );
            })}
          </div>
          <div className="ml-channel-display" id="channels" role="region" aria-live="polite">
            {CHANNELS.filter((c) => c.id === active).map((c) => (
              <article key={c.id} className="ml-channel-card">
                <span className="micro">{c.status}</span>
                <h3>{c.label}</h3>
                <p>{c.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="ml-how-heading">
          <span className="eyebrow">How it works</span>
          <h2 id="ml-how-heading">Capability versus status.</h2>
          <div className="ml-capability-grid" role="list">
            {CAPABILITIES.map((cap, i) => (
              <article key={cap} className="ml-capability" role="listitem">
                <span className="micro">0{i + 1} / capability</span>
                <h3>{cap}</h3>
                <p>Documented here so the audit can start from a clear target.</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="ml-outcomes-heading">
          <span className="eyebrow">Outcomes</span>
          <h2 id="ml-outcomes-heading">What changes for the operator.</h2>
          <ul className="ml-outcome-list">
            {OUTCOMES.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="ml-fit-heading">
          <span className="eyebrow">Industry fit</span>
          <h2 id="ml-fit-heading">Where this system is scoped.</h2>
          <div className="system-grid" role="list">
            <a className="system-card" href="/industries/home-services" role="listitem">
              <span className="micro">01 / home services</span>
              <h3>Home services</h3>
              <p>Missed-call recovery for HVAC, plumbing, and on-site trades.</p>
            </a>
            <a className="system-card" href="/industries/dental-clinics" role="listitem">
              <span className="micro">02 / dental clinics</span>
              <h3>Dental clinics</h3>
              <p>After-hours enquiry capture and the next-day follow-up path.</p>
            </a>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="ml-pricing-heading">
          <span className="eyebrow">Pricing reference</span>
          <h2 id="ml-pricing-heading">Engagement tier and next step.</h2>
          <PricingReference systemId="missed-lead-recovery" />
          <div className="hero-actions">
            <a className="button" href="/audit">Request a Business Leak Audit</a>
            <a className="button ghost" href="/pricing">View pricing</a>
          </div>
        </section>
      </MotionReveal>
    </main>
  );
}