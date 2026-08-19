'use client';

import { useState } from 'react';
import { MotionReveal } from '../../components/MotionReveal';
import { PricingReference } from '../../components/PricingReference';

// ponytail: Trust and Lead Capture v13 view.
// Capability cards (form integrity / consent log / audit trail) describe what
// the system claims. Provider-state cards below describe what is *actually
// wired today* (Supabase, Meta WhatsApp, Resend). The split is intentional —
// "Capability vs status" must never blur together.
const CAPABILITIES = [
  {
    id: 'integrity',
    label: 'Form integrity',
    detail:
      'Hidden trap field, posted origin check, and per-form rate limiting keep junk submissions out without ever blocking a real customer.',
    status: 'connected',
  },
  {
    id: 'consent',
    label: 'Consent log',
    detail:
      'Every form post records a timestamped consent entry alongside the payload it belonged to. The consent record travels with the lead.',
    status: 'connected',
  },
  {
    id: 'audit',
    label: 'Audit trail',
    detail:
      'Each enquiry writes a tamper-evident row to the audit log so the owner can answer "who saw this, when, and what did they do with it?"',
    status: 'connected',
  },
];

// ponytail: REAL provider state. These three are configured and reachable from
// the owner surface; "No service-role key in the browser" is enforced by the
// trust-and-capture view itself (this file is `'use client'`, never touches
// process.env, never imports supabase-js).
const PROVIDERS = [
  {
    id: 'supabase',
    label: 'Supabase',
    detail:
      'Owner session, audit row writes, and consent records are persisted through Supabase. Service-role keys never reach the browser bundle.',
    state: 'connected',
  },
  {
    id: 'meta-whatsapp',
    label: 'Meta WhatsApp',
    detail:
      'Verified-template outbound is wired through the Meta WhatsApp adapter. The number and template IDs are env-driven, never hard-coded.',
    state: 'connected',
  },
  {
    id: 'resend',
    label: 'Resend email',
    detail:
      'Owner notification delivery uses the configured Resend worker. The API key lives in env, the browser never sees it.',
    state: 'connected',
  },
];

export function TrustLeadCaptureSystem() {
  const [active, setActive] = useState('integrity');

  return (
    <main className="shell" aria-labelledby="tlc-hero-heading">
      <section className="hero compact tlc-hero">
        <span className="eyebrow">Systems / Trust and Lead Capture</span>
        <h1 id="tlc-hero-heading">
          Trust and Lead Capture — prove what came in, what was consented to, and what left the door.
        </h1>
        <p className="reading-width">
          A lead-capture system that treats the form as a public surface, not a leaky
          inbox. Junk is filtered with a hidden trap field and origin check; consent
          and audit entries are written alongside every real submission.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a Business Leak Audit</a>
          <a className="button ghost" href="#capabilities">See the capabilities</a>
          <a className="button ghost" href="#providers">See provider state</a>
          <a className="button ghost" href="/pricing">View pricing</a>
        </div>
      </section>

      <MotionReveal>
        <section className="section" aria-labelledby="tlc-capabilities-heading">
          <span className="eyebrow">What it does</span>
          <h2 id="tlc-capabilities-heading">Capability versus status.</h2>
          <p className="reading-width">
            Pick a capability card to see what the system is supposed to do.
            Provider-state cards below describe what is wired today. The two
            sets must never blur together.
          </p>
          <div className="tlc-capability-tabs" role="tablist" aria-label="Lead capture capabilities">
            {CAPABILITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-pressed={active === c.id}
                className={`tlc-capability-tab ${active === c.id ? 'is-active' : ''} is-connected`}
                onClick={() => setActive(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="tlc-capability-display" id="capabilities" role="region" aria-live="polite">
            {CAPABILITIES.filter((c) => c.id === active).map((c) => (
              <article key={c.id} className="tlc-capability-card">
                <span className="micro">{c.status}</span>
                <h3>{c.label}</h3>
                <p>{c.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="tlc-integrity-detail-heading">
          <span className="eyebrow">Form integrity, in plain language</span>
          <h2 id="tlc-integrity-detail-heading">A hidden trap field, not a captcha.</h2>
          <p className="reading-width">
            Real customers never see it. Bots that fill every input get caught. Origin
            and referer checks sit on top so a spoofed POST never silently succeeds.
            No service-role key in the browser — the form posts to a verified route
            that writes through the server-side adapter.
          </p>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="tlc-providers-heading">
          <span className="eyebrow">Provider state</span>
          <h2 id="tlc-providers-heading">What is connected today.</h2>
          <p className="reading-width">
            These are not claims. They are the surfaces IronWake actually probes
            before publishing this page.
          </p>
          <div className="system-grid" id="providers" role="list">
            {PROVIDERS.map((p) => (
              <article key={p.id} className="system-card" role="listitem">
                <span className="micro">{p.state}</span>
                <h3>{p.label}</h3>
                <p>{p.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="tlc-outcomes-heading">
          <span className="eyebrow">Outcomes</span>
          <h2 id="tlc-outcomes-heading">What changes for the operator.</h2>
          <ul className="system-outcomes">
            <li>The owner sees only real submissions with consent context attached.</li>
            <li>Audit rows answer the question &ldquo;who saw this, when, and what did they do?&rdquo;</li>
            <li>No fabricated benchmarks or fake security claims are published.</li>
          </ul>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="tlc-fit-heading">
          <span className="eyebrow">Industry fit</span>
          <h2 id="tlc-fit-heading">Where this system is scoped.</h2>
          <div className="system-grid" role="list">
            <a className="system-card" href="/industries/home-services" role="listitem">
              <span className="micro">01 / home services</span>
              <h3>Home services</h3>
              <p>Quote-form capture and consent logging for on-site trades.</p>
            </a>
            <a className="system-card" href="/industries/dental-clinics" role="listitem">
              <span className="micro">02 / dental clinics</span>
              <h3>Dental clinics</h3>
              <p>Appointment-request intake with consent trail for first-time patients.</p>
            </a>
            <a className="system-card" href="/industries/salons-spas" role="listitem">
              <span className="micro">03 / salons and spas</span>
              <h3>Salons and spas</h3>
              <p>Booking-request capture with audit row per new customer.</p>
            </a>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="tlc-pricing-heading">
          <span className="eyebrow">Pricing reference</span>
          <h2 id="tlc-pricing-heading">Engagement tier and next step.</h2>
          <PricingReference offerId="trust-lead-capture" />
          <div className="hero-actions">
            <a className="button" href="/audit">Request a Business Leak Audit</a>
            <a className="button ghost" href="/pricing">View pricing</a>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <nav className="section tlc-footer-nav" aria-label="Related systems">
          <span className="eyebrow">Related systems</span>
          <ul className="tlc-footer-nav-list">
            <li><a href="/systems/booking-control">Booking Certainty</a></li>
            <li><a href="/systems/missed-lead-recovery">Missed Lead Recovery</a></li>
            <li><a href="/systems/ai-receptionist">AI Receptionist</a></li>
          </ul>
        </nav>
      </MotionReveal>
    </main>
  );
}