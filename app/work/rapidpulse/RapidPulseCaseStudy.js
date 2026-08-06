'use client';

import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { MotionReveal } from '../../components/MotionReveal';

// ponytail: demonstration data — not from a real deployment
const signalSteps = [
  { icon: '📞', label: 'Inquiry', desc: 'Call, form, or message' },
  { icon: '📊', label: 'Qualification', desc: 'Intent classification' },
  { icon: '📍', label: 'Service area', desc: 'Geo-fence validation' },
  { icon: '🔥', label: 'Urgency', desc: 'Priority scoring' },
  { icon: '▶️', label: 'Dispatch', desc: 'Owner assignment' },
];

const acceptanceTests = [
  { metric: 'Intent precision', value: '99.92%', note: 'Differentiating "leaking faucet" from "basement flooding"' },
  { metric: 'Concurrent load', value: '50+ calls', note: 'Simultaneous with <200ms latency' },
  { metric: 'Geo-fencing', value: '300m boundary', note: 'Service area validation polygons' },
  { metric: 'Handover speed', value: '<500ms', note: 'Webhook to CRM delivery' },
];

export function RapidPulseCaseStudy() {
  return <main className="shell case-study rapidpulse-case">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Work / RapidPulse Response</span>
      <span className="status-pill">DEMONSTRATION</span>
      <h1>The sub-60-second dispatch benchmark.</h1>
      <p>RapidPulse demonstrates a structural collapse of the inquiry-to-dispatch window from 10 minutes to under 60 seconds using parallelized qualification agents. This is a designed concept, not a client engagement.</p>
    </section>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Signal architecture</span>
        <h2>End-to-end flow.</h2>
        <div className="signal-architecture">
          {signalSteps.map((s, i) => <div key={s.label} className="signal-step">
            <span className="signal-step-icon">{s.icon}</span>
            <span className="signal-step-label">{s.label}</span>
            <span className="signal-step-desc">{s.desc}</span>
            {i < signalSteps.length - 1 && <span className="signal-step-arrow" aria-hidden="true">→</span>}
          </div>)}
        </div>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Interface demonstration</span>
        <h2>What the dispatch dashboard shows.</h2>
        <div className="demo-dashboard">
          <div className="demo-header">
            <span className="micro">DEMONSTRATION — NOT A LIVE SYSTEM</span>
            <span className="demo-status">Active dispatch node: #90210-A</span>
          </div>
          <div className="demo-body">
            <div className="demo-field"><span>Location</span><strong>90210 Beverly Hills</strong></div>
            <div className="demo-field"><span>Signal source</span><strong>VoIP Trunk 1</strong></div>
            <div className="demo-field"><span>Estimated response</span><strong className="demo-highlight">18.4s</strong></div>
            <div className="demo-intent">
              <span>Caller intent</span>
              <p>"Water heater is leaking actively in the basement. It's flooding quickly. Need someone now."</p>
            </div>
            <div className="demo-match">
              <span>Entity match: <strong>Emergency Leak</strong></span>
              <span>Priority score: <strong>0.98 / 1.00</strong> ✓</span>
            </div>
          </div>
        </div>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">System stack</span>
        <h2>Technical architecture.</h2>
        <div className="stack-grid">
          <div className="stack-card">
            <span className="micro">Primary core</span>
            <p>MiMo 2.5 Pro (parallel agents)</p>
          </div>
          <div className="stack-card">
            <span className="micro">Inference cost</span>
            <p>~$0.08–0.14 per dispatch</p>
          </div>
          <div className="stack-card">
            <span className="micro">Infrastructure</span>
            <p>Edge Functions / Netlify</p>
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
        <p className="acceptance-disclaimer">These are designed benchmarks from the demonstration architecture, not from a deployed system.</p>
      </section>
    </MotionReveal>

    <section className="section disclosure">
      <div>
        <span className="eyebrow">What remains unproven</span>
        <h2>Known limitations.</h2>
        <p>While the dispatch logic is validated in demonstration, downstream operations — technician arrival, job completion, payment collection — are not yet demonstrated. The live WhatsApp API integration is pending provider verification.</p>
      </div>
      <div className="disclosure-box">
        <span className="status-pill">AWAITING VERIFICATION</span> This project does not represent a client relationship or a measured business result. It demonstrates system architecture and workflow logic only.
      </div>
    </section>

    <section className="section">
      <span className="eyebrow">Next step</span>
      <h2>See more demonstrations or request a review.</h2>
      <div className="hero-actions">
        <a className="button" href="/audit">Audit my dispatch flow</a>
        <a className="button secondary" href="/work">Back to work</a>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
