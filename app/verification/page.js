import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

import { organizationLd, breadcrumbLd, itemListLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
import { PROOF_CLASSES as PROOF_CLASS_LABELS } from '../../lib/canonical-entity.mjs';

// ponytail: every claim on this page maps to a documented proof class in
// lib/truth-registry.mjs. Copy is derived from the canonical definitions
// (V14 §59). No invented evidence tiers, no fabricated metrics.
export const metadata = {
  title: 'Verification — IronWake | How Every Claim Earns Its Label',
  description: 'IronWake uses five proof classes — DEMONSTRATION, INTERNAL_VERIFIED_BUILD, CLIENT_DEPLOYMENT, CLIENT_VERIFIED_RESULT, and QUANTIFIED_VERIFIED_RESULT — and never publishes a claim outside the class it has actually earned.',
  alternates: { canonical: canonicalUrl('/verification') },
};

const PROOF_CLASSES = Object.freeze([
  Object.freeze({
    id: 'demonstration',
    label: 'DEMONSTRATION',
    visibility: 'public',
    headline: 'A portfolio page only.',
    body: 'A capability proof exists on ironwake.dev. No client engagement, real customer outcome, or live provider integration is implied. This is the only class that ships without a customer behind it.',
    where: 'Work pages under /work/*, the home hero, and explicit portfolio references.',
  }),
  Object.freeze({
    id: 'internal-verified-build',
    label: 'INTERNAL_VERIFIED_BUILD',
    visibility: 'public',
    headline: 'Built and self-tested inside IronWake systems.',
    body: 'The capability is built, deployed, and tested by IronWake against its own acceptance criteria. The evidence is in our build logs, our audit trail, and our internal dashboards — not in a third-party result.',
    where: 'Service pages under /systems/* and capability entries in /services.',
  }),
  Object.freeze({
    id: 'client-deployment',
    label: 'CLIENT_DEPLOYMENT',
    visibility: 'public (speak to owner)',
    headline: 'Known to be live for a paying client.',
    body: 'A specific client engagement is live with this capability in production. We can speak to the engagement with the owner present. Names, industries, and outcomes stay gated until the client gives written consent.',
    where: 'Owner-led conversations, post-call summaries, signed SOWs.',
  }),
  Object.freeze({
    id: 'client-verified-result',
    label: 'CLIENT_VERIFIED_RESULT',
    visibility: 'owner only',
    headline: 'Measured outcome.',
    body: 'A client has measured an outcome against a defined baseline. The metric, baseline, measurement window, and client signature exist in the engagement record. This evidence is owner-only — it is never copied into public marketing copy.',
    where: 'Internal CRM, owner dashboard, signed measurement report.',
  }),
  Object.freeze({
    id: 'quantified-verified-result',
    label: 'QUANTIFIED_VERIFIED_RESULT',
    visibility: 'owner only',
    headline: 'Quantified verified result.',
    body: 'A specific number — bookings recovered, hours saved, response time reduced — has been independently verified by a third party (client finance team, auditor, or signed attestation). The number is owner-only and is never used in marketing copy.',
    where: 'Internal CRM, owner dashboard, signed third-party attestation.',
  }),
]);

// ponytail: what an unauthenticated visitor sees on every public page that
// carries a proof claim. Derived from lib/truth-registry.mjs and the no-
// invention law (V15 §3). No invented badges.
const PUBLIC_LABELS = Object.freeze([
  Object.freeze({
    label: 'DEMONSTRATION',
    meaning: 'A capability proof, not a client engagement, result, or provider integration.',
  }),
  Object.freeze({
    label: 'PROVIDER PROOF PENDING',
    meaning: 'A workflow exists, but the external provider connection behind it is not yet verified.',
  }),
  Object.freeze({
    label: 'AWAITING VERIFICATION',
    meaning: 'A claim is drafted but has not yet passed the evidence and approval standard this page describes.',
  }),
]);

// ponytail: order matters — every external claim leaves IronWake in one of
// these states, and only one of them is allowed to ship publicly without a
// named owner approval.
const CLAIM_LIFECYCLE = Object.freeze([
  ['drafted', 'Drafted', 'A claim is recorded in the truth registry with no evidence. Stays owner-only.'],
  ['built', 'Built', 'The capability has been implemented inside IronWake and passes its own acceptance tests.'],
  ['deployed', 'Deployed', 'The capability is live for at least one paying client with a signed SOW.'],
  ['measured', 'Measured', 'An outcome has been recorded against a defined baseline, signed by the client.'],
  ['verified', 'Verified', 'A specific number has been independently verified and signed by a third party.'],
]);

export default function VerificationPage() {
  return (
    <main className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Verification', path: '/verification' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd({
        name: 'IronWake proof classes',
        items: PROOF_CLASS_LABELS.map((label) => ({ name: label, path: '/verification' })),
      })) }} />

      <SiteHeader />

      <section className="hero compact">
        <span className="eyebrow">Verification</span>
        <h1>Every claim earns its label, or it doesn’t ship.</h1>
        <p className="reading-width">
          IronWake uses five proof classes — <strong>DEMONSTRATION</strong>, <strong>INTERNAL_VERIFIED_BUILD</strong>, <strong>CLIENT_DEPLOYMENT</strong>, <strong>CLIENT_VERIFIED_RESULT</strong>, and <strong>QUANTIFIED_VERIFIED_RESULT</strong> — and never publishes a claim outside the class it has actually earned.
        </p>
        <a className="button" href="/audit">Audit my workflow</a>
      </section>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">The five proof classes</span>
          <h2>What each label actually means.</h2>
          <div className="grid-2">
            {PROOF_CLASSES.map((p) => (
              <article className="system-card" key={p.id}>
                <h3>{p.label}</h3>
                <p className="micro">{p.visibility === 'public' ? 'Visible to the public' : 'Owner only — never copied into public marketing copy'}</p>
                <p>{p.body}</p>
                <p className="micro"><strong>Where it appears:</strong> {p.where}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">The public labels</span>
          <h2>What an unauthenticated visitor sees.</h2>
          <p className="reading-width">
            Of the five proof classes, two are owner-only and three are public. The three public labels are the only language IronWake uses on customer-facing pages to describe what is and is not verified.
          </p>
          <div className="grid-3">
            {PUBLIC_LABELS.map((l) => (
              <article className="system-card" key={l.label}>
                <h3>{l.label}</h3>
                <p>{l.meaning}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">How a claim earns its label</span>
          <h2>From drafted to verified.</h2>
          <div className="grid-2 journey-grid">
            {CLAIM_LIFECYCLE.map(([key, title, body]) => (
              <article key={key}>
                <span className="micro">{title}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section disclosure">
          <div>
            <span className="eyebrow">Verification method</span>
            <h3>Evidence before the interface.</h3>
            <p className="reading-width">
              A claim never graduates to the next proof class because the marketing copy says it did. It graduates when the named evidence — build logs, signed SOW, measurement record, or third-party attestation — exists in the engagement record and is owned by a named person.
            </p>
          </div>
          <div className="disclosure-box">
            A page is never allowed to imply a database commit, a sent notification, a booking, or a payment unless that evidence actually exists behind it. Missing information is hidden or shown as a pending state — it is never filled in with a placeholder that reads like a fact.
          </div>
          <a className="button secondary" href="/about">Read the operating standard</a>
        </section>
      </MotionReveal>
    </main>
  );
}
