import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

export const metadata = {
  title: 'Request scope — IronWake',
  description: 'How IronWake scopes a systems engagement before any price, provider cost, timeline, or support boundary is represented as agreed.'
};

const shapes = [
  ['Business Leak Audit', 'Map one business-critical inquiry, booking, follow-up, or reception handoff and identify the smallest next system to review.', 'No quote, provider connection, booking, or outcome is implied by an audit request.'],
  ['Workflow build', 'A bounded implementation after the relevant data, security, provider, and acceptance criteria have been agreed.', 'External provider accounts, usage charges, legal approvals, and deployment are separate decisions.'],
  ['Operating support', 'A reviewed support boundary for an already verified workflow, including documented ownership and escalation paths.', 'No SLA, availability commitment, monitoring claim, or recurring fee is public until approved in writing.']
];

export default function ScopePage() {
  return <main className="shell scope-page">
    <SiteHeader />
    <section className="hero scope-hero"><span className="eyebrow">Choose the next step</span><h1>Define the problem before choosing the build.</h1><p>Start with the operating gap, then agree the work, limits, provider costs, and acceptance checks in writing. No generic package or invented price.</p><a className="button" href="/audit">Start with a leak audit</a></section>
    <MotionReveal><section className="scope-shapes"><span className="eyebrow">Engagement shapes</span><div>{shapes.map(([title, includes, excludes], index) => <article key={title}><span className="scope-index">0{index + 1}</span><h2>{title}</h2><p>{includes}</p><small>Boundary — {excludes}</small></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">How quoting works</span><h3>Scope first. Written acceptance second.</h3><p>A proposed scope identifies the operating problem, deliverables, exclusions, provider and hosting costs, dependencies, target timeline, support boundary, and acceptance checks. A request is not a contract, invoice, or delivery commitment.</p></div><div className="disclosure-box"><strong>Provider and hosting costs</strong><br />Any third-party account or usage cost is named separately before it is activated. Payments, tax treatment, refunds, and legal terms remain deferred until the adult/legal owner approves them.</div></section></MotionReveal>
    <SiteFooter />
  </main>;
}
