import { SiteHeader } from '../components/SiteHeader';
import { FlagshipHero } from '../components/FlagshipHero';
import { DashboardDemo } from '../components/DashboardDemo';
import { MotionReveal } from '../components/MotionReveal';
import { JsonLd } from '../components/JsonLd';

import { getHomepageJsonLd } from './seo/homepage';

// ponytail: site copy that powers the homepage. Single source of truth so
// price strings never drift between hero / pricing reference / dashboard.
const PRICING = {
  auditLitePrice: '₹799 / $29',
  enquiryAuditPrice: '₹4,999 / $149',
  diagnosticPrice: '₹9,999 / $249',
  implementationPrice: '₹24,999 / $799',
};

// ponytail: system cards. 4 entries by design — too many and the grid
// becomes wallpaper, too few and the user can't see "which one matches my
// leak". Each card carries an eyebrow label and one honest limitation
// sentence — the limitation is the trust signal, not a tagline.
const systems = [
  {
    href: '/systems/missed-lead-recovery',
    eyebrow: 'Missed leads',
    title: 'Missed Lead Recovery',
    body: 'See where an enquiry stalls and what the next review step should be.',
    limitation: 'Requires your existing CRM or spreadsheet to capture the audit trail.',
  },
  {
    href: '/systems/booking-control',
    eyebrow: 'Booking',
    title: 'Booking Certainty',
    body: 'Separate a booking request from a confirmed appointment so nobody assumes the wrong state.',
    limitation: 'Requires calendar integration before going live.',
  },
  {
    href: '/systems/trust-lead-capture',
    eyebrow: 'Intake',
    title: 'Trust + Lead Capture',
    body: 'Conversion-optimised intake that persists first, notifies second.',
    limitation: 'Requires your existing notification channel to be confirmed.',
  },
  {
    href: '/systems/ai-receptionist',
    eyebrow: 'AI receptionist',
    title: 'AI Receptionist',
    body: 'Planning requirements for a disclosed, human-supervised first response.',
    limitation: 'No live receptionist connected on this site.',
  },
];

// ponytail: industry-specific leakage links. Each links to an industry page
// where the leak pattern is described in context.
const industries = [
  { href: '/industries/home-services',      title: 'Home Services',           body: 'Stop missed calls and urgent requests ending without a documented callback plan.' },
  { href: '/industries/dental-clinics',     title: 'Dental & Private Clinics', body: 'Phone, walk-in, and online requests in one reviewable intake path.' },
  { href: '/industries/salons-spas',        title: 'Salons & Spas',            body: 'Consultation interest receives a clear follow-up before it cools.' },
];

// ponytail: the four-step operational lens. These names appear on the
// process page and inside every audit report.
const operationalLens = [
  { step: '01', title: 'Map the path',           body: 'Document the actual enquiry-to-action path before changing anything.' },
  { step: '02', title: 'Name the next action',   body: 'Replace vague follow-ups with an owner, a due state, and a documented outcome.' },
  { step: '03', title: 'Use the smallest system', body: 'Build the smallest system that holds the new state — usually a CRM column, not a platform.' },
  { step: '04', title: 'Verify the state',       body: 'Independent evidence before a stronger claim is published. Provider status stays at demonstration.' },
];

