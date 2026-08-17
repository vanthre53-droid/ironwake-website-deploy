import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Systems — IronWake',
  description: 'How IronWake structures inquiry, booking, follow-up, and reception work, and what remains request-only until a provider is connected.',
  alternates: { canonical: canonicalUrl("/systems") },
};

const systems = [
  ['01 / inquiry integrity', 'Missed Lead Recovery', 'Every inquiry is written to a durable record before any notification attempt runs. A dropped notification cannot erase the inquiry, and a review task can retain a next action and due date even when no provider is configured.', 'Live intake; provider pending', '/systems/missed-lead-recovery', 'M21 3l-7 7M4 14l5 5 8-8'],
  ['02 / booking control', 'Booking Certainty', 'Maps the handoff from a booking request to a named next action and owner. Until a calendar provider is connected and verified, every booking stays a reviewed request rather than a confirmed slot.', 'Request-only; provider pending', '/systems/booking-control', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'],
  ['03 / trust layer', 'Trust and Lead Capture', 'Validates and records every public form submission before any notification is attempted, with a hidden spam trap and no administrative credentials shipped to the browser.', 'Operating locally today', '/systems/trust-lead-capture', 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'],
  ['04 / reception layer', 'AI Receptionist', 'A future system category for first-response triage. Scope, provider, and disclosure rules are not yet approved, so this category has no connected behaviour or claimed outcome.', 'Not yet built', '/systems/ai-receptionist', 'M3 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5 1h8M9 15h6']
];

export default function SystemsPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Systems", path: "/systems" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">IronWake systems</span><h1>Give every enquiry an owner and a next step.</h1><p>Choose the part of your workflow that is hardest to see. Each page shows how that handoff works, what is already proven, and what still needs a provider.</p><a className="button" href="/audit">Find my workflow leak</a></section>
    <section className="section intro"><span className="eyebrow">Choose a system</span><h2>Start where customers are waiting.</h2><div className="system-grid">{systems.map(([label, title, text, state, href, icon]) => <a href={href} key={href}><article className="system-card"><span className="system-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg></span><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p><span className="card-link">{state} →</span></article></a>)}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Reading the labels</span><h3>Verified, request-only, and not-yet-built are different things.</h3><p>IronWake does not describe a planned category as though it were connected, and does not describe a request-only flow as though it were a live confirmation.</p></div><div className="disclosure-box">A system is only called live once its database record, notification path, and (where relevant) signed provider callback are verified. Until then it is labelled request-only, pending, or a future category — never presented as delivered.</div></section>
    <SiteFooter />
  </main>;
}
