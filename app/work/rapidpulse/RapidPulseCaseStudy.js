'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

const steps = [
  { num: '01', title: 'Inquiry arrives', text: 'A call, form, or message comes in while the team is on a job. The system captures it to a durable record before anything else happens.' },
  { num: '02', title: 'Owner is named', text: 'The inquiry is assigned to a real person with a due date — not left in a shared inbox or group chat.' },
  { num: '03', title: 'Notification is queued', text: 'An outbox pattern ensures the notification attempt is retryable and logged. A dropped notification cannot erase the inquiry.' },
  { num: '04', title: 'Next action is visible', text: 'The dashboard shows exactly where each request stands: new, in-progress, or waiting. No guessing.' },
];

const features = [
  ['Durable capture', 'Every inquiry is written to the database before any notification runs. A failed SMS or email cannot lose the lead.'],
  ['Named ownership', 'Each request is assigned to a specific person with a due date. Shared-inbox ambiguity is eliminated.'],
  ['Outbox pattern', 'Notifications are queued and retried. The system logs what was sent, when, and whether it succeeded.'],
  ['Status visibility', 'The owner dashboard shows inquiry status, next action, and age at a glance. No manual status checking.'],
];

export function RapidPulseCaseStudy() {
  return <main className="shell case-study rapidpulse-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / RapidPulse Response</span>
      <h1>PORTFOLIO DEMONSTRATION — capability proof, not a client engagement.</h1>
      <p>An emergency-service workflow demonstration focused on inquiry-to-response ownership: who owns the next action once a request arrives, independent of any single channel.</p>
    </section>

    <MotionReveal>
      <section className="section intro">
        <article className="case-large">
          <div className="case-art" aria-label="Abstract local visual for the RapidPulse demonstration" role="img" />
          <div className="case-copy">
            <span className="micro">Portfolio demonstration</span>
            <h3>RapidPulse Response</h3>
            <p>Built to demonstrate durable-record and ownership handling for businesses that cannot afford to miss an urgent request.</p>
          </div>
        </article>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">How it works</span>
        <h2>Four steps from inquiry to resolution.</h2>
        <div className="journey-grid">
          {steps.map((s) => (
            <article key={s.num}>
              <span className="micro">{s.num} /</span>
              <h3>{s.title}</h3>
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
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </MotionReveal>

    <section className="section disclosure">
      <div>
        <span className="eyebrow">Proof status</span>
        <h3>What this demonstration does not claim.</h3>
        <p>No testimonial, metric, benchmark, or provider callback is attached to this work.</p>
      </div>
      <div className="disclosure-box">
        <span className="status-pill">Demonstration only</span> This project does not represent a client relationship or a measured business result. It does not integrate with a real telephony, dispatch, or CRM platform.
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
