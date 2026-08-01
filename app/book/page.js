import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { BookingPreview } from './BookingPreview';

export const metadata = {
  title: 'Book — IronWake',
  description: 'Scheduling is not yet connected at IronWake. This page explains the current state and the working request path.'
};

export default function BookPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Book / IronWake</span><h1>Make the first conversation easier to place.</h1><p>Calendar confirmation is not connected yet. Start with a preferred date and window; IronWake reviews it before anything is booked or an invitation is sent.</p></section>
    <section className="section intro"><BookingPreview /></section>
    <section className="section disclosure"><div><span className="eyebrow">What works today</span><h3>Request scope, reviewed by a person.</h3><p>Until scheduling is verified end to end, every meeting request goes through the same reviewed intake as any other inquiry.</p></div><div className="disclosure-box">A submitted Business Leak Audit request is saved first, then reviewed by the owner within one Asia/Kolkata business day. No request on this site is treated as a confirmed appointment unless a connected calendar provider says so.</div></section>
    <SiteFooter />
  </main>;
}
