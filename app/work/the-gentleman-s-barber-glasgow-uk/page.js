import { TheGentlemanSBarberGlasgowUkCaseStudy } from './TheGentlemanSBarberGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'The Gentleman's Barber (Glasgow) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for The Gentleman's Barber in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/the-gentleman-s-barber-glasgow-uk") },
};

export default function TheGentlemanSBarberGlasgowUkCaseStudyPage() {
  return (
    <>
      <TheGentlemanSBarberGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'The Gentleman's Barber (Glasgow) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for The Gentleman's Barber in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/the-gentleman-s-barber-glasgow-uk',
              keywords: ['salon, booking, voice ai, Glasgow, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "The Gentleman's Barber (Glasgow)", path: "/work/the-gentleman-s-barber-glasgow-uk" }])) }} />
    </>
  );
}
