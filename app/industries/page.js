import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Industries — IronWake',
  description: 'How IronWake’s inquiry, booking, and follow-up systems map to specific industries. Only industries with original, reviewed content are listed here.',
  alternates: { canonical: canonicalUrl("/industries") },
};

const industries = [
  ['/industries/home-services', '01 / dispatch-adjacent', 'Home Services', 'For teams where a missed call during an active job can lose the next job.'],
  ['/industries/dental-clinics', '02 / front desk', 'Dental & Private Clinics', 'For clinics balancing phone, walk-in, and online requests without dropping any of them.'],
  ['/industries/salons-spas', '03 / consultation-led', 'Salons & Spas', 'For consultation-led businesses where follow-up after the first enquiry decides the booking.']
];

export default function IndustriesPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Industries", path: "/industries" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Industries</span><h1>Find the enquiry gap that matches your business.</h1><p className="reading-width">Each guide starts with a familiar customer journey, shows where ownership usually breaks, and links to the systems that address it.</p></section>
    <MotionReveal><section className="section intro"><span className="eyebrow">Choose your industry</span><h2>Start with the workflow you recognise.</h2><div className="grid-3 industry-grid">{industries.map(([href, label, title, text]) => <a href={href} key={href}><article className="industry-card"><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p><span className="card-link">View industry guide →</span></article></a>)}</div></section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">Reading these pages</span><h3>No invented client counts or local-market statistics.</h3><p className="reading-width">An industry page describes how existing systems apply to that industry’s operational pattern. It does not claim a client roster, a service area, a certification, or a result specific to that industry.</p></div><div className="disclosure-box">Pricing, provider connections, and case outcomes remain the same truthful, request-only state described on the relevant system and work pages. Nothing on an industry page overrides that.</div></section></MotionReveal>
    <MotionReveal><section className="section"><span className="eyebrow">Next step</span><h2>Not sure which system applies?</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section></MotionReveal>
  </main>;
}
