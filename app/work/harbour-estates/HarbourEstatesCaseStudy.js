'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

const steps = [
  { num: '01', title: 'Property inquiry', text: 'A visitor submits an inquiry about a listing, capturing their contact details, budget range, and preferred viewing times.' },
  { num: '02', title: 'Inquiry logged', text: 'The submission is written to a durable record with consent and source. A viewing follow-up is assigned to a named agent.' },
  { num: '03', title: 'Agent notified', text: 'The assigned agent receives the inquiry with context. The system tracks who is responsible and when the follow-up is due.' },
  { num: '04', title: 'Outcome visible', text: 'The dashboard shows every inquiry with its status. Stale inquiries surface automatically so no prospect is ignored.' },
];

const features = [
  ['Listing inquiry capture', 'A focused form captures interest, budget range, and preferred viewing times — nothing more. No over-collection.'],
  ['Agent ownership', 'Every inquiry is assigned to a named agent. The dashboard shows who owns what and when it is due.'],
  ['Stale-inquiry alerts', 'Inquiries without a response within the target window are flagged. No prospect goes cold silently.'],
  ['No false bookings', 'Until a calendar provider is connected, this is a request-only flow. No viewing is confirmed without human review.'],
];

export function HarbourEstatesCaseStudy() {
  // ponytail: template reused from Atelier; unique content per project, not per function
  return <main className="shell case-study harbour-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / Harbour Estates</span>
      <h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1>
      <p>A property-inquiry routing demonstration for real-estate agencies, covering lead capture and viewing-request ownership with no implied CRM or portal integration.</p>
    </section>

    <MotionReveal>
      <section className="section intro">
        <article className="case-large">
          <div className="case-art" aria-label="Abstract local visual for the Harbour Estates demonstration" role="img" />
          <div className="case-copy">
            <span className="micro">Portfolio demonstration</span>
            <h2>Harbour Estates</h2>
            <p>Built to demonstrate property-inquiry capture and viewing-request ownership for estate agents and property businesses.</p>
          </div>
        </article>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">How it works</span>
        <h2>Four steps from inquiry to owned viewing.</h2>
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