// ponytail: FAQ entries. Owner-reviewed and short.
const faqs = [
  { q: 'Is this a chatbot?',                              a: 'No. IronWake builds the operating system around enquiry, booking, and follow-up. Conversation is one input.' },
  { q: 'Do I need a new CRM?',                            a: 'No. The smallest system is usually a column in what you already use. New platforms come last.' },
  { q: 'How much does it cost to start?',                 a: `${PRICING.auditLitePrice} for the audit-lite, ${PRICING.enquiryAuditPrice} for a full enquiry audit, ${PRICING.diagnosticPrice} for a diagnostic engagement, and ${PRICING.implementationPrice} for a first build. No subscription.` },
  { q: 'Do you replace my team?',                         a: 'No. IronWake makes the existing team's work visible. The smallest system is usually a column, not a hire.' },
  { q: 'Why does the site say "demonstration"?',          a: 'Because provider connections (telephony, messaging) are not active on this site. We label what is built and what is not, by review.' },
  { q: 'How does the free content audit work?',           a: 'Send the URL. The first review returns the three highest-value leaks in 48 hours, with named actions. No commitment.' },
];

// ponytail: Home — v18 de-congestion rebuild.
//
// Section order (every section binds to rhythm tokens):
//   1. FlagshipHero              (intro beat, not a .section — keeps hero airy)
//   2. Systems grid              (.section first-after-hero .section--tight)
//   3. Workflow demonstration    (.section .section--tight)
//   4. Dashboard demo            (.section .section--tight)
//   5. Industry strip            (.section .section--tight)
//   6. Process lens              (.section .section--tight)
//   7. FAQ                       (.section .section--tight)
//   8. Founder                   (.section .section--tight)
//
// v18 removed:
//   - "Outcome strip" 4-tile hero band (redundant with beats)
//   - "9 stages · review-first" frame tag (forced micro)
//   - "Review standard" trust-band (3-card grid with no content)
//   - "Interactive lead journey" section (overlaps with flagship + demo)
//   - "Interactive demonstrations" case-grid (overlaps with dashboard demo)
//   - "Truth standard" bottom band (redundant with hero close + FAQ)
//   - Repeated `LAST REVIEWED`, `LOGGED WITH REDACTED PAYLOADS`, `AUDIT TRAIL`,
//     and `DEMONSTRATION — NOT LIVE DATA` micro labels — replaced by a single
//     honest eyebrow per section.
export const metadata = {
  title: 'IronWake — operational systems for missed leads, booking, and AI reception',
  description:
    'IronWake exposes where enquiries stall and gives operators one reviewable path: missed lead recovery, booking control, AI receptionist planning, and intake capture.',
  openGraph: {
    title: 'IronWake — operational systems for missed leads, booking, and AI reception',
    description:
      'IronWake exposes where enquiries stall and gives operators one reviewable path across missed lead recovery, booking control, AI receptionist planning, and intake capture.',
    url: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-home">
        <h1 className="visually-hidden">IronWake — operational systems for missed leads, booking, and AI reception.</h1>
        {/* === 1. Flagship hero (intro — no .section wrapper, no border) === */}
        <FlagshipHero auditLitePrice={PRICING.auditLitePrice} />

        {/* === 2. Systems grid === */}
        <MotionReveal as="section" className="section first-after-hero section--tight" aria-label="IronWake operating systems">
          <span className="eyebrow">Choose the problem</span>
          <h2>Start with the handoff that is costing attention.</h2>
          <p className="reading-width">
            Four operational systems. Each one targets a different place where
            a real enquiry, booking, or follow-up can lose visibility. Pick
            the system that matches the leak you can already see.
          </p>
          <div className="system-grid">
            {systems.map((sys) => (
              <a key={sys.href} href={sys.href} className="system-card glass-level-1">
                <span className="eyebrow">{sys.eyebrow}</span>
                <h3>{sys.title}</h3>
                <p>{sys.body}</p>
                <p className="system-card-limitation">{sys.limitation}</p>
                <span className="system-card-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </MotionReveal>

        {/* === 3. Workflow demonstration === */}
        <MotionReveal as="section" className="section section--tight" aria-label="Workflow demonstration">
          <span className="eyebrow">Workflow demonstration</span>
          <h2>See the workflow, not a vague promise.</h2>
          <p className="reading-width">
            Each portfolio demonstration is a recorded inquiry-to-review
            path. They are honest about what is built (the path) and what is
            not (the live telephony or messaging provider).
          </p>
          <div className="grid-3">
            <a className="case-card glass-level-1" href="/work/rapidpulse">
              <span className="micro">Demonstration</span>
              <h3>RapidPulse Response</h3>
              <p>Inquiry-to-review handoff with queued notification intent.</p>
              <span className="card-cta">Open the demonstration →</span>
            </a>
            <a className="case-card glass-level-1" href="/work/dentacare-pro">
              <span className="micro">Demonstration</span>
              <h3>DentaCare Intake</h3>
              <p>Validated intake to reviewed booking request.</p>
              <span className="card-cta">Open the demonstration →</span>
            </a>
            <a className="case-card glass-level-1" href="/work/atelier">
              <span className="micro">Demonstration</span>
              <h3>Atelier Safe</h3>
              <p>Consultation capture with a review task.</p>
              <span className="card-cta">Open the demonstration →</span>
            </a>
          </div>
          <div className="section-cta-row">
            <a className="button secondary" href="/work">All case studies</a>
          </div>
        </MotionReveal>

        {/* === 4. Dashboard demo — single illustrative review record === */}
        <MotionReveal as="section" className="section section--tight" aria-label="Dashboard demonstration">
          <span className="eyebrow">Dashboard demonstration</span>
          <h2>See a possible review workflow.</h2>
          <p className="reading-width">
            A fictional illustration of how review state, due date, and
            named owner can be presented. The private owner dashboard is
            deployed separately; MFA-authenticated owner-session proof
            remains pending.
          </p>
          <DashboardDemo />
        </MotionReveal>

        {/* === 5. Industry strip === */}
        <MotionReveal as="section" className="section section--tight" aria-label="Industries served">
          <span className="eyebrow">If your industry is not here</span>
          <h2>Different businesses lose enquiries in different places.</h2>
          <p className="reading-width">
            Pick the industry that matches your service. The leak is usually
            specific to the channel your customer uses first.
          </p>
          <div className="grid-3">
            {industries.map((ind) => (
              <a key={ind.href} href={ind.href} className="industry-card glass-level-1">
                <h3>{ind.title}</h3>
                <p>{ind.body}</p>
                <span className="card-cta">Read more →</span>
              </a>
            ))}
          </div>
        </MotionReveal>

        {/* === 6. Process lens === */}
        <MotionReveal as="section" className="section section--tight" aria-label="Operational lens">
          <span className="eyebrow">Operational lens</span>
          <h2>The technical journey.</h2>
          <p className="reading-width">
            A four-step operational lens applied to every engagement. The
            same steps reappear in the audit, the build, and the review.
          </p>
          <div className="grid-4">
            {operationalLens.map((step) => (
              <article key={step.step} className="process-card glass-level-1">
                <span className="process-card-step">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
          <div className="section-cta-row">
            <a className="button secondary" href="/process">Read the full process</a>
          </div>
        </MotionReveal>

        {/* === 7. FAQ === */}
        <MotionReveal as="section" className="section section--tight" aria-label="Common questions">
          <span className="eyebrow">Common questions</span>
          <h2>What business owners ask.</h2>
          <div className="faq-list">
            {faqs.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </MotionReveal>

        {/* === 8. Founder === */}
        <MotionReveal as="section" className="section section--tight founder-section" aria-label="Founder">
          <div className="founder-card glass-level-2">
            <span className="eyebrow">IronWake // systems practice</span>
            <h2>Revanth Nunna</h2>
            <p className="founder-bio">
              IronWake is a founder-led systems practice for service
              businesses. The work begins with one leak made visible, and
              stays with that business until the smallest system that holds
              the new state is verified end-to-end.
            </p>
            <div className="founder-actions">
              <a className="button" href="/about">About IronWake</a>
              <a className="button secondary" href="/audit">Map my leak</a>
            </div>
          </div>
        </MotionReveal>
      </main>
      <JsonLd data={getHomepageJsonLd({ auditLitePrice: PRICING.auditLitePrice })} />
    </>
  );
}
