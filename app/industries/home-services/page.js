import { SiteHeader } from '../../components/SiteHeader';

import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Home Services — IronWake Industries',
  description: 'How missed-lead-recovery and booking-control apply to emergency and home-service businesses, where a missed call during a job can lose the next one.',
  alternates: { canonical: canonicalUrl("/industries/home-services") },
};

const leaks = [
  ['01 / during a job', 'Mid-job calls', 'A crew that is on-site cannot always answer, and a call that goes unanswered is not automatically written down anywhere.'],
  ['02 / after hours', 'After-hours requests', 'A request submitted outside working hours needs a durable record and a clear owner for the next morning, not a message that is easy to lose in a shared inbox.'],
  ['03 / between jobs', 'Follow-up between jobs', 'A quote or callback promised between jobs needs a task with a due date, not a mental note.']
];

const systems = [
  ['/systems/missed-lead-recovery', 'Missed Lead Recovery', 'A durable record for every inquiry before any notification is attempted, so a missed call or message cannot silently disappear.'],
  ['/systems/booking-control', 'Booking Certainty', 'Truthful requested and confirmed states for callbacks and appointments, instead of an implied instant booking.']
];

export default function HomeServicesPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Industries", path: "/industries" },
              { name: "Home Services", path: "/industries/home-services" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Industries / Home Services</span><h1>An unanswered call should not be the end of the lead.</h1><p>Home-service and emergency-adjacent businesses lose work when a call, text, or form goes unanswered during an active job. This page describes the operational pattern, not a telephony or dispatch integration IronWake does not yet offer.</p></section>
    <section className="section intro"><span className="eyebrow">Where the leak usually is</span><h2>Three moments a request gets lost.</h2><div className="industry-grid">{leaks.map(([label, title, text]) => <article className="industry-card" key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="section"><span className="eyebrow">Relevant systems</span><h2>What actually addresses this today.</h2><div className="system-grid">{systems.map(([href, title, text]) => <a href={href} key={href}><article className="system-card"><h3>{title}</h3><p>{text}</p><span className="card-link">Explore this system →</span></article></a>)}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Related demonstration</span><h3>RapidPulse Response</h3><p>A portfolio demonstration of inquiry-to-response ownership for an emergency-service scenario.</p></div><div className="disclosure-box">This is a capability demonstration, not a client result. It does not integrate with a real dispatch, telephony, or CRM platform. <a href="/work/rapidpulse">View the demonstration →</a></div></section>
    <section className="section"><span className="eyebrow">Next step</span><h2>Have your own call-to-callback path reviewed.</h2><a className="button" href="/audit">Request a Business Leak Audit</a></section>
  </main>;
}
