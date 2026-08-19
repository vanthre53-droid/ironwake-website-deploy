import { Metadata } from 'next';
import { MotionReveal } from '../components/MotionReveal';

// ponytail: Industries index v13.
// Every metric on this page ties back to a verified IronWake pipeline or is
// omitted. No invented client counts, no invented percentages — see the
// "No invented client counts" section heading for the operating rule.
export const metadata = {
  title: 'Industries — IronWake',
  description:
    'How IronWake systems are scoped per industry. Field-appropriate architectures for home services, dental clinics, salons and spas, and dental practices.',
  alternates: { canonical: '/industries' },
  openGraph: {
    title: 'Industries — IronWake',
    description:
      'Field-appropriate architectures for home services, dental clinics, salons and spas, and dental practices.',
    url: '/industries',
  },
};

const INDUSTRIES = [
  {
    slug: 'home-services',
    eyebrow: '01 / home services',
    title: 'Home services',
    summary:
      'Missed-call recovery, quote-form capture, and consent logging for HVAC, plumbing, and on-site trades.',
  },
  {
    slug: 'dental-clinics',
    eyebrow: '02 / dental clinics',
    title: 'Dental clinics',
    summary:
      'Appointment-request intake, after-hours enquiry handling, and the audit trail owners need for first-time patient consent.',
  },
  {
    slug: 'salons-spas',
    eyebrow: '03 / salons and spas',
    title: 'Salons and spas',
    summary:
      'Booking-request capture with audit row per new customer, integrated with the consent log the lead-capture system maintains.',
  },
  {
    slug: 'dental',
    eyebrow: '04 / dental',
    title: 'Dental',
    summary:
      'A scoped companion page for solo dental practices that want the same intake architecture as multi-chair clinics without the multi-chair weight.',
  },
];

export default function IndustriesPage() {
  return (
    <main className="shell" aria-labelledby="industries-hero-heading">
      <section className="hero compact industries-hero">
        <span className="eyebrow">Industries</span>
        <h1 id="industries-hero-heading">
          Field-appropriate architectures, not a generic playbook.
        </h1>
        <p className="reading-width">
          Each industry page describes the IronWake systems that fit the way that
          business actually takes work in. No invented client counts, no fabricated
          percentages — every metric on this page is verified or omitted.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a Business Leak Audit</a>
          <a className="button ghost" href="#industries">See the industries</a>
          <a className="button ghost" href="/industries/home-services">Home services</a>
          <a className="button ghost" href="/industries/dental-clinics">Dental clinics</a>
          <a className="button ghost" href="/industries/salons-spas">Salons and spas</a>
          <a className="button ghost" href="/pricing">View pricing</a>
        </div>
      </section>

      <MotionReveal>
        <section className="section" aria-labelledby="industries-list-heading" id="industries">
          <span className="eyebrow">Industries</span>
          <h2 id="industries-list-heading">Pick a field to see the architecture.</h2>
          <p className="reading-width">
            No invented client counts. Each card links to a detail page that lists
            capabilities, outcomes, and the systems IronWake wires per industry.
          </p>
          <div className="industry-grid" role="list">
            {INDUSTRIES.map((i) => (
              <a
                key={i.slug}
                className="industry-card"
                href={`/industries/${i.slug}`}
                role="listitem"
              >
                <span className="micro">{i.eyebrow}</span>
                <h3>{i.title}</h3>
                <p>{i.summary}</p>
              </a>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section" aria-labelledby="industries-principle-heading">
          <span className="eyebrow">Operating principle</span>
          <h2 id="industries-principle-heading">No invented client counts.</h2>
          <p className="reading-width">
            Numbers on an industry page have to be earned. IronWake publishes the
            systems wired and the providers verified — and stops there.
          </p>
        </section>
      </MotionReveal>
    </main>
  );
}