'use client';

import Link from 'next/link';
import { getPricingOffer, litePrice } from '../../lib/pricing.mjs';

export function PricingReference({ offerId }) {
  const offer = getPricingOffer(offerId);
  if (!offer) return null;
  return (
    <section className="section pricing-reference" aria-label={`Pricing for ${offer.name}`}>
      <span className="eyebrow">Canonical offer</span>
      <h3>{offer.name}</h3>
      <p className="pricing-reference-lead">Lite tier implementation fee:</p>
      <div className="pricing-reference-grid">
        <div><span className="micro">India</span><strong>{litePrice(offerId, 'india')}</strong></div>
        <div><span className="micro">International</span><strong>{litePrice(offerId, 'intl')}</strong></div>
      </div>
      <p className="pricing-reference-note">Lite covers the agreed architecture. Standard and Pro add depth, integrations, and verified provider setup. Domain, hosting, AI compute, phone numbers, messaging, and calendar provider costs are billed directly by their providers and are never marked up by IronWake.</p>
      <div className="hero-actions">
        <Link className="button" href="/pricing">See all five offers</Link>
        <Link className="button secondary" href="/audit">Start with the audit</Link>
      </div>
    </section>
  );
}
