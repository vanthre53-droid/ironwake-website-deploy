import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Scope — IronWake',
  description: 'The three engagement shapes IronWake works within, the boundaries between them, and the costs that always remain the client\'s.',
  alternates: { canonical: canonicalUrl("/scope") },
};

// ponytail: the three engagement shapes are the only public-facing packaging
// of IronWake's work. Boundaries and pass-through costs are explicit so the
// audit request flow never has to invent a price or a timeline.
const shapes = [
  {
    index: '01',
    title: 'Business Leak Audit',
    label: 'Diagnostic',
    blurb: 'A two-week diagnostic of the gap between the first enquiry and the first response. Stored as a single written document with boundaries, evidence, and a recommended next step.',
    ownership: 'Single audit document, reviewed against the workflow you actually run.',
    boundary: 'No implementation, no new system, no edits to running tools. The audit is the work.'
  },
  {
    index: '02',
    title: 'Workflow build',
    label: 'Build',
    blurb: 'The smallest system that closes the gap the audit identified. One named owner, one visible next action, one due time per record. Stack size is constrained by legibility, not by capability.',
    ownership: 'A workflow you can read end-to-end without a translator. Documented in the same language your team uses.',
    boundary: 'No paid media, no sales automation, no marketing site work. The leak is closed inside the existing operations.'
  },
  {
    index: '03',
    title: 'Operating support',
    label: 'Maintain',
    blurb: 'A bounded monthly window that keeps the workflow honest: review the records, verify the boundaries, label the states that are still pending, and document what changed since the last cycle.',
    ownership: 'A monthly review document plus named-thread access to the engineer who built the workflow.',
    boundary: 'No new leads, no new channels, no new product surface. The scope is what was built, kept correct.'
  }
];

const passThrough = [
  'Provider and hosting costs — billed by the third-party provider, never marked up by IronWake.',
  'Phone numbers and toll-free numbers — billed by the carrier or platform that issues them.',
  'Per-message or per-minute communication costs — billed by the messaging or voice provider you choose.',
  'Any tool whose invoice IronWake has not received and verified.'
];

const boundary = [
  'No generic package or invented price — every scope is written against the workflow you actually run.',
  'No fixed timeline, fixed price, or guaranteed outcome listed here — these are agreed in the audit request flow.',
  'No provider performance claims — provider status is documented as DEMONSTRATION, PROVIDER PROOF PENDING, or VERIFIED, not implied.'
];

export default function ScopePage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Scope", path: "/scope" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Scope</span><h1>Three engagement shapes. Clear boundaries between them.</h1><p className="reading-width">Each shape is a written boundary around what IronWake does, what it does not do, and which costs remain the client's. No tiers, no bundles, no invented prices.</p><a className="button" href="/audit">Request scope</a></section>

    <MotionReveal>
      <section className="section scope-shapes">
        <div className="reading-width scope-shapes-header">
          <span className="eyebrow">The three shapes</span>
          <h2>Pick the one that matches the work — not the one that matches a budget.</h2>
          <p className="section-lede">Every engagement starts as a written scope. The shape is chosen by the workflow, not by a price tier.</p>
        </div>
        <div className="scope-shapes-grid">
          {shapes.map((shape) => (
            <article key={shape.title} className="scope-shape-card">
              <span className="scope-index">{shape.index}</span>
              <span className="scope-shape-label">{shape.label}</span>
              <h3>{shape.title}</h3>
              <p className="scope-shape-blurb">{shape.blurb}</p>
              <dl className="scope-shape-meta">
                <div><dt>Ownership</dt><dd>{shape.ownership}</dd></div>
                <div><dt>Boundary</dt><dd>{shape.boundary}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section scope-pass">
        <div className="reading-width">
          <span className="eyebrow">What stays the client's</span>
          <h2>Pass-through costs are listed, not hidden.</h2>
          <p className="section-lede">These are billed by the third-party provider, never marked up by IronWake.</p>
        </div>
        <ul className="scope-pass-list">
          {passThrough.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section disclosure">
        <div>
          <span className="eyebrow">Boundaries</span>
          <h3>What this page does not promise.</h3>
          <p>The shape list fixes what IronWake does, not what it delivers in your specific case. The audit request flow is the only place where a scope, price, and delivery terms are agreed.</p>
        </div>
        <div className="disclosure-box">
          <ul className="scope-boundary-list">
            {boundary.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      </section>
    </MotionReveal>
  </main>;
}