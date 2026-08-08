'use client';

import Link from 'next/link';

// ponytail: canonical pricing reference for system pages. Single source of truth mirrors app/pricing/PricingPage.js offers[].india[0]/intl[0] = Lite tier.
export const OFFER_TIERS = {
  'missed-lead-recovery': { name: 'Missed Lead Recovery Setup', indiaLite: '₹2,200', intlLite: '$99', offerSlug: 'missed-lead-recovery-setup' },
  'booking-control': { name: 'Booking Certainty Starter', indiaLite: '₹12,999', intlLite: '$199', offerSlug: 'booking-certainty-starter' },
  'trust-lead-capture': { name: 'Trust + Lead Capture Starter', indiaLite: '₹12,999', intlLite: '$499', offerSlug: 'trust-lead-capture-starter' },
  'ai-receptionist': { name: 'AI Receptionist Starter', indiaLite: '₹29,999', intlLite: '$1,000', offerSlug: 'ai-receptionist-starter' },
};

export function PricingReference({ offerId }) {
  const offer = OFFER_TIERS[offerId];
  if (!offer) return null;
  return (
    <section className="section pricing-reference" aria-label={`Pricing for ${offer.name}`}>
      <span className="eyebrow">Canonical offer</span>
      <h3>{offer.name}</h3>
      <p className="pricing-reference-lead">Lite tier implementation fee:</p>
      <div className="pricing-reference-grid">
        <div><span className="micro">India</span><strong>{offer.indiaLite}</strong></div>
        <div><span className="micro">International</span><strong>{offer.intlLite}</strong></div>
      </div>
      <p className="pricing-reference-note">Lite covers the agreed architecture. Standard and Pro add depth, integrations, and verified provider setup. Domain, hosting, AI compute, phone numbers, messaging, and calendar provider costs are billed directly by their providers and are never marked up by IronWake.</p>
      <div className="hero-actions">
        <Link className="button" href="/pricing">See all five offers</Link>
        <Link className="button secondary" href="/audit">Start with the audit</Link>
      </div>
    </section>
  );
}
