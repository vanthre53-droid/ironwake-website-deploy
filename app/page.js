import { SiteHeader } from './components/SiteHeader';
import { MotionReveal } from './components/MotionReveal';
import { DashboardDemo } from './components/DashboardDemo';
import { FlagshipHero } from './components/FlagshipHero';
import { InteractiveLeadJourney } from './components/InteractiveLeadJourney';
import { dualLitePrice } from '../lib/pricing.mjs';

import { organizationLd, breadcrumbLd } from '../lib/seo.mjs';
import { canonicalUrl } from '../lib/seo.mjs';

// ponytail: v17 — homepage density refresh. Card bodies tightened, redundant
// "Founder, IronWake" micro label dropped below h2 "Revanth Nunna" (the eyebrow
// already labels this section). The canonical "01 / Category" micro labels in
// the progress-list and journey-grid are kept because the enumeration IS the
// hierarchy there.
const systems = [
  ['Missed Lead Recovery', 'See where an enquiry stalls and what the next review step should be.', '/systems/missed-lead-recovery'],
  ['Booking Certainty', 'Separate a booking request from a confirmed appointment so nobody assumes the wrong state.', '/systems/booking-control'],
  ['Trust + Lead Capture', 'Conversion-optimised intake that persists first, notifies second.', '/systems/trust-lead-capture'],
  ['AI Receptionist', 'Planning requirements for a disclosed, human-supervised first response. No live receptionist connected.', '/systems/ai-receptionist']
];

const caseStack = [
  ['DentaCare Intake', 'Demonstration: validated intake to reviewed booking request.', 'See how a clinic-style request becomes a reviewed next step.', '/work/dentacare-pro'],
  ['Atelier Safe', 'Demonstration: consultation capture with a review task.', 'See how consultation interest stays reviewable after the first enquiry.', '/work/atelier'],
];

const industries = [
  ['Home Services', 'Stop missed calls and urgent requests ending without a documented callback plan.', '/industries/home-services'],
  ['Dental & Private Clinics', 'Phone, walk-in, and online requests in one reviewable intake path.', '/industries/dental-clinics'],
  ['Salons & Spas', 'Consultation interest receives a clear follow-up before it cools.', '/industries/salons-spas'],
];

export function generateMetadata() {
  return {
    title: 'IronWake — The enquiry arrived. Where did it go?',
    description: 'IronWake builds operational systems that capture enquiries, make the next review step visible, and control follow-up without overstating provider status.',
    openGraph: {
      title: 'IronWake — The enquiry arrived. Where did it go?',
      description: 'Operational systems for service businesses. Capture every enquiry, create a review task, and make the next action visible.',
      type: 'website',
      url: './',
      siteName: 'IronWake',
      images: [{ url: '/og-default.svg', width: 1200, height: 630, alt: 'IronWake — The enquiry arrived. Where did it go?' }]
    },
  };
}

