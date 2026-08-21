import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Process — IronWake',
  description: 'The map, fix, test, document method IronWake uses to turn a missed-inquiry gap into verified operating work.',
  alternates: { canonical: canonicalUrl("/process") },
};

const stages = [
  ['01 / map', 'Map', 'Identify the exact handoff where a visitor loses context or a team loses ownership of a lead. This stage produces a written boundary (the diagnostic scope-lock); the implementation phase that follows is the design-and-build phase where IronWake designs UI/UX, writes frontend and backend code, integrates APIs, and deploys the complete system.'],
  ['02 / fix', 'Fix', 'Implement the smallest system that closes the gap; for larger custom work (full website + AI receptionist + CRM + booking) the implementation phase is also right-sized, with explicit deliverables, milestones, and acceptance criteria documented in the SOW.'],
  ['03 / test', 'Test', 'Database and API behaviour is verified before any interface is allowed to show a success state. A green screen is never treated as proof by itself.'],
  ['04 / document', 'Document', 'Record what was verified, what remains pending, and what evidence supports each claim. Unverified states stay labelled rather than implied.']
];

export default function ProcessPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Process", path: "/process" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">How IronWake works</span><h1>Understand the gap before adding another tool.</h1><p className="reading-width">Map the handoff, fix the smallest useful part, test the real state, and document what can be trusted.</p><a className="button" href="/audit">Start with my workflow</a></section>
    <MotionReveal><section className="journey"><span className="eyebrow">The four-step method</span><h2>One clear decision at each stage.</h2><div className="grid-2 journey-grid">{stages.map(([label, title, text]) => <article key={title}><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">Why this order</span><h3>Evidence before the interface, not after it.</h3><p className="reading-width">Test runs before an interface is trusted to show success, and documentation runs before a claim is repeated publicly.</p></div><div className="disclosure-box">Scope, price, and delivery terms are agreed as <strong>Request scope</strong> until reviewed. This page does not commit IronWake to a fixed timeline, price, or guaranteed outcome.</div></section></MotionReveal>
  </main>;
}
