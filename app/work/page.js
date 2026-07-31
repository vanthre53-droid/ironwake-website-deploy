import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Work — IronWake',
  description: 'Portfolio demonstrations from IronWake, labelled and scoped as capability proof rather than client engagements.'
};

const demonstrations = [
  ['RapidPulse Response', 'Emergency-service workflow demonstration focused on inquiry-to-response visibility: how fast a request is acknowledged and who owns the next action.', '/work/rapidpulse'],
  ['DentaCare Intake', 'Clinic intake-flow demonstration covering the handoff from an enquiry form to a reviewed booking request, shown without any live clinic-management connection.', '/work/dentacare-pro'],
  ['Atelier Safe', 'Consultation-system demonstration for appointment-led businesses, covering request capture and follow-up ownership with no implied booking-provider connection.', '/work/atelier']
];

export default function WorkPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Work / IronWake</span><h1>Demonstrations, not claims.</h1><p>Every project below is a portfolio demonstration built to prove a capability. None is presented as a client engagement, a verified provider integration, or a measured result.</p></section>
    <section className="section intro"><span className="eyebrow">Portfolio demonstrations</span><h2>Case engineering.</h2><div className="case-grid"><a href={demonstrations[0][2]}><article className="case-large"><div className="case-art" /><div className="case-copy"><span className="micro">Portfolio demonstration</span><h3>{demonstrations[0][0]}</h3><p>{demonstrations[0][1]}</p></div></article></a><div className="case-stack">{demonstrations.slice(1).map(([title, text, href]) => <a href={href} key={href}><article><span className="micro">Portfolio demonstration</span><h3>{title}</h3><p>{text}</p></article></a>)}</div></div></section>
    <section className="section disclosure"><div><span className="eyebrow">Proof status</span><h3>What evidence exists today.</h3><p>Each project above has a verified source snapshot and a read-only public URL check. Neither establishes a client relationship, provider success, uptime, or a measurable outcome.</p></div><div className="disclosure-box">Allowed wording for all three: <strong>PORTFOLIO DEMONSTRATION — capability proof; not a client engagement.</strong> No testimonial, metric, benchmark, or provider callback is attached to this work, and none will be added without reproducible evidence and named approval.</div></section>
    <SiteFooter />
  </main>;
}
