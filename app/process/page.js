import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

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
    <section className="hero compact"><span className="eyebrow">How IronWake works</span><h1>Understand the gap before adding another tool.</h1><p>Map the handoff, fix the smallest useful part, test the real state, and document what can be trusted.</p><a className="button" href="/audit">Start with my workflow</a></section>
    <MotionReveal><section className="journey"><span className="eyebrow">The four-step method</span><h2>One clear decision at each stage.</h2><div className="journey-grid">{stages.map(([label, title, text]) => <article key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">Why this order</span><h3>Evidence before the interface, not after it.</h3><p>Test runs before an interface is trusted to show success, and documentation runs before a claim is repeated publicly.</p></div><div className="disclosure-box">Scope, price, and delivery terms are agreed as <strong>Request scope</strong> until reviewed. This page does not commit IronWake to a fixed timeline, price, or guaranteed outcome.</div></section></MotionReveal>
    <SiteFooter />
  </main>;
}
