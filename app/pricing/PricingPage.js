'use client';

import { useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { MotionReveal } from '../components/MotionReveal';

// ponytail: canonical pricing from owner-approved offers. Lite/Standard/Pro per offer.
const offers = [
  {
    name: 'Business Leak Audit',
    desc: 'Written review identifying where your enquiry, booking, or follow-up process loses momentum.',
    cta: 'Book Diagnostic',
    india: ['₹799', '₹1,499', '₹2,999'],
    intl: ['$29', '$59', '$99'],
    tiers: ['Lite', 'Standard', 'Pro'],
    recommended: 'Standard',
  },
  {
    name: 'Missed Lead Recovery Setup',
    desc: 'Automated missed-call callback, instant email notifications, lead logging — no enquiry silently lost.',
    cta: 'Deploy System',
    india: ['₹2,200', '₹3,500', '₹5,999'],
    intl: ['$99', '$149', '$249'],
    tiers: ['Lite', 'Standard', 'Pro'],
    recommended: 'Standard',
  },
  {
    name: 'Booking Certainty Starter',
    desc: 'Separate booking requests from confirmed appointments. CRM, scheduling engine, lead nurture flows.',
    cta: 'Select System',
    india: ['₹12,999', '₹24,999', '₹39,999'],
    intl: ['$199', '$399', '$699'],
    tiers: ['Lite', 'Standard', 'Pro'],
    recommended: 'Pro',
  },
  {
    name: 'Trust + Lead Capture Starter',
    desc: 'Conversion-optimised service website with trust signals, lead capture, and owner attribution.',
    cta: 'Build Architecture',
    india: ['₹12,999', '₹18,999', '₹24,999'],
    intl: ['$499', '$899', '$1,499'],
    tiers: ['Lite', 'Standard', 'Pro'],
    recommended: 'Standard',
  },
  {
    name: 'AI Receptionist Starter',
    desc: '24/7 automated WhatsApp/Web AI agent trained on your specific business knowledge base.',
    cta: 'Configure Agent',
    india: ['₹29,999', '₹49,999', '₹79,999'],
    intl: ['$1,000', '$1,800', '$3,000'],
    tiers: ['Lite', 'Standard', 'Pro'],
    recommended: 'Pro',
  },
];

export default function PricingPage() {
  const [region, setRegion] = useState('india');

  return <main className="shell">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Pricing</span>
      <h1>Five systems. Three tiers each. No hidden costs.</h1>
      <p>Every engagement starts with a Business Leak Audit. Implementation fees cover architecture and logic deployment. Third-party provider costs (domain, hosting, WhatsApp API, AI compute) are billed directly by providers — IronWake never marks them up.</p>
      <div className="pricing-toggle">
        <button className={region === 'india' ? 'active' : ''} onClick={() => setRegion('india')}>India (₹)</button>
        <button className={region === 'intl' ? 'active' : ''} onClick={() => setRegion('intl')}>International ($)</button>
      </div>
    </section>

    <MotionReveal stagger><section className="section intro">
      <div className="pricing-offers">
        {offers.map((offer, idx) => {
          const prices = region === 'india' ? offer.india : offer.intl;
          return <article key={offer.name} className="pricing-offer">
            <div className="pricing-offer-header">
              <span className="micro">{String(idx + 1).padStart(2, '0')} / offer</span>
              <h3>{offer.name}</h3>
              <p className="pricing-desc">{offer.desc}</p>
            </div>
            <div className="pricing-tiers">
              {offer.tiers.map((tier, i) => <div key={tier} className={`pricing-tier${tier === offer.recommended ? ' recommended' : ''}`}>
                {tier === offer.recommended && <span className="pricing-badge">Popular</span>}
                <span className="pricing-tier-name">{tier}</span>
                <span className="pricing-amount">{prices[i]}</span>
                <a className={`button${tier === offer.recommended ? '' : ' secondary'}`} href="/audit">{offer.cta}</a>
              </div>)}
            </div>
          </article>;
        })}
      </div>
    </section></MotionReveal>

    <MotionReveal><section className="section">
      <span className="eyebrow">Selection guide</span>
      <h2>Which tier fits your business?</h2>
      <div className="pricing-guide">
        <article>
          <h3>Start with the Audit</h3>
          <p>Every engagement begins here. A written review of where your process loses momentum — no obligation, no pressure.</p>
        </article>
        <article>
          <h3>Stabilise first</h3>
          <p>If you miss more than 2 calls a day, Missed Lead Recovery stops the immediate bleed.</p>
        </article>
        <article>
          <h3>Then control</h3>
          <p>Once leads are captured, Booking Certainty or Trust + Lead Capture gives you ownership over the next step.</p>
        </article>
        <article>
          <h3>Scale with AI</h3>
          <p>When volume justifies it, the AI Receptionist qualifies and routes leads before they reach a human.</p>
        </article>
      </div>
    </section></MotionReveal>

    <MotionReveal><section className="section disclosure">
      <div>
        <span className="eyebrow">Cost transparency</span>
        <h3>What you pay and what you don't.</h3>
        <p>Implementation fees are one-time per system. Third-party provider costs (domain, hosting, WhatsApp API, AI compute) are billed directly by providers to your account. IronWake never marks up provider costs.</p>
      </div>
      <div className="disclosure-box">All prices are confirmed offer ranges. Final scope is confirmed after a Business Leak Audit. No work begins without written approval.</div>
    </section></MotionReveal>

    <SiteFooter />
  </main>;
}
