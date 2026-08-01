import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

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
    <section className="hero scope-hero"><span className="eyebrow">Request scope / IronWake</span><h1>Get the right shape before the build.</h1><p>IronWake scopes work against a real operating gap, not a prewritten package. Prices remain private until scope, provider costs, legal terms, and acceptance criteria are agreed.</p><a className="button" href="/audit">Request a Business Leak Audit</a></section>
    <section className="scope-shapes"><span className="eyebrow">Engagement shapes</span><div>{shapes.map(([title, includes, excludes], index) => <article key={title}><span className="scope-index">0{index + 1}</span><h2>{title}</h2><p>{includes}</p><small>Boundary — {excludes}</small></article>)}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">How quoting works</span><h3>Scope first. Written acceptance second.</h3><p>A proposed scope identifies the operating problem, deliverables, exclusions, provider and hosting costs, dependencies, target timeline, support boundary, and acceptance checks. A request is not a contract, invoice, or delivery commitment.</p></div><div className="disclosure-box"><strong>Provider and hosting costs</strong><br />Any third-party account or usage cost is named separately before it is activated. Payments, tax treatment, refunds, and legal terms remain deferred until the adult/legal owner approves them.</div></section>
    <SiteFooter />
  </main>;
}
