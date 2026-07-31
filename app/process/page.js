import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Process — IronWake',
  description: 'The map, fix, test, document method IronWake uses to turn a missed-inquiry gap into verified operating work.'
};

const stages = [
  ['01 / map', 'Map', 'Identify the exact handoff where a visitor loses context or a team loses ownership of a lead. This stage produces a written boundary, not a redesign.'],
  ['02 / fix', 'Fix', 'Implement the smallest system that closes the gap. A bigger stack is not preferred over an understandable one.'],
  ['03 / test', 'Test', 'Database and API behaviour is verified before any interface is allowed to show a success state. A green screen is never treated as proof by itself.'],
  ['04 / document', 'Document', 'Record what was verified, what remains pending, and what evidence supports each claim. Unverified states stay labelled rather than implied.']
];

export default function ProcessPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Process / IronWake</span><h1>Map. Fix. Test. Document.</h1><p>A small, reviewable process for turning a missed inquiry or follow-up gap into visible operating work, without unapproved contract, payment, uptime, or SLA claims.</p><a className="button" href="/audit">Request a Business Leak Audit</a></section>
    <section className="journey"><span className="eyebrow">Method</span><h2>Four stages, in order.</h2><div className="journey-grid">{stages.map(([label, title, text]) => <article key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Why this order</span><h3>Evidence before the interface, not after it.</h3><p>Test runs before an interface is trusted to show success, and documentation runs before a claim is repeated publicly.</p></div><div className="disclosure-box">Scope, price, and delivery terms are agreed as <strong>Request scope</strong> until reviewed. This page does not commit IronWake to a fixed timeline, price, or guaranteed outcome.</div></section>
    <SiteFooter />
  </main>;
}
