import { Metadata } from 'next';
import { MotionReveal } from '../../components/MotionReveal';

// ponytail: Dental clinics industry page (v13 polish).
// Non-clinical, non-diagnostic, non-compliance. Only describes the IronWake
// systems wired for dental clinic intake; never describes clinical practice.
export const metadata = {
  title: 'Dental Clinics Industry Systems — IronWake',
  description:
    'Lead capture, after-hours enquiry, and intake architecture for multi-chair dental clinics. Non-clinical, non-diagnostic, non-compliance.',
  alternates: { canonical: '/industries/dental-clinics' },
  openGraph: {
    title: 'Dental Clinics Industry Systems — IronWake',
    description:
      'Intake architecture for multi-chair dental clinics.',
    url: '/industries/dental-clinics',
  },
};

const CAPABILITIES = [
  'Lead intake with the consent log IronWake maintains per new patient.',
  'After-hours enquiry handling — routed to recovery, not the dentist\'s phone.',
  'Audit trail per reply: who saw it, when, and what was sent.',
  'Owner-visible standing report with no fabricated percentages.',
];

const METRICS = [
  { label: 'New-patient intake', value: 'Per lead audit row' },
  { label: 'After-hours routing', value: 'Missed-lead recovery queue' },
  { label: 'Consent capture', value: 'Trust and lead capture system' },
  { label: 'Reply visibility', value: 'Owner-visible standing report' },
];

const RELATED = [
  { slug: 'dental', label: 'Dental' },
  { slug: 'home-services', label: 'Home services' },
  { slug: 'salons-spas', label: 'Salons and spas' },
];

export default function DentalClinicsIndustryPage() {
  return (
    <main className="shell" aria-labelledby="dc-hero-heading">
      <section className="hero compact dc-hero">
        <span className="eyebrow">Industries / Dental clinics</span>
        <h1 id="dc-hero-heading">
          Intake architecture for multi-chair dental clinics.
        </h1>
        <p className="reading-width">
          Lead capture, after-hours enquiry handling, and the audit trail owners
          need for first-time patient consent. Not a clinical, diagnostic, or
          compliance service.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a Business Leak Audit</a>
          <a className="button ghost" href="#capabilities">See capabilities</a>
          <a className="button ghost" href="/systems/trust-lead-capture">Trust and Lead Capture</a>
          <a className="button ghost" href="/pricing">View pricing</a>
        </div>
      </section>

      <MotionReveal>
        <section className="section" aria-labelledby="dc-scope-heading">
          <span className="eyebrow">Scope</span>
          <h2 id="dc-scope-heading">Where IronWake stops.</h2>
          <p className="reading-width">
            This page describes intake architecture only. IronWake is not medical,
            diagnostic, legal, or compliance advice — and never substitutes for
            the clinical judgment of a licensed dentist.
          </p>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" id="capabilities" aria-labelledby="dc-cap-heading">
          <span className="eyebrow">Capabilities</span>
          <h2 id="dc-cap-heading">What the systems deliver.</h2>
          <div className="system-grid" role="list">
            {CAPABILITIES.map((c, i) => (
              <article key={c} className="system-card" role="listitem">
                <span className="micro">0{i + 1} / capability</span>
                <h3>Capability {i + 1}</h3>
                <p>{c}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="dc-metrics-heading">
          <span className="eyebrow">Outcome strip</span>
          <h2 id="dc-metrics-heading">What you can audit from the owner console.</h2>
          <div className="system-grid" role="list">
            {METRICS.map((m, i) => (
              <article key={m.label} className="system-card" role="listitem">
                <span className="micro">0{i + 1} / metric</span>
                <h3>{m.value}</h3>
                <p>{m.label}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="dc-proof-heading">
          <span className="eyebrow">Architecture demonstration</span>
          <h2 id="dc-proof-heading">A demonstration build, not a real client result.</h2>
          <p className="reading-width">
            <a href="/work/dentacare-pro">Dentacare Pro</a> is an IronWake-built
            demonstration of this intake architecture. It is shown as a demonstration
            of how the systems compose for multi-chair clinics.
          </p>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="dc-fit-heading">
          <span className="eyebrow">Industry fit</span>
          <h2 id="dc-fit-heading">Where this architecture also fits.</h2>
          <div className="industry-grid" role="list">
            {RELATED.map((r, i) => (
              <a
                key={r.slug}
                className="industry-card"
                href={`/industries/${r.slug}`}
                role="listitem"
              >
                <span className="micro">0{i + 1} / related</span>
                <h3>{r.label}</h3>
                <p>See how the same intake principles apply.</p>
              </a>
            ))}
          </div>
        </section>
      </MotionReveal>
    </main>
  );
}