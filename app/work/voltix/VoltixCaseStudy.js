'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

const steps = [
  { num: '01', title: 'Quote request', text: 'A visitor submits a quote or support request, capturing their product interest, urgency, and contact details.' },
  { num: '02', title: 'Request logged', text: 'The submission is written to a durable record with consent and source. A follow-up is assigned to a named specialist.' },
  { num: '03', title: 'Specialist notified', text: 'The assigned specialist receives the request with context. The system tracks who is responsible and when the follow-up is due.' },
  { num: '04', title: 'Outcome visible', text: 'The dashboard shows every request with its status. Stale requests surface automatically so no inquiry is lost.' },
];

const features = [
  ['Quote capture', 'A focused form captures product interest, urgency, and contact details — nothing more. No over-collection.'],
  ['Specialist ownership', 'Every request is assigned to a named specialist. The dashboard shows who owns what and when it is due.'],
  ['Stale-request alerts', 'Requests without a response within the target window are flagged. No inquiry goes cold silently.'],
  ['No false commitments', 'Until a CRM or support platform is connected, this is a request-only flow. No quote is confirmed without human review.'],
];

export function VoltixCaseStudy() {
  // ponytail: template reused from Atelier; unique content per project, not per function
  return <main className="shell case-study voltix-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / Voltix</span>
      <h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1>
      <p>An electronics quote and support-request demonstration for tech businesses, covering inquiry capture and follow-up ownership with no implied CRM or support-platform integration.</p>
    </section>

    <MotionReveal>
      <section className="section intro">
        <article className="case-large">
          <div className="case-art" aria-label="Abstract local visual for the Voltix demonstration" role="img" />
          <div className="case-copy">
            <span className="micro">Portfolio demonstration</span>
            <h2>Voltix</h2>
            <p>Built to demonstrate quote-request and support-inquiry capture and follow-up ownership for electronics and tech businesses.</p>
          </div>
        </article>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">How it works</span>
        <h2>Four steps from inquiry to owned follow-up.</h2>
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
