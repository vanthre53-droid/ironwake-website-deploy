'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

// ponytail: demonstration data — not from a real studio
const consultSteps = [
  { icon: '💬', label: 'Request', desc: 'Client submits interest' },
  { icon: '📋', label: 'Logged', desc: 'Durable record created' },
  { icon: '👤', label: 'Owned', desc: 'Named follow-up assigned' },
  { icon: '⏰', label: 'Tracked', desc: 'Stale alerts if overdue' },
  { icon: '✅', label: 'Outcome', desc: 'Status visible to owner' },
];

const acceptanceTests = [
  { metric: 'Form friction', value: '<30s', note: 'Time from open to submit — 4 fields only' },
  { metric: 'Follow-up assignment', value: 'Instant', note: 'Named owner + due date on submission' },
  { metric: 'Stale alert', value: '24h default', note: 'Flagged if no response within target window' },
  { metric: 'Data minimization', value: '4 fields', note: 'Name, contact, interest, preferred timing' },
];

export function AtelierCaseStudy() {
  return <main className="shell case-study atelier-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / Atelier Safe</span>
      <span className="status-pill">DEMONSTRATION</span>
      <h1>Consultation interest that never cools off silently.</h1>
      <p>Atelier demonstrates a follow-up ownership system for salons and studios where consultation interest arrives through a simple form, gets assigned to a named person, and flags itself if no one responds within the target window.</p>
    </section>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Consultation flow</span>
        <h2>From interest to owned follow-up.</h2>
        <div className="signal-architecture">
          {consultSteps.map((s, i) => <div key={s.label} className="signal-step">
            <span className="signal-step-icon">{s.icon}</span>
            <span className="signal-step-label">{s.label}</span>
            <span className="signal-step-desc">{s.desc}</span>
            {i < consultSteps.length - 1 && <span className="signal-step-arrow" aria-hidden="true">→</span>}
          </div>)}
        </div>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Interface demonstration</span>
        <h2>What the studio dashboard shows.</h2>
        <div className="demo-dashboard">
          <div className="demo-header">
            <span className="micro">DEMONSTRATION — NOT A LIVE STUDIO</span>
            <span className="demo-status">Active request: #ATL-1042</span>
          </div>
          <div className="demo-body">
            <div className="demo-field"><span>Client</span><strong>P. Mehta</strong></div>
            <div className="demo-field"><span>Interest</span><strong>Bridal consultation</strong></div>
            <div className="demo-field"><span>Preferred window</span><strong>This weekend</strong></div>
            <div className="demo-field"><span>Status</span><strong className="demo-highlight">Follow-up due today</strong></div>
            <div className="demo-intent">
              <span>Client note</span>
              <p>"I'm getting married in March and looking for a complete bridal package. Would love to discuss options and pricing this weekend if possible."</p>
            </div>
            <div className="demo-match">
              <span>Owner: <strong>S. Kapoor</strong></span>
              <span>Due: <strong>Today 5pm</strong> ⚠️</span>
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
        <p className="acceptance-disclaimer">These are designed benchmarks from the demonstration architecture, not from a deployed studio system.</p>
      </section>
    </MotionReveal>

    <section className="section disclosure">
      <div>
        <span className="eyebrow">What remains unproven</span>
        <h2>Known limitations.</h2>
        <p>No live salon-management or calendar system is connected. Payment processing, stylist scheduling, and client history are not demonstrated. The consultation request operates as a standalone workflow.</p>
      </div>
      <div className="disclosure-box">
        <span className="status-pill">AWAITING VERIFICATION</span> This project does not represent a client relationship. It demonstrates follow-up ownership architecture only.
      </div>
    </section>

    <section className="section">
      <span className="eyebrow">Next step</span>
      <h2>Request a consultation flow review.</h2>
      <div className="hero-actions">
        <a className="button" href="/audit">Audit my follow-up flow</a>
        <a className="button secondary" href="/work">Back to work</a>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
