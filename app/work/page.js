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

  // ── 40 personalised salon demos (UK + India) ──
  { id: 'aakaaraa-salon-hyderabad-in', name: 'AAKAARAA SALON (Hyderabad)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 75', url: 'https://ironwake.dev/work/aakaaraa-salon-hyderabad-in/demo.html', caseHref: '/work/aakaaraa-salon-hyderabad-in' },
  { id: 'above-salons-leeds-uk', name: 'Above Salons (Leeds)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 70', url: 'https://ironwake.dev/work/above-salons-leeds-uk/demo.html', caseHref: '/work/above-salons-leeds-uk' },
  { id: 'atmos-hair-studio-glasgow-uk', name: 'ATMOS hair studio (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/atmos-hair-studio-glasgow-uk/demo.html', caseHref: '/work/atmos-hair-studio-glasgow-uk' },
  { id: 'bellissimo-nail-studio-mumbai-in', name: 'Bellissimo Nail Studio (Mumbai)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 75', url: 'https://ironwake.dev/work/bellissimo-nail-studio-mumbai-in/demo.html', caseHref: '/work/bellissimo-nail-studio-mumbai-in' },
  { id: 'bon-vivant-glasgow-uk', name: 'Bon Vivant (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/bon-vivant-glasgow-uk/demo.html', caseHref: '/work/bon-vivant-glasgow-uk' },
  { id: 'brother-barbers-glasgow-uk', name: 'brother-barbers-glasgow-uk', industry: 'Salons & Spas', tag: 'Voice-AI booking demo', url: '', caseHref: '/work/brother-barbers-glasgow-uk' },
  { id: 'byres-road-barbers-glasgow-uk', name: 'Byres Road Barbers (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 70', url: 'https://ironwake.dev/work/byres-road-barbers-glasgow-uk/demo.html', caseHref: '/work/byres-road-barbers-glasgow-uk' },
  { id: 'coia-hairdressing-glasgow-uk', name: 'Coia Hairdressing (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/coia-hairdressing-glasgow-uk/demo.html', caseHref: '/work/coia-hairdressing-glasgow-uk' },
  { id: 'dapperwolf-glasgow-uk', name: 'Dapperwolf (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/dapperwolf-glasgow-uk/demo.html', caseHref: '/work/dapperwolf-glasgow-uk' },
  { id: 'dessange-salon-spa-mumbai-in', name: 'Dessange Salon & Spa (Mumbai)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 75', url: 'https://ironwake.dev/work/dessange-salon-spa-mumbai-in/demo.html', caseHref: '/work/dessange-salon-spa-mumbai-in' },
  { id: 'edition-salon-glasgow-uk', name: 'Edition Salon (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/edition-salon-glasgow-uk/demo.html', caseHref: '/work/edition-salon-glasgow-uk' },
  { id: 'enrich-salon-mumbai-in', name: 'Enrich Salon (Mumbai)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 75', url: 'https://ironwake.dev/work/enrich-salon-mumbai-in/demo.html', caseHref: '/work/enrich-salon-mumbai-in' },
  { id: 'eutopia-glasgow-uk', name: 'Eutopia (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/eutopia-glasgow-uk/demo.html', caseHref: '/work/eutopia-glasgow-uk' },
  { id: 'geetanjali-salon-delhi-in', name: 'Geetanjali Salon (Delhi)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 85', url: 'https://ironwake.dev/work/geetanjali-salon-delhi-in/demo.html', caseHref: '/work/geetanjali-salon-delhi-in' },
  { id: 'goat-glasgow-uk', name: 'Goat (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/goat-glasgow-uk/demo.html', caseHref: '/work/goat-glasgow-uk' },
  { id: 'green-trends-hyderabad-in', name: 'Green Trends (Hyderabad)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 75', url: 'https://ironwake.dev/work/green-trends-hyderabad-in/demo.html', caseHref: '/work/green-trends-hyderabad-in' },
  { id: 'hely-glasgow-uk', name: 'Hely (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/hely-glasgow-uk/demo.html', caseHref: '/work/hely-glasgow-uk' },
  { id: 'hot-tanning-salon-bearsden-glasgow-uk', name: 'hot-tanning-salon-bearsden-glasgow-uk', industry: 'Salons & Spas', tag: 'Voice-AI booking demo', url: '', caseHref: '/work/hot-tanning-salon-bearsden-glasgow-uk' },
  { id: 'hot-tanning-salon-watson-st-glasgow-uk', name: 'hot-tanning-salon-watson-st-glasgow-uk', industry: 'Salons & Spas', tag: 'Voice-AI booking demo', url: '', caseHref: '/work/hot-tanning-salon-watson-st-glasgow-uk' },
  { id: 'jean-claude-olivier-mumbai-in', name: 'Jean Claude Olivier (Mumbai)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 100', url: 'https://ironwake.dev/work/jean-claude-olivier-mumbai-in/demo.html', caseHref: '/work/jean-claude-olivier-mumbai-in' },
  { id: 'lakme-salon-bangalore-in', name: 'Lakme Salon (Bangalore)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 85', url: 'https://ironwake.dev/work/lakme-salon-bangalore-in/demo.html', caseHref: '/work/lakme-salon-bangalore-in' },
  { id: 'lakme-salon-kolkata-in', name: 'lakme-salon-kolkata-in', industry: 'Salons & Spas', tag: 'Voice-AI booking demo', url: '', caseHref: '/work/lakme-salon-kolkata-in' },
  { id: 'luxe-skin-glasgow-uk', name: 'Luxe Skin (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 70', url: 'https://ironwake.dev/work/luxe-skin-glasgow-uk/demo.html', caseHref: '/work/luxe-skin-glasgow-uk' },
  { id: 'matthew-s-barber-shop-leeds-uk', name: 'matthew-s-barber-shop-leeds-uk', industry: 'Salons & Spas', tag: 'Voice-AI booking demo', url: '', caseHref: '/work/matthew-s-barber-shop-leeds-uk' },
  { id: 'mr-blonde-glasgow-uk', name: 'mr-blonde-glasgow-uk', industry: 'Salons & Spas', tag: 'Voice-AI booking demo', url: '', caseHref: '/work/mr-blonde-glasgow-uk' },
  { id: 'mudd-salon-and-day-spa-mumbai-in', name: 'Mudd Salon and Day Spa (Mumbai)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 75', url: 'https://ironwake.dev/work/mudd-salon-and-day-spa-mumbai-in/demo.html', caseHref: '/work/mudd-salon-and-day-spa-mumbai-in' },
  { id: 'new-avalon-chennai-in', name: 'New Avalon (Chennai)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 75', url: 'https://ironwake.dev/work/new-avalon-chennai-in/demo.html', caseHref: '/work/new-avalon-chennai-in' },
  { id: 'o2-spa-bangalore-in', name: 'O2 Spa (Bangalore)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 75', url: 'https://ironwake.dev/work/o2-spa-bangalore-in/demo.html', caseHref: '/work/o2-spa-bangalore-in' },
  { id: 'quirk-studio-a-luxury-salon-delhi-in', name: 'Quirk Studio - A luxury Salon (Delhi)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 75', url: 'https://ironwake.dev/work/quirk-studio-a-luxury-salon-delhi-in/demo.html', caseHref: '/work/quirk-studio-a-luxury-salon-delhi-in' },
  { id: 'rinky-sandhal-unisex-salon-delhi-in', name: 'Rinky Sandhal Unisex Salon (Delhi)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 75', url: 'https://ironwake.dev/work/rinky-sandhal-unisex-salon-delhi-in/demo.html', caseHref: '/work/rinky-sandhal-unisex-salon-delhi-in' },
  { id: 'roseberry-spa-delhi-in', name: 'Roseberry Spa (Delhi)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 75', url: 'https://ironwake.dev/work/roseberry-spa-delhi-in/demo.html', caseHref: '/work/roseberry-spa-delhi-in' },
  { id: 'sameerscissor-com-delhi-in', name: 'Sameerscissor.com (Delhi)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 75', url: 'https://ironwake.dev/work/sameerscissor-com-delhi-in/demo.html', caseHref: '/work/sameerscissor-com-delhi-in' },
  { id: 'shaakya-body-spa-bangalore-in', name: 'Shaakya Body Spa (Bangalore)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 75', url: 'https://ironwake.dev/work/shaakya-body-spa-bangalore-in/demo.html', caseHref: '/work/shaakya-body-spa-bangalore-in' },
  { id: 'shaakya-salon-spa-bangalore-in', name: 'Shaakya Salon & Spa (Bangalore)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 75', url: 'https://ironwake.dev/work/shaakya-salon-spa-bangalore-in/demo.html', caseHref: '/work/shaakya-salon-spa-bangalore-in' },
  { id: 'sinh-salon-delhi-in', name: 'Sinh Salon (Delhi)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 75', url: 'https://ironwake.dev/work/sinh-salon-delhi-in/demo.html', caseHref: '/work/sinh-salon-delhi-in' },
  { id: 'soul-space-glasgow-uk', name: 'Soul Space (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/soul-space-glasgow-uk/demo.html', caseHref: '/work/soul-space-glasgow-uk' },
  { id: 'the-gentleman-s-barber-glasgow-uk', name: 'The Gentleman's Barber (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/the-gentleman-s-barber-glasgow-uk/demo.html', caseHref: '/work/the-gentleman-s-barber-glasgow-uk' },
  { id: 'truefitt-hill-prabhadevi-mumbai-in', name: 'truefitt-hill-prabhadevi-mumbai-in', industry: 'Salons & Spas', tag: 'Voice-AI booking demo', url: '', caseHref: '/work/truefitt-hill-prabhadevi-mumbai-in' },
  { id: 'volume-unisex-salon-glasgow-uk', name: 'Volume unisex salon (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · WARM 70', url: 'https://ironwake.dev/work/volume-unisex-salon-glasgow-uk/demo.html', caseHref: '/work/volume-unisex-salon-glasgow-uk' },
  { id: 'westend-hair-glasgow-uk', name: 'Westend Hair (Glasgow)', industry: 'Salons & Spas', tag: 'Voice-AI booking demo · HOT 70', url: 'https://ironwake.dev/work/westend-hair-glasgow-uk/demo.html', caseHref: '/work/westend-hair-glasgow-uk' },
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
      <h1>Forty-nine businesses. One principle: every enquiry gets an owner.</h1>
      <p className="reading-width">Each project below is a portfolio demonstration. The 40 salon cards are personalised builds for real UK and Indian salon businesses (public info only — name, address, phone, services), created as cold-outreach demos for a targeted acquisition campaign. They are capability proofs, not client engagements or measured outcomes. Most have a live external prototype you can open and inspect; a few are still being prepared and are clearly labelled. These are capability proofs — not client engagements or measured results. Names like "Harbour Estates", "Aura Archives", and "BlueStone" are fictional themes mapped to prototype URLs; the underlying build is the demonstration.</p>
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
        <p className="reading-width">Each project above has a verified source snapshot and a read-only public URL check. Neither establishes a client relationship, provider success, uptime, or a measurable outcome. The 40 salon demos are personalised to real businesses using only publicly available information (business name, address, phone, website, listed services). They are campaign demonstrations for cold outreach; no salon has been contacted by IronWake.</p>
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
