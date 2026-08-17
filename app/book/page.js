import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { BookingPreview } from './BookingPreview';
import { MotionReveal } from '../components/MotionReveal';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Book — IronWake',
  description: 'Scheduling is not yet connected at IronWake. This page explains the current state and the working request path.',
  alternates: { canonical: canonicalUrl("/book") },
};

export default function BookPage() {
  return <main className="shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Book", path: "/book" },
        ])) }} />

    <SiteHeader />
    <section className="hero compact"><span className="eyebrow">Request a conversation</span><h1>Tell IronWake when you would like to talk.</h1><p>Choose a preferred date and time window. This sends a request for human review—it does not confirm an appointment or send a calendar invitation.</p></section>
    <MotionReveal><section className="section intro"><BookingPreview /></section></MotionReveal>
    <MotionReveal><section className="section disclosure"><div><span className="eyebrow">What happens next</span><h3>A person reviews the request.</h3><p>Until scheduling is connected and verified, every meeting request goes through the same reviewed intake as any other enquiry.</p></div><div className="disclosure-box">Submitting this form records your preference only. No appointment is confirmed unless IronWake follows up with an explicit confirmation.</div></section></MotionReveal>
    <SiteFooter />
  </main>;
}
