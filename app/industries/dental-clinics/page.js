import { SiteHeader } from '../../components/SiteHeader';

import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Dental & Private Clinics — IronWake Industries',
  description: 'Administrative front-desk intake and booking patterns for dental and private clinics. Not a clinical, diagnostic, or compliance service.',
  alternates: { canonical: canonicalUrl("/industries/dental-clinics") },
};

const leaks = [
  ['01 / phone', 'Calls during patient hours', 'A front desk handling an in-person patient cannot always answer, and a caller who reaches voicemail often does not leave a message.'],
  ['02 / intake', 'Intake-to-booking gap', 'A submitted intake form needs a reviewed booking request and a next action, not just a stored form entry.'],
  ['03 / follow-up', 'Follow-up consistency', 'A prospective patient who asked a question but did not book needs a named owner and a due date, not a hope that someone remembers.']
];

const systems = [
  ['/systems/trust-lead-capture', 'Trust and Lead Capture', 'Server-validated intake with a durable record and logged consent, built for a form that asks for real information.'],
  ['/systems/booking-control', 'Booking Certainty', 'Truthful requested and confirmed states, so a submitted request is never shown as a confirmed appointment before a person confirms it.']
];

export default function DentalClinicsPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Industries", path: "/industries" },
              { name: "Dental Clinics", path: "/industries/dental-clinics" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Industries / Dental & Private Clinics</span><h1>Front-desk and intake operations — not a clinical service.</h1><p>This page describes administrative reception and intake workflow only. It is not medical, diagnostic, legal, or compliance advice, and IronWake does not provide clinical services or claim regulatory compliance on a clinic’s behalf without a separate, reviewed engagement.</p></section>
    <section className="section intro"><span className="eyebrow">Where the leak usually is</span><h2>Three moments a request gets lost.</h2><div className="industry-grid">{leaks.map(([label, title, text]) => <article className="industry-card" key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="section"><span className="eyebrow">Relevant systems</span><h2>What actually addresses this today.</h2><div className="system-grid">{systems.map(([href, title, text]) => <a href={href} key={href}><article className="system-card"><h3>{title}</h3><p>{text}</p><span className="card-link">Explore this system →</span></article></a>)}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Related demonstration</span><h3>DentaCare Intake</h3><p>A portfolio demonstration of a clinic-style front-desk intake flow.</p></div><div className="disclosure-box">This is a capability demonstration, not a client result and not a clinical system. It does not connect to any real clinic-management or patient-record platform. <a href="/work/dentacare-pro">View the demonstration →</a></div></section>
    <section className="section"><span className="eyebrow">Next step</span><h2>Have your own intake-to-booking path reviewed.</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section>
  </main>;
}
