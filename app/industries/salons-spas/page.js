import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';

export const metadata = {
  title: 'Salons & Spas — IronWake Industries',
  description: 'How trust-lead-capture and booking-control apply to consultation-led salons and spas, where follow-up after the first enquiry decides the booking.'
};

const leaks = [
  ['01 / first contact', 'The first enquiry', 'A consultation request deserves a durable record and an acknowledgement, not a message that waits in a shared inbox.'],
  ['02 / follow-up', 'Inconsistent follow-up', 'Interest fades quickly after a first enquiry. A named owner and a due date matter more than a general intention to follow up.'],
  ['03 / booking state', 'Booking state honesty', 'A requested slot and a confirmed slot are different things, and a visitor should never be told they have a booking before a person confirms it.']
];

const systems = [
  ['/systems/trust-lead-capture', 'Trust and Lead Capture', 'Server-validated consultation requests with a durable record and logged consent.'],
  ['/systems/booking-control', 'Booking Certainty', 'Truthful requested and confirmed states for appointments, instead of an implied instant booking.']
];

export default function SalonsSpasPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Industries / Salons & Spas</span><h1>A consultation request is only useful if someone owns the follow-up.</h1><p>Consultation-led businesses lose bookings when follow-up after a first enquiry is inconsistent. This page describes the operational pattern, not a booking-calendar or payment integration IronWake does not yet offer.</p></section>
    <section className="section intro"><span className="eyebrow">Where the leak usually is</span><h2>Three moments a request gets lost.</h2><div className="industry-grid">{leaks.map(([label, title, text]) => <article className="industry-card" key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="section"><span className="eyebrow">Relevant systems</span><h2>What actually addresses this today.</h2><div className="system-grid">{systems.map(([href, title, text]) => <a href={href} key={href}><article className="system-card"><h3>{title}</h3><p>{text}</p><span className="card-link">Explore this system →</span></article></a>)}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Related demonstration</span><h3>Atelier Safe</h3><p>A portfolio demonstration of consultation-request capture and follow-up ownership.</p></div><div className="disclosure-box">This is a capability demonstration, not a client result. It does not connect to a live booking calendar, payment system, or inventory platform. <a href="/work/atelier">View the demonstration →</a></div></section>
    <section className="section"><span className="eyebrow">Next step</span><h2>Have your own consultation-to-booking path reviewed.</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section>
    <SiteFooter />
  </main>;
}
