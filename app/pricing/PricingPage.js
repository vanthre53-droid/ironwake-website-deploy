import Link from 'next/link';
import { PRICING_OFFERS, PRICING_TIERS } from '../../lib/pricing.mjs';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { AuditForm } from '../audit/AuditForm';

// Tier clarity — short, declarative descriptions of what each tier includes.
// These are derived directly from the canonical offer matrix (lib/pricing.mjs)
// and do not introduce new pricing, claims, or urgency.
const TIER_CLARITY = Object.freeze({
  Lite: 'Single deliverable. The diagnostic or the first launch.',
  Standard: 'Core system plus one integration. Recommended for most starting points.',
  Pro: 'Multi-step build with custom workflow and a documented operational review.',
});

const TIER_PILLAR = Object.freeze({
  Lite: 'Scope',
  Standard: 'Recommended',
  Pro: 'Build',
});

const FAQS = Object.freeze([
  {
    q: 'What is the difference between Lite, Standard, and Pro?',
    a: 'Lite delivers a single artefact — the Business Leak Audit or one focused launch. Standard adds a primary integration or workflow alongside the core system. Pro is a multi-step build with custom workflow and a documented operational review. Each offer lists its recommended tier on the card.',
  },
  {
    q: 'Why does the same offer show different prices in India and International?',
    a: 'The toggle reflects the cost of delivering each offer in the buyer’s market — local labour, infrastructure, and provider costs. The offer itself is the same scope; the price is regional.',
  },
  {
    q: 'Do I have to start with the Business Leak Audit?',
    a: 'No. The audit is the recommended entry point because it identifies which offer actually fits your operation, but you can select any offer directly. If you do, the audit is run as part of that offer’s scope rather than as a separate engagement.',
  },
  {
    q: 'What does the audit CTA actually do?',
    a: 'It opens the Business Leak Audit request form. You describe your operation; we respond with a written review identifying where your enquiry, booking, or follow-up process loses momentum. No booking, quote, or provider connection is implied until scope is confirmed.',
  },
  {
    q: 'Are these one-time prices or recurring?',
    a: 'The published prices are one-time implementation costs for the listed scope. Any recurring provider cost (telephony, hosting, AI runtime) is itemised separately and only after a verified provider is selected.',
  },
  {
    q: 'Will I be pressured into a more expensive tier?',
    a: 'No. Each offer card shows its recommended tier. We recommend the smallest scope that resolves the diagnosed leak. Higher tiers exist for confirmed, larger scope — not as an upsell from a smaller offer.',
  },
]);

export default function PricingPage() {
  const recommendedByRegion = (region) => {
    const [lite, standard, pro] = region;
    return { Lite: lite, Standard: standard, Pro: pro };
  };

  const indiaPricing = PRICING_OFFERS.map((offer) => offer.india);
  const intlPricing = PRICING_OFFERS.map((offer) => offer.intl);

  return (
    <>
      <SiteHeader />
      <main className="page pricing-page">
        <section className="pricing-hero">
          <span className="eyebrow">Pricing</span>
          <h1>Five leak categories. Three sizes. One truth standard.</h1>
          <p className="section-lede">
            Published offer tiers for the five leak categories IronWake fixes. Every offer lists a
            recommended tier; pick the smallest scope that resolves the diagnosed leak. Start with the
            Business Leak Audit unless you already know what to build.
          </p>
          <div className="pricing-hero-actions">
            <Link className="button" href="/audit">Book Diagnostic</Link>
            <Link className="button secondary" href="/services">Browse Services</Link>
          </div>
        </section>

        <AuditForm />

        <section className="pricing-tiers" aria-label="Tier scope overview">
          {PRICING_TIERS.map((tier) => (
            <article key={tier} className={`pricing-tier${tier === 'Standard' ? ' recommended' : ''}`}>
              <span className="pricing-tier-name">{tier}</span>
              <span className="pricing-tier-pillar">{TIER_PILLAR[tier]}</span>
              <p className="pricing-tier-desc">{TIER_CLARITY[tier]}</p>
            </article>
          ))}
        </section>

        <section className="pricing-grid">
          {PRICING_OFFERS.map((offer, index) => (
            <article key={offer.id} className={`pricing-card${offer.recommended === 'Standard' ? ' recommended' : ''}`}>
              {offer.recommended === 'Standard' && <span className="pricing-badge">Recommended</span>}
              <h3>{offer.name}</h3>
              <p className="pricing-desc">{offer.description}</p>
              <div className="pricing-card-pricing" data-region="india">
                {recommendedByRegion(offer.india).Lite}
              </div>
              <div className="pricing-card-pricing" data-region="intl" hidden>
                {recommendedByRegion(offer.intl).Lite}
              </div>
              <span className="pricing-tier-name">{offer.recommended} tier</span>
              <Link className="button" href="/audit">{offer.cta}</Link>
            </article>
          ))}
        </section>

        <section className="pricing-guide">
          <article>
            <p className="pricing-volume">Lite — single deliverable</p>
            <h3>Know before you build</h3>
            <p>Start with the Business Leak Audit. You receive a written review and a recommended tier. No system is changed until scope is confirmed.</p>
          </article>
          <article>
            <p className="pricing-volume">Standard — core system + one integration</p>
            <h3>Build the smallest fix</h3>
            <p>One primary system, one verified provider integration, and a documented operational review. Recommended entry point for most operators.</p>
          </article>
          <article>
            <p className="pricing-volume">Pro — multi-step build</p>
            <h3>Run a documented operation</h3>
            <p>A multi-step build with custom workflow, owner training, and a documented review. Used when scope spans booking, intake, follow-up, and reporting.</p>
          </article>
        </section>

        <section className="audit-cta-strip" aria-label="Audit CTA">
          <div>
            <span className="eyebrow">Unsure which offer fits?</span>
            <h3>Start with the Business Leak Audit.</h3>
            <p>One written review. Diagnoses where your enquiry, booking, or follow-up process loses momentum, and identifies the smallest tier that resolves it.</p>
          </div>
          <Link className="button" href="/audit">Book Diagnostic</Link>
        </section>

        <section className="section">
          <span className="eyebrow">Common questions</span>
          <h2>What visitors ask about pricing.</h2>
          <div className="faq-grid">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section disclosure">
          <div>
            <span className="eyebrow">Truth standard</span>
            <h3>Verified prices only.</h3>
            <p>The prices published on this page are the canonical offer tiers. No discount, urgency, or scarcity language is added. Provider status and case-study outcomes are omitted until verified.</p>
          </div>
          <div className="disclosure-box">
            No countdown, no &ldquo;only N left&rdquo;, no urgency language. Each card shows the recommended tier; the audit CTA points to a written review, not a booking.
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
