'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

const steps = [
  { num: '01', title: 'Repair intake', text: 'A customer submits a repair request, capturing their device details, issue description, and contact details.' },
  { num: '02', title: 'Intake logged', text: 'The submission is written to a durable record with consent and source. A follow-up is assigned to a named technician.' },
  { num: '03', title: 'Technician notified', text: 'The assigned technician receives the intake with context. The system tracks who is responsible and when the diagnosis is due.' },
  { num: '04', title: 'Outcome visible', text: 'The dashboard shows every intake with its status. Stale intakes surface automatically so no repair request is lost.' },
];

const features = [
  ['Repair intake capture', 'A focused form captures device details, issue description, and contact details — nothing more. No over-collection.'],
  ['Technician ownership', 'Every intake is assigned to a named technician. The dashboard shows who owns what and when it is due.'],
  ['Stale-intake alerts', 'Intakes without a response within the target window are flagged. No repair request goes cold silently.'],
  ['No false commitments', 'Until a repair-platform provider is connected, this is a request-only flow. No repair is confirmed without human review.'],
];

export function RetechCaseStudy() {
  // ponytail: template reused from Atelier; unique content per project, not per function
  return <main className="shell case-study retech-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / RE-TECH</span>
      <h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1>
      <p>A repair intake and tracking demonstration for service businesses, covering request capture and follow-up ownership with no implied repair-platform integration.</p>
    </section>

    <MotionReveal>
      <section className="section intro">
        <article className="case-large">
          <div className="case-art" aria-label="Abstract local visual for the RE-TECH demonstration" role="img" />
          <div className="case-copy">
            <span className="micro">Portfolio demonstration</span>
            <h2>RE-TECH</h2>
            <p>Built to demonstrate repair-intake capture and follow-up ownership for repair shops and service businesses.</p>
          </div>
        </article>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">How it works</span>
        <h2>Four steps from intake to owned repair.</h2>
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
