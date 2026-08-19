import { Metadata } from 'next';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';

export const metadata = {
  title: 'Systems — IronWake',
  description:
    'Four operational systems IronWake builds for service businesses: Missed Lead Recovery, Booking Certainty, Trust and Lead Capture, and AI Receptionist planning.',
  alternates: { canonical: canonicalUrl('/systems') },
};

// v13 Pearl/Graphite/Petrol listing — de-congested 2-up grid at desktop,
// single column at narrow viewports. Each card surfaces category, status,
// and one sentence on what the system does — never a fake metric.
const systems = [
  {
    title: 'Missed Lead Recovery',
    eyebrow: '01 / Enquiry capture',
    href: '/systems/missed-lead-recovery',
    summary:
      'Captures after-hours enquiry signals so a real owner-email reply is sent. Owner-session delivery is connected; named assignee routing is not yet implemented.',
    status: 'Request-only; provider pending',
  },
  {
    title: 'Booking Certainty',
    eyebrow: '02 / Booking control',
    href: '/systems/booking-control',
    summary:
      'Separates a *requested* slot from a *confirmed* slot. Form submission alone can never reach the confirmed state — provider acknowledgement is required.',
    status: 'Request-only; provider pending',
  },
  {
    title: 'Trust and Lead Capture',
    eyebrow: '03 / Trust and Lead Capture',
    href: '/systems/trust-lead-capture',
    summary:
      'A form path that demonstrates hidden-trap, server-side validation, and the absence of any service-role key in the browser bundle.',
    status: 'Not yet built',
  },
  {
    title: 'AI Receptionist',
    eyebrow: '04 / AI Receptionist',
    href: '/systems/ai-receptionist',
    summary:
      'Plan, not a live receptionist. The site assistant is live; the client receptionist requires separately-scoped provider deployment.',
    status: 'Request-only; provider pending',
  },
];

export default function SystemsIndex() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'Systems', href: '/systems' }])) }} />
    <main className="shell">
      <section className="hero compact">
        <span className="eyebrow">Systems</span>
        <h1>Four operational systems, each kept honestly separate.</h1>
        <p className="reading-width">
          IronWake builds one narrow system at a time. Each page below states what the
          system does, what it does not yet do, and the provider work that is still
          outstanding. No system is described as live until the connection is verified.
        </p>
        <div className="hero-actions">
          <a className="button" href="/audit">Request a Business Leak Audit</a>
          <a className="button ghost" href="/pricing">View pricing</a>
        </div>
      </section>

      <section className="section intro" aria-labelledby="systems-grid-heading">
        <h2 id="systems-grid-heading">Pick the system that matches your leak.</h2>
        <p className="reading-width">
          Most service businesses lose momentum in two or three of the four areas
          below. Start with the one your customer hits first.
        </p>
        <div className="system-grid" role="list">
          {systems.map(({ title, eyebrow, href, summary, status }) => (
            <a key={title} className="system-card" href={href} role="listitem">
              <span className="micro">{eyebrow}</span>
              <h3>{title}</h3>
              <p>{summary}</p>
              <p className="micro system-card-status">{status}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="systems-truth-heading">
        <span className="eyebrow">Truth standard</span>
        <h2 id="systems-truth-heading">Capability versus status, kept separate.</h2>
        <p className="reading-width">
          Every system page distinguishes what the system is <em>capable of</em> from
          what is <em>currently connected</em>. The status line on each card is the
          shortest version of that gap. Nothing on this page is described as live
          without provider evidence to back it.
        </p>
      </section>
    </main>
    </>
  );
}