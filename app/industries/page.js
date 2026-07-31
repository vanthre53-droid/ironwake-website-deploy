import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Industries — IronWake',
  description: 'How IronWake’s inquiry, booking, and follow-up systems map to specific industries. Only industries with original, reviewed content are listed here.'
};

const industries = [
  ['/industries/home-services', '01 / dispatch-adjacent', 'Home Services', 'For teams where a missed call during an active job can lose the next job.'],
  ['/industries/dental-clinics', '02 / front desk', 'Dental & Private Clinics', 'For clinics balancing phone, walk-in, and online requests without dropping any of them.'],
  ['/industries/salons-spas', '03 / consultation-led', 'Salons & Spas', 'For consultation-led businesses where follow-up after the first enquiry decides the booking.']
];

export default function IndustriesPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Industries / IronWake</span><h1>Where the systems get applied.</h1><p>Each page below maps a real operational pattern for that industry instead of restating general marketing claims. Only industries with original, reviewed content are listed; the rest stay unpublished rather than filled in with placeholders.</p></section>
    <section className="section intro"><span className="eyebrow">Industry index</span><h2>Three industries, mapped to real systems.</h2><div className="industry-grid">{industries.map(([href, label, title, text]) => <a href={href} key={href}><article className="industry-card"><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p><span className="card-link">View industry page →</span></article></a>)}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Reading these pages</span><h3>No invented client counts or local-market statistics.</h3><p>An industry page describes how existing systems apply to that industry’s operational pattern. It does not claim a client roster, a service area, a certification, or a result specific to that industry.</p></div><div className="disclosure-box">Pricing, provider connections, and case outcomes remain the same truthful, request-only state described on the relevant system and work pages. Nothing on an industry page overrides that.</div></section>
    <section className="section"><span className="eyebrow">Next step</span><h2>Not sure which system applies?</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section>
    <SiteFooter />
  </main>;
}
