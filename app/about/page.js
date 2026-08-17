import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { MotionReveal } from '../components/MotionReveal';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'About — IronWake',
  description: 'IronWake is a founder-led systems practice for service businesses, built around labelled, verified claims instead of theatre.',
  alternates: { canonical: canonicalUrl("/about") },
};

const labels = [
  ['DEMONSTRATION', 'A capability proof, not a client engagement, result, or provider integration.'],
  ['PROVIDER PROOF PENDING', 'A workflow exists, but the external provider connection behind it is not yet verified.'],
  ['AWAITING VERIFICATION', 'A claim is drafted but has not yet passed the evidence and approval standard this page describes.']
];

export default function AboutPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">About IronWake</span><h1>Build trust by making the next action clear.</h1><p>IronWake is a founder-led systems practice for service businesses. The work begins with one real enquiry or booking handoff and improves it without hiding uncertainty behind software.</p><a className="button" href="/audit">Show me where the gap is</a></section>
    <MotionReveal><section className="section founder"><div className="founder-mark">IRONWAKE<br />SYSTEMS PRACTICE</div><div><span className="eyebrow">Founder</span><h2>Revanth Nunna</h2><p>IronWake is founder-led. The practice starts by making one business-critical handoff visible — an inquiry, a booking, a follow-up — and making the next action for it clear and owned, before adding any new tool or claim.</p><span className="micro">Founder, IronWake</span></div></section></MotionReveal>
    <MotionReveal><section className="section intro"><span className="eyebrow">Operating standard</span><h2>What the labels on this site mean.</h2><div className="system-grid">{labels.map(([title, text]) => <article className="system-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">Verification method</span><h3>Database and API evidence before an interface is trusted.</h3><p>A page is never allowed to imply a database commit, a sent notification, a booking, or a payment unless that evidence actually exists behind it.</p></div><div className="disclosure-box">No client, testimonial, logo, metric, benchmark, guarantee, or provider status is published without reproducible evidence and a named approval. Missing information is hidden or shown as a pending state — it is never filled in with a placeholder that reads like a fact.</div></section></MotionReveal>
    <SiteFooter />
  </main>;
}