export default function Home() {
  const auditLitePrice = dualLitePrice('business-leak-audit');
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
          { name: "Home", path: "/" },
        ])) }} />

    <SiteHeader />
    <FlagshipHero auditLitePrice={auditLitePrice} />

    {/* Choose the problem — system grid. v16: lede wrapped in .reading-width,
        card bodies in .card-content-width, micro labels removed. */}
    <MotionReveal stagger>
      <section className="section intro">
        <span className="eyebrow">Choose the problem</span>
        <h2>Start with the handoff that is costing attention.</h2>
        <p className="reading-width">Four operational systems. Each one targets a different place where a real enquiry, booking, or follow-up can lose visibility. Pick the system that matches the leak you can already see in your business.</p>
        <div className="system-grid">
          {systems.map(([title, text, href]) => (
            <a className="system-card" href={href} key={title}>
              <h3>{title}</h3>
              <p className="card-content-width">{text}</p>
              <span className="card-link">Open this system <span aria-hidden="true">→</span></span>
            </a>
          ))}
        </div>
      </section>
    </MotionReveal>

    {/* Interactive demonstrations — case grid. v16: rhythm from CSS tokens,
        no document line treatment, micro label removed. */}
    <MotionReveal stagger>
      <section className="section">
        <span className="eyebrow">Interactive demonstrations</span>
        <h2>See the workflow, not a vague promise.</h2>
        <p className="reading-width">Each portfolio demonstration is a recorded inquiry-to-review path. They are honest about what is built (the path) and what is not (the live telephony or messaging provider).</p>
        <div className="case-grid">
          <a className="case-large" href="/work/rapidpulse">
            <div className="case-art" role="img" aria-label="Abstract inquiry-to-action flow" />
            <div className="case-copy">
              <h2>RapidPulse Response</h2>
              <p className="case-metric">Demonstration: inquiry-to-review handoff with queued notification intent.</p>
              <p className="card-content-width">Follow an urgent enquiry from first contact to a visible review step.</p>
              <span className="card-link">Open the demonstration →</span>
            </div>
          </a>
          <div className="case-stack">
            {caseStack.map(([title, metric, body, href]) => (
              <a href={href} key={title}>
                <article>
                  <h2>{title}</h2>
                  <p className="case-metric">{metric}</p>
                  <p className="card-content-width">{body}</p>
                  <span className="card-link">Open demonstration →</span>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>
    </MotionReveal>

    {/* Operating model — progress grid. v16: lede expanded to .reading-width. */}
    <MotionReveal>
      <section className="section">
        <div className="progress-grid">
          <div>
            <span className="eyebrow">Operating model</span>
            <h3>Inspectable progress.</h3>
            <p className="reading-width">We do not sell theatre. We make operational decisions inspectable. Each step is a defined review, not a vibe.</p>
          </div>
          <div className="progress-list">
            <div><span>01 / visibility</span><strong>Capture existing leaks</strong></div>
            <div><span>02 / review</span><strong>Clarify the next action</strong></div>
            <div><span>03 / control</span><strong>Review automation before relying on it</strong></div>
          </div>
        </div>
      </section>
    </MotionReveal>

    {/* Trust band — three review standards. v16: real .trust-band CSS now
        provides a 3-column grid + generous padding; was previously unstyled. */}
    <MotionReveal>
      <section className="section trust-band">
        <span className="eyebrow">Review standard</span>
        <h2>What every published claim has to survive.</h2>
        <p className="trust-lede">Before any provider, pricing tier, or outcome is shown as live on this site, three reviews must pass. We do not publish what the evidence does not support.</p>
        <div className="trust-grid">
          <article>
            <strong>Provider state verified</strong>
            <p>Each provider (Retell, Meta, Supabase, Cloudflare) is probed against its current official endpoint. Status is shown only when the readback succeeds.</p>
            <span className="trust-meta">Last reviewed: this deploy</span>
          </article>
          <article>
            <strong>Provider events captured</strong>
            <p>Webhook signatures are verified. Events are persisted with idempotency. Replay is rejected. The database row is the proof.</p>
            <span className="trust-meta">Logged with redacted payloads</span>
          </article>
          <article>
            <strong>Truthful pricing + copy</strong>
            <p>Prices are fixed regional tiers, not live FX. No fake discounts, urgency, or testimonials. Hindi, Telugu, and English content stays grounded in canonical business truth.</p>
            <span className="trust-meta">Audit trail in reports/</span>
          </article>
        </div>
      </section>
    </MotionReveal>

    <DashboardDemo />
    <InteractiveLeadJourney />

    {/* Industry grid — v17: lede kept concise, body widths already capped
        via .card-content-width so cards don't dump paragraphs into wide boxes. */}
    <MotionReveal stagger>
      <section className="section">
        <span className="eyebrow">Choose your industry</span>
        <h2>Different businesses lose enquiries in different places.</h2>
        <p className="reading-width">Pick the industry that matches your service. The leak is usually specific to the channel your customer uses first.</p>
        <div className="industry-grid">
          {industries.map(([title, text, href]) => (
            <a className="industry-card" href={href} key={title}>
              <h3>{title}</h3>
              <p className="card-content-width">{text}</p>
              <span className="card-link">View industry →</span>
            </a>
          ))}
        </div>
      </section>
    </MotionReveal>

    {/* Operational lens — technical journey. v16: cards still use .micro
        because this is a pipeline / process section where the enumeration
        IS the hierarchy (01 / audit, 02 / review, etc). Kept intentionally. */}
    <MotionReveal>
      <section className="journey">
        <span className="eyebrow">Operational lens</span>
        <h2>The technical journey.</h2>
        <p className="reading-width">A four-step operational lens that we apply to every engagement. The naming is honest: the same steps reappear in the audit, the build, and the review.</p>
        <div className="journey-grid">
          <article><span className="micro">01 / audit</span><h3>Map the path</h3><p>See where a visitor loses context or a team loses the next review step.</p></article>
          <article><span className="micro">02 / review</span><h3>Name the next action</h3><p>Make a due state and the next action visible.</p></article>
          <article><span className="micro">03 / systems</span><h3>Use the smallest system</h3><p>Prefer an understandable fix over a bigger stack.</p></article>
          <article><span className="micro">04 / review</span><h3>Verify the state</h3><p>Do not label a provider, booking, or outcome complete without proof.</p></article>
        </div>
      </section>
    </MotionReveal>

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What does IronWake do?', acceptedAnswer: { '@type': 'Answer', text: 'IronWake maps and builds operational systems for clearer enquiry, booking, follow-up, and reception handoffs.' }},
        { '@type': 'Question', name: 'How much does IronWake cost?', acceptedAnswer: { '@type': 'Answer', text: 'IronWake publishes tiered offer pricing on /pricing. Each engagement starts with the Business Leak Audit offer tier shown there.' }},
        { '@type': 'Question', name: 'Is IronWake an AI chatbot?', acceptedAnswer: { '@type': 'Answer', text: 'IronWake itself is a founder-led systems practice. The website assistant (Ask IronWake) is a real AI grounded in IronWake knowledge and scoped to IronWake business questions only.' }},
        { '@type': 'Question', name: 'What happens after the audit?', acceptedAnswer: { '@type': 'Answer', text: 'You receive a written review identifying where your process loses momentum, what is verified versus assumed, and the smallest next step to fix it.' }},
        { '@type': 'Question', name: 'Does this site have customer accounts?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Visitors can create a free IronWake account to save Ask IronWake conversations and keep their audit/request history. Accounts never grant access to the private owner dashboard.' }},
      ]
    })}} />
    <section className="section">
      <span className="eyebrow">Common questions</span>
      <h2>What business owners ask.</h2>
      <p className="reading-width">The questions that come up most often in the first conversation. If yours is not here, the audit call is the right place to ask it.</p>
      <div className="faq-grid">{[['What does IronWake actually do?', 'IronWake is a founder-led systems practice. We map where your enquiry, booking, or follow-up process loses momentum, then build the smallest operational system that makes the next step visible and reviewable. A completed workflow is only claimed after its provider and operational evidence are verified.'], ['Is the corner helper a real AI?', 'Yes. The IronWake website assistant (Ask IronWake) is a real AI assistant grounded in the published IronWake knowledge. It is scoped to IronWake business questions and refuses unrelated coding, hacking, or secret-extraction requests. It is not a deployed receptionist for your business — that requires a separately scoped client build.'], ['How much does it cost?', 'Published offer tiers are listed on /pricing. Each engagement starts with the Business Leak Audit tier shown there. Implementation costs depend on confirmed scope and are quoted after the audit.'], ['Do you integrate with my existing tools?', 'Where a verified provider connection exists, yes. Where it does not, we scope the workflow first and connect providers only after they are approved and proven.'], ['What happens after the audit?', 'You receive a written review identifying where your process loses momentum, what is verified versus assumed, and the smallest next step to fix it. No obligation, no pressure.'], ['Does this site have customer accounts?', 'Yes. Visitors can create a free IronWake account to save Ask IronWake conversations and keep their audit/request history. Accounts never grant access to the private owner dashboard.']].map(([q, a]) => <details key={q} className="faq-item"><summary>{q}</summary><p>{a}</p></details>)}</div>
    </section>

    <MotionReveal>
      <section className="section disclosure">
        <div>
          <span className="eyebrow">Truth standard</span>
          <h3>Verified claims only.</h3>
          <p className="reading-width">IronWake labels work as a demonstration until independent evidence supports a stronger claim. Published prices are confirmed offer tiers. Provider status and client outcomes are omitted until verified.</p>
        </div>
        <div className="disclosure-box">No testimonial, metric, benchmark, or provider status is published without reproducible evidence and named approval.</div>
      </section>
    </MotionReveal>

    <section className="section founder">
      <div className="founder-mark">IRONWAKE<br />SYSTEMS PRACTICE</div>
      <div>
        <span className="eyebrow">Founder</span>
        <h2>Revanth Nunna</h2>
        <p className="reading-width">IronWake is a founder-led systems practice for service businesses. The work begins with one real enquiry or booking handoff and improves it without hiding uncertainty behind software.</p>
      </div>
    </section>
  </main>;
}

