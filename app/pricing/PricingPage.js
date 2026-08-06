'use client';

import { useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export const metadata = {
  title: 'Pricing — IronWake',
  description: 'IronWake pricing for India and international service businesses. Outcome-based tiers for lead recovery, booking control, and AI reception.'
};

const indiaPricing = [
  { code: 'RECOVERY / 01', name: 'Free Lead Leak Check', price: '₹0', desc: 'Audit your existing CRM and response times to find hidden lost revenue.', cta: 'Request Audit', highlight: false },
  { code: 'RECOVERY / 02', name: 'Missed Lead Recovery Fix', price: '₹3.5k', range: ' - 6k', desc: 'Automated missed-call SMS back, instant email notifications, lead logging script.', cta: 'Deploy System', highlight: false },
  { code: 'PRESENCE / 03', name: 'Trust + Lead Website', price: '₹15k', range: ' - 25k', desc: 'High-intent service providers needing a conversion-optimized technical front.', cta: 'Build Architecture', highlight: false },
  { code: 'CONTROL / 04', name: 'Booking + Control System', price: '₹30k', range: ' - 40k', desc: 'Full end-to-end CRM setup, automated scheduling engine, payment integration (UPI/Cards), lead nurture flows.', cta: 'Select System', highlight: true },
  { code: 'INTELLIGENCE / 05', name: 'AI Receptionist Starter', price: '₹50k', range: ' - 80k', desc: '24/7 automated WhatsApp/Web AI agent trained on your specific business knowledge base.', cta: 'Configure Agent', highlight: false },
  { code: 'SUSTENANCE / 06', name: 'System Care Plan', price: '₹6k', range: ' - 15k/mo', desc: 'Monthly logic audits, priority technical support, minor system adjustments.', cta: 'Join Care Plan', highlight: false },
];

const intlPricing = [
  { code: 'RECOVERY / 01', name: 'Free Lead Leak Check', price: '$0', desc: 'Audit your existing CRM and response times to find hidden lost revenue.', cta: 'Request Audit', highlight: false },
  { code: 'RECOVERY / 02', name: 'Missed Lead Recovery', price: '$49', range: ' - 99', desc: 'Automated missed-call SMS back, instant email notifications, lead logging script.', cta: 'Deploy System', highlight: false },
  { code: 'PRESENCE / 03', name: 'Trust + Lead Website', price: '$149', range: ' - 249', desc: 'High-intent service providers needing a conversion-optimized technical front.', cta: 'Build Architecture', highlight: false },
  { code: 'CONTROL / 04', name: 'Booking + Control', price: '$499', range: ' - 899', desc: 'Full end-to-end CRM setup, automated scheduling engine, payment integration, lead nurture flows.', cta: 'Select System', highlight: true },
  { code: 'INTELLIGENCE / 05', name: 'AI Receptionist', price: '$899', range: ' - 1.5k', desc: '24/7 automated WhatsApp/Web AI agent trained on your specific business knowledge base.', cta: 'Configure Agent', highlight: false },
  { code: 'SUSTENANCE / 06', name: 'System Care Plan', price: '$199', range: ' - 599/mo', desc: 'Monthly logic audits, priority technical support, minor system adjustments.', cta: 'Join Care Plan', highlight: false },
];

export default function PricingPage() {
  const [region, setRegion] = useState('india');
  const tiers = region === 'india' ? indiaPricing : intlPricing;

  return <main className="shell">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Engagement & pricing</span>
      <h1>Outcome-based tiers for service businesses.</h1>
      <p>Implementation fees cover architecture setup and logic deployment. Third-party operational costs (domain, hosting, WhatsApp API, AI compute) are billed directly by providers for transparency.</p>
      <div className="pricing-toggle">
        <button className={region === 'india' ? 'active' : ''} onClick={() => setRegion('india')}>India pricing</button>
        <button className={region === 'intl' ? 'active' : ''} onClick={() => setRegion('intl')}>International pricing</button>
      </div>
    </section>

    <section className="section intro">
      <div className="pricing-grid">
        {tiers.map(t => <article key={t.code} className={`pricing-card${t.highlight ? ' recommended' : ''}`}>
          {t.highlight && <span className="pricing-badge">Recommended</span>}
          <span className="micro">{t.code}</span>
          <h3>{t.name}</h3>
          <p className="pricing-amount">{t.price}{t.range && <span className="pricing-range">{t.range}</span>}</p>
          <p className="pricing-desc">{t.desc}</p>
          <a className={`button${t.highlight ? '' : ' secondary'}`} href="/audit">{t.cta}</a>
        </article>)}
      </div>
    </section>

    <section className="section">
      <span className="eyebrow">Selection guide</span>
      <h2>Which tier fits your business?</h2>
      <div className="pricing-guide">
        <article>
          <h3>Phase 1: Stabilization</h3>
          <p className="pricing-volume">Less than 20 leads/month</p>
          <p>Stop the immediate bleed. If you miss more than 2 calls a day, start with Missed Lead Recovery.</p>
        </article>
        <article>
          <h3>Phase 2: Efficiency</h3>
          <p className="pricing-volume">20-100 leads/month</p>
          <p>Automate manual data entry and back-and-forth scheduling with Booking + Control.</p>
        </article>
        <article>
          <h3>Phase 3: Scale</h3>
          <p className="pricing-volume">Over 100 leads/month</p>
          <p>Deploy AI agents to qualify and route leads before they reach a human operator.</p>
        </article>
        <article>
          <h3>Continuity</h3>
          <p className="pricing-volume">Ongoing maintenance</p>
          <p>Software updates daily. The Care Plan ensures your business logic stays working as APIs change.</p>
        </article>
      </div>
    </section>

    <section className="section disclosure">
      <div>
        <span className="eyebrow">Cost transparency</span>
        <h3>What you pay and what you don't.</h3>
        <p>Implementation fees are one-time. Third-party provider costs (domain, hosting, WhatsApp API, AI compute minutes) are billed directly by the providers to your account. IronWake never marks up provider costs.</p>
      </div>
      <div className="disclosure-box">All prices are indicative ranges. Final scope and pricing are confirmed after a Business Leak Audit. No work begins without written approval.</div>
    </section>

    <SiteFooter />
  </main>;
}
