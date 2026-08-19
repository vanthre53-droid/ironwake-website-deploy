import { Metadata } from 'next';
import { MotionReveal } from '../../components/MotionReveal';
import { RoiCalculator } from './RoiCalculator';

// ponytail: Dental industry landing page (v13 polish).
// Stays non-clinical and non-diagnostic. The calculator is a real client island
// (RoiCalculator.js) that pulls pricing from lib/pricing.mjs — no fabricated
// market benchmarks. The portfolio link is presented as a demonstration, not
// a real client result.
export const metadata = {
  title: 'Dental Industry Systems — IronWake',
  description:
    'Lead capture, after-hours enquiry handling, and intake architecture for solo dental practices. Non-clinical, non-diagnostic, non-compliance.',
  alternates: { canonical: '/industries/dental' },
  openGraph: {
    title: 'Dental Industry Systems — IronWake',
    description:
      'Field-appropriate intake architecture for solo dental practices.',
    url: '/industries/dental',
  },
};

const CAPABILITIES = [
  'First-touch intake capture with the consent log IronWake maintains per lead.',
  'After-hours enquiry routing into the recovery queue, not the dentist\'s phone.',
  'Recall and re-book nudge sequences that respect the per-patient consent record.',
  'Owner-visible audit row for every reply, including who saw it and when.',
];

const RELATED = [
  { slug: 'home-services', label: 'Home services' },
  { slug: 'dental-clinics', label: 'Dental clinics' },
  { slug: 'salons-spas', label: 'Salons and spas' },
];

export default function DentalIndustryPage() {
  return (
    <main className="shell" aria-labelledby="dental-hero-heading">
      <section className="hero compact dental-hero">
        <span className="eyebrow">Industries / Dental</span>
        <h1 id="dental-hero-heading">Intake architecture for solo dental practices.</h1>
        <p className="reading-width">
          A scoped companion page for solo dental practices that want the same intake
          architecture as multi-chair clinics without the multi-chair weight. Not a
          clinical, diagnostic, or compliance service.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a Business Leak Audit</a>
          <a className="button ghost" href="#capabilities">See capabilities</a>
          <a className="button ghost" href="#calculator">Open the calculator</a>
          <a className="button ghost" href="/systems/ai-receptionist">AI Receptionist</a>
        </div>
      </section>

      <MotionReveal>
        <section className="section" aria-labelledby="dental-scope-heading">
          <span className="eyebrow">Scope</span>
          <h2 id="dental-scope-heading">What this page covers.</h2>
          <p className="reading-width">
            This is a planning surface, not a clinical, diagnostic, or compliance service.
            It describes the IronWake systems wired for solo dental practices and stays
            strictly outside the practice of dentistry.
          </p>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" id="capabilities" aria-labelledby="dental-cap-heading">
          <span className="eyebrow">Capabilities</span>
          <h2 id="dental-cap-heading">What the systems deliver.</h2>
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
        <section className="section" id="calculator" aria-labelledby="dental-calc-heading">
          <span className="eyebrow">Planning calculator</span>
          <h2 id="dental-calc-heading">Model recovery value from your inputs.</h2>
          <p className="reading-width">
            Adjust the inputs to model your own practice. The result is computed
            locally from the values you type — there is no industry benchmark baked in.
          </p>
          <RoiCalculator />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="dental-proof-heading">
          <span className="eyebrow">Architecture demonstration</span>
          <h2 id="dental-proof-heading">A demonstration build, not a real client result.</h2>
          <p className="reading-width">
            <a href="/work/dentacare-pro">Dentacare Pro</a> is an IronWake-built
            demonstration of this intake architecture. It is shown as a demonstration
            of how the systems compose — IronWake does not collect outcome data from
            any live dental deployment.
          </p>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="dental-fit-heading">
          <span className="eyebrow">Industry fit</span>
          <h2 id="dental-fit-heading">Where this architecture also fits.</h2>
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