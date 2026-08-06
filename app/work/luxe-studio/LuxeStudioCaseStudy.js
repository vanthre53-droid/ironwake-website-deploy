'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

const steps = [
  { num: '01', title: 'Appointment request', text: 'A visitor submits a booking request, capturing their preferred date, party size, and contact details.' },
  { num: '02', title: 'Request logged', text: 'The submission is written to a durable record with consent and source. A follow-up is assigned to a named host.' },
  { num: '03', title: 'Host notified', text: 'The assigned host receives the request with context. The system tracks who is responsible and when the confirmation is due.' },
  { num: '04', title: 'Outcome visible', text: 'The dashboard shows every request with its status. Stale requests surface automatically so no booking opportunity is lost.' },
];

const features = [
  ['Appointment capture', 'A focused form captures preferred date, party size, and contact details — nothing more. No over-collection.'],
  ['Host ownership', 'Every request is assigned to a named host. The dashboard shows who owns what and when it is due.'],
  ['Stale-request alerts', 'Requests without a response within the target window are flagged. No booking opportunity goes cold silently.'],
  ['No false bookings', 'Until a calendar provider is connected, this is a request-only flow. No appointment is confirmed without human review.'],
];

export function LuxeStudioCaseStudy() {
  // ponytail: template reused from Atelier; unique content per project, not per function
  return <main className="shell case-study luxe-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / Luxe Studio</span>
      <h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1>
      <p>A booking and studio-system demonstration for experience-led businesses, covering appointment capture and follow-up ownership with no implied booking-provider connection.</p>
    </section>

    <MotionReveal>
      <section className="section intro">
        <article className="case-large">
          <div className="case-art" aria-label="Abstract local visual for the Luxe Studio demonstration" role="img" />
          <div className="case-copy">
            <span className="micro">Portfolio demonstration</span>
            <h2>Luxe Studio</h2>
            <p>Built to demonstrate appointment capture and follow-up ownership for studios, tasting rooms, and experience-led businesses.</p>
          </div>
        </article>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">How it works</span>
        <h2>Four steps from interest to owned appointment.</h2>
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
