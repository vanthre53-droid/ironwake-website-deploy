import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Systems — IronWake',
  description: 'How IronWake structures inquiry, booking, follow-up, and reception work, and what remains request-only until a provider is connected.'
};

const systems = [
  ['01 / inquiry integrity', 'Missed Lead Recovery', 'Every inquiry is written to a durable record before any notification attempt runs. A dropped notification cannot erase the inquiry, and the next action stays assigned to a real due date instead of a missed message.', 'Operating locally today', '/systems/missed-lead-recovery'],
  ['02 / booking control', 'Booking Certainty', 'Maps the handoff from a booking request to a named next action and owner. Until a calendar provider is connected and verified, every booking stays a reviewed request rather than a confirmed slot.', 'Request-only; provider pending', '/systems/booking-control'],
  ['03 / trust layer', 'Trust and Lead Capture', 'Validates and records every public form submission before any notification is attempted, with a hidden spam trap and no administrative credentials shipped to the browser.', 'Operating locally today', '/systems/trust-lead-capture'],
  ['04 / reception layer', 'AI Receptionist', 'A future system category for first-response triage. Scope, provider, and disclosure rules are not yet approved, so this category has no connected behaviour or claimed outcome.', 'Not yet built', '/systems/ai-receptionist']
];

export default function SystemsPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Systems / IronWake</span><h1>The operating layer for inquiry, booking, follow-up, and reception.</h1><p>Each system below is described by what it actually does today. Where a provider connection is still pending, that limitation is stated directly rather than implied away.</p><a className="button" href="/audit">Request a Business Leak Audit</a></section>
    <section className="section intro"><span className="eyebrow">Systems index</span><h2>Four categories, four different levels of proof.</h2><div className="system-grid">{systems.map(([label, title, text, state, href]) => <a href={href} key={href}><article className="system-card"><span className="micro">{label}</span><h3>{title}</h3><p>{text}</p><span className="card-link">{state}</span></article></a>)}</div></section>
    <section className="section disclosure"><div><span className="eyebrow">Reading the labels</span><h3>Verified, request-only, and not-yet-built are different things.</h3><p>IronWake does not describe a planned category as though it were connected, and does not describe a request-only flow as though it were a live confirmation.</p></div><div className="disclosure-box">A system is only called live once its database record, notification path, and (where relevant) signed provider callback are verified. Until then it is labelled request-only, pending, or a future category — never presented as delivered.</div></section>
    <SiteFooter />
  </main>;
}
