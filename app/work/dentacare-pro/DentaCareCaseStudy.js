'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

const steps = [
  { num: '01', title: 'Patient enquiry', text: 'A form, phone call, or walk-in request arrives. The system captures it with validated fields before the front desk moves to the next task.' },
  { num: '02', title: 'Intake record', text: 'The submission is written to a durable database record with consent, source, and timestamp. No data is lost if the next step fails.' },
  { num: '03', title: 'Booking request', text: 'The intake becomes a reviewed booking request — not a confirmed slot. A staff member reviews and confirms before any calendar is updated.' },
  { num: '04', title: 'Follow-up tracked', text: 'The dashboard shows every request with its status and next action. Overdue follow-ups are visible without checking a separate system.' },
];

const features = [
  ['Validated intake', 'Required fields, consent checkbox, and a hidden spam trap ensure only real, consented requests enter the system.'],
  ['Request-only booking', 'Until a calendar provider is connected, every booking is a reviewed request — never a false confirmation.'],
  ['Durable record', 'The intake is persisted before any notification or calendar attempt. A failed integration cannot erase the request.'],
  ['Privacy-first', 'No patient data is stored beyond what the intake form collects. No clinical claims are made. No admin credentials reach the browser.'],
];

export function DentaCareCaseStudy() {
  return <main className="shell case-study dentacare-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / DentaCare Intake</span>
      <h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1>
      <p>A clinic-style front-desk intake demonstration covering the handoff from an enquiry form to a reviewed booking request, with no live clinic-management connection and no clinical claim of any kind.</p>
    </section>

    <MotionReveal>
      <section className="section intro">
        <article className="case-large">
          <div className="case-art" aria-label="Abstract local visual for the DentaCare demonstration" role="img" />
          <div className="case-copy">
            <span className="micro">Portfolio demonstration</span>
            <h2>DentaCare Intake</h2>
            <p>Built to demonstrate reception-flow handling for clinics that juggle phone calls, walk-ins, and online requests at the same time.</p>
          </div>
        </article>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">How it works</span>
        <h2>Four steps from enquiry to reviewed booking.</h2>
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
        <p>No testimonial, metric, benchmark, or provider callback is attached to this work, and no clinical or compliance claim is made anywhere on this page.</p>
      </div>
      <div className="disclosure-box">
        <span className="status-pill">Demonstration only</span> This project does not represent a client relationship or a measured business result. It does not connect to any real clinic-management, scheduling, or patient-record system.
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
