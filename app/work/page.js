import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Work — IronWake',
  description: 'Portfolio demonstrations from IronWake, labelled and scoped as capability proof rather than client engagements.',
  alternates: { canonical: canonicalUrl("/work") },
};

const portfolio = [
  { id: 'rapidpulse', name: 'RapidPulse Response', industry: 'Emergency Services', tag: 'Inquiry-to-response ownership', url: 'https://rapidpulse-plumbing.vercel.app', caseHref: '/work/rapidpulse' },
  { id: 'harbour', name: 'Harbour Estates', industry: 'Real Estate', tag: 'Property inquiry routing', url: 'https://bristol-architectural.vercel.app', caseHref: '/work/harbour-estates' },
  { id: 'dentacare', name: 'DentaCare Pro', industry: 'Dental Clinics', tag: 'Front-desk intake flow', url: 'https://manchester-gentle-dental.vercel.app', caseHref: '/work/dentacare-pro' },
  { id: 'aura', name: 'Aura Archives', industry: 'Luxury Retail', tag: 'Bespoke inquiry capture', url: 'https://bluestone-jewellery-prototype.vercel.app', caseHref: '/work/aura-archives' },
  { id: 'luxe', name: 'Luxe Studio', industry: 'Wine & Spirits', tag: 'Booking and studio system', url: 'https://luxe-studio-wine.vercel.app', caseHref: '/work/luxe-studio' },
  { id: 'bramble', name: 'Bramble Cafe', industry: 'Hospitality', tag: 'Reservation and catering', url: 'https://bramble-cafe.vercel.app', caseHref: '/work/bramble-cafe' },
  { id: 'voltix', name: 'Voltix', industry: 'Electronics', tag: 'Quote and support capture', url: 'https://voltix-fawn.vercel.app', caseHref: '/work/voltix' },
  { id: 'retech', name: 'RE-TECH', industry: 'Technology', tag: 'Service request capture', url: 'https://re-tech-umber.vercel.app', caseHref: '/work/retech' },
  { id: 'atelier', name: 'Atelier Safe', industry: 'Salons & Spas', tag: 'Consultation follow-up ownership', url: 'https://atelier-luxury-salon.vercel.app', caseHref: '/work/atelier' },
];

const caseStudies = [
  { href: '/work/rapidpulse', label: '01 / emergency', name: 'RapidPulse Response', text: 'Follow an urgent enquiry from first contact to named ownership.', art: 'rapidpulse' },
  { href: '/work/dentacare-pro', label: '02 / clinic', name: 'DentaCare Intake', text: 'See how a clinic-style request becomes a reviewed next step.', art: 'dentacare' },
  { href: '/work/atelier', label: '03 / consultation', name: 'Atelier Safe', text: 'See how consultation interest stays owned after the first enquiry.', art: 'atelier' },
];

export default function WorkPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">Portfolio</span>
      <h1>Nine businesses. One principle: every enquiry gets an owner.</h1>
      <p>Each project below is a portfolio demonstration. Most have a live external prototype you can open and inspect; a few are still being prepared and are clearly labelled. These are capability proofs — not client engagements or measured results. Names like "Harbour Estates", "Aura Archives", and "BlueStone" are fictional themes mapped to prototype URLs; the underlying build is the demonstration.</p>
    </section>

    <MotionReveal>
      <section className="section intro">
        <span className="eyebrow">Live demonstrations</span>
        <h2>Open any project to explore.</h2>
        <div className="portfolio-grid">
          {portfolio.map((p) => (
            <article className="portfolio-card" key={p.id}>
              <div className="portfolio-art" data-project={p.id} role="img" aria-label={`Visual for ${p.name}`} />
              <div className="portfolio-body">
                <span className="micro">{p.industry}</span>
                <h3>{p.name}</h3>
                <p>{p.tag}</p>
                <div className="portfolio-actions">
                  {p.url ? (
                    <a className="button" href={p.url} target="_blank" rel="noopener noreferrer">View live demo →</a>
                  ) : (
                    <span className="button" aria-disabled="true">External demo pending</span>
                  )}
                  {p.caseHref && <a className="text-link" href={p.caseHref}>Read case study</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MotionReveal>

    <MotionReveal>
      <section className="section">
        <span className="eyebrow">Detailed walkthroughs</span>
        <h2>Three workflows you can inspect in depth.</h2>
        <div className="case-grid">
          <a href={caseStudies[0].href}>
            <article className="case-large">
              <div className="case-art" />
              <div className="case-copy">
                <span className="micro">{caseStudies[0].label}</span>
                <h3>{caseStudies[0].name}</h3>
                <p>{caseStudies[0].text}</p>
                <span className="card-link">Open case study →</span>
              </div>
            </article>
          </a>
          <div className="case-stack">
            {caseStudies.slice(1).map((c) => (
              <a href={c.href} key={c.href}>
                <article>
                  <span className="micro">{c.label}</span>
                  <h3>{c.name}</h3>
                  <p>{c.text}</p>
                  <span className="card-link">Open case study →</span>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>
    </MotionReveal>

    <section className="section disclosure">
      <div>
        <span className="eyebrow">Proof status</span>
        <h3>What evidence exists today.</h3>
        <p>Each project above has a verified source snapshot and a read-only public URL check. Neither establishes a client relationship, provider success, uptime, or a measurable outcome.</p>
      </div>
      <div className="disclosure-box">
        Allowed wording for all projects: <strong>PORTFOLIO DEMONSTRATION — capability proof; not a client engagement.</strong> No testimonial, metric, benchmark, or provider callback is attached to this work, and none will be added without reproducible evidence and named approval.
      </div>
    </section>
    <section className="section">
      <span className="eyebrow">Ready to fix your workflow?</span>
      <h2>Have your own enquiry path reviewed.</h2>
      <div className="hero-actions">
        <a className="button" href="/audit">Request a Business Leak Audit</a>
        <a className="button secondary" href="/scope">Request scope</a>
      </div>
    </section>
  </main>;
}
