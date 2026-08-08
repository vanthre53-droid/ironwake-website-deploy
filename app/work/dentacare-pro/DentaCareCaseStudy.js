'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';
import { StepPipeline } from '../../components/StepPipeline';

// ponytail: demonstration data — not from a real clinic
const intakeSteps = [
  { icon: '📞', label: 'Enquiry', desc: 'Form, phone, or walk-in' },
  { icon: '📋', label: 'Intake', desc: 'Validated record created' },
  { icon: '🔍', label: 'Review', desc: 'Staff reviews request' },
  { icon: '📅', label: 'Booking', desc: 'Request becomes slot' },
  { icon: '✅', label: 'Follow-up', desc: 'Next action tracked' },
];

const acceptanceTests = [
  { metric: 'Form completion', value: '<45s', note: 'Average time from open to submit' },
  { metric: 'Validation coverage', value: '100%', note: 'All required fields enforced client + server' },
  { metric: 'Spam trap', value: '0 false positives', note: 'Hidden field catches automated submissions' },
  { metric: 'Data persistence', value: 'Before notification', note: 'Record saved before any email/SMS attempt' },
];

export function DentaCareCaseStudy() {
  return <main className="shell case-study dentacare-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / DentaCare Intake</span>
      <span className="status-pill">DEMONSTRATION</span>
      <h1>Clinic intake that never loses a patient request.</h1>
      <p>DentaCare demonstrates a front-desk intake flow that captures every enquiry to a durable record, validates required fields, and turns requests into reviewed bookings — without a live clinic-management connection.</p>
    </section>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Intake flow</span>
        <h2>From enquiry to reviewed booking.</h2>
        <StepPipeline steps={intakeSteps} ariaLabel="DentaCare intake pipeline" />
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Interface demonstration</span>
        <h2>What the clinic dashboard shows.</h2>
        <div className="demo-dashboard">
          <div className="demo-header">
            <span className="micro">DEMONSTRATION — NOT A LIVE CLINIC</span>
            <span className="demo-status">Active intake: #DEN-2847</span>
          </div>
          <div className="demo-body">
            <div className="demo-field"><span>Patient</span><strong>A. Sharma</strong></div>
            <div className="demo-field"><span>Request type</span><strong>Root canal consultation</strong></div>
            <div className="demo-field"><span>Preferred window</span><strong>Tomorrow 2-4pm</strong></div>
            <div className="demo-field"><span>Status</span><strong className="demo-highlight">Awaiting review</strong></div>
            <div className="demo-intent">
              <span>Patient note</span>
              <p>"I've had persistent pain in my lower left molar for 3 days. It gets worse when I drink cold water. I'd like to see someone as soon as possible."</p>
            </div>
            <div className="demo-match">
              <span>Consent: <strong>✓ Given</strong></span>
              <span>Spam trap: <strong>Clean</strong></span>
            </div>
          </div>
        </div>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Acceptance tests</span>
        <h2>Designed performance benchmarks.</h2>
        <div className="acceptance-grid">
          {acceptanceTests.map(t => <div key={t.metric} className="acceptance-card">
            <span className="acceptance-value">{t.value}</span>
            <span className="acceptance-metric">{t.metric}</span>
            <span className="acceptance-note">{t.note}</span>
          </div>)}
        </div>
        <p className="acceptance-disclaimer">These are designed benchmarks from the demonstration architecture, not from a deployed clinic system.</p>
      </section>
    </MotionReveal>

    <section className="section disclosure">
      <div>
        <span className="eyebrow">What remains unproven</span>
        <h2>Known limitations.</h2>
        <p>No live clinic-management system is connected. Calendar integration, payment processing, and patient record management are not demonstrated. The intake form operates independently as a standalone workflow.</p>
      </div>
      <div className="disclosure-box">
        <span className="status-pill">AWAITING VERIFICATION</span> This project does not represent a client relationship. It demonstrates intake workflow architecture only — no clinical claims, no patient data beyond the form.
      </div>
    </section>

    <section className="section">
      <span className="eyebrow">Next step</span>
      <h2>Request a clinic intake review.</h2>
      <div className="hero-actions">
        <a className="button" href="/audit">Audit my clinic flow</a>
        <a className="button secondary" href="/work">Back to work</a>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
