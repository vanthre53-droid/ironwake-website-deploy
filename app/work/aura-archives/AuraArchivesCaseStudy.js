'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

const steps = [
  { num: '01', title: 'Bespoke inquiry', text: 'A visitor submits an inquiry about a custom piece or collection, capturing their interest, occasion, and contact details.' },
  { num: '02', title: 'Inquiry logged', text: 'The submission is written to a durable record with consent and source. A consultation follow-up is assigned to a named advisor.' },
  { num: '03', title: 'Advisor notified', text: 'The assigned advisor receives the inquiry with context. The system tracks who is responsible and when the follow-up is due.' },
  { num: '04', title: 'Outcome visible', text: 'The dashboard shows every inquiry with its status. Stale inquiries surface automatically so no high-value lead is lost.' },
];

const features = [
  ['Bespoke inquiry capture', 'A focused form captures interest, occasion, and contact details — nothing more. No over-collection.'],
  ['Advisor ownership', 'Every inquiry is assigned to a named advisor. The dashboard shows who owns what and when it is due.'],
  ['Stale-inquiry alerts', 'Inquiries without a response within the target window are flagged. No high-value lead goes cold silently.'],
  ['No false commitments', 'Until an inventory or CRM provider is connected, this is a request-only flow. No purchase is confirmed without human review.'],
];

export function AuraArchivesCaseStudy() {
  // ponytail: template reused from Atelier; unique content per project, not per function
  return <main className="shell case-study aura-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / Aura Archives</span>
      <h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1>
      <p>A luxury-jewelry inquiry demonstration for high-value retail, covering bespoke-request capture and consultation ownership with no implied inventory or payment integration.</p>
    </section>

    <MotionReveal>
      <section className="section intro">
        <article className="case-large">
          <div className="case-art" aria-label="Abstract local visual for the Aura Archives demonstration" role="img" />
          <div className="case-copy">
            <span className="micro">Portfolio demonstration</span>
            <h2>Aura Archives</h2>
            <p>Built to demonstrate bespoke-inquiry capture and consultation ownership for luxury retail and high-value product businesses.</p>
          </div>
        </article>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">How it works</span>
        <h2>Four steps from interest to owned consultation.</h2>
        <div className="journey-grid">
          {steps.map((s) => (
            <article key={s.num}>
              <span className="micro">{s.num} /</span>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Key capabilities</span>
        <h2>What this system demonstrates.</h2>
        <div className="system-grid">
          {features.map(([title, text]) => (
            <article className="system-card" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </MotionReveal>

    <section className="section disclosure">
      <div>
        <span className="eyebrow">Proof status</span>
        <h2>What this demonstration does not claim.</h2>
        <p>No testimonial, metric, benchmark, or provider callback is attached to this work.</p>
      </div>
      <div className="disclosure-box">
        <span className="status-pill">Demonstration only</span> This project does not represent a client relationship or a measured business result. It does not connect to a live booking calendar, payment system, or inventory platform.
      </div>
    </section>

    <section className="section">
      <span className="eyebrow">Next step</span>
      <h2>See more demonstrations or request a review.</h2>
      <div className="hero-actions">
        <a className="button" href="/work">Back to work</a>
        <a className="button secondary" href="/audit">Request a Business Leak Audit</a>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
