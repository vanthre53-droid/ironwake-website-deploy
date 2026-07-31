import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Book — IronWake',
  description: 'Scheduling is not yet connected at IronWake. This page explains the current state and the working request path.'
};

export default function BookPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Book / IronWake</span><h1>Scheduling isn’t connected yet.</h1><p>IronWake intends to use Cal.com for discovery-call scheduling. That connection has not been approved or verified, so this page does not embed a live calendar and does not accept a booking.</p><a className="button" href="/audit">Request a Business Leak Audit</a></section>
    <section className="section intro"><span className="eyebrow">Provider proof pending</span><div className="embed-placeholder" role="note" aria-label="Cal.com embed placeholder, not yet connected"><strong>Cal.com embed placeholder</strong><p>No external script, iframe, or network request loads here. Once a Cal.com account is connected, tested, and approved, a real scheduling embed will replace this box — and this notice will be removed at the same time.</p></div></section>
    <section className="section disclosure"><div><span className="eyebrow">What works today</span><h3>Request scope, reviewed by a person.</h3><p>Until scheduling is verified end to end, every meeting request goes through the same reviewed intake as any other inquiry.</p></div><div className="disclosure-box">A submitted Business Leak Audit request is saved first, then reviewed by the owner within one Asia/Kolkata business day. No request on this site is treated as a confirmed appointment unless a connected calendar provider says so.</div></section>
    <SiteFooter />
  </main>;
}
