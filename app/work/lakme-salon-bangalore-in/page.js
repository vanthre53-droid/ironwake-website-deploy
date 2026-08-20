import { LakmeSalonBangaloreInCaseStudy } from './LakmeSalonBangaloreInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Lakme Salon (Bangalore) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Lakme Salon in Bangalore, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/lakme-salon-bangalore-in") },
};

export default function LakmeSalonBangaloreInCaseStudyPage() {
  return (
    <>
      <LakmeSalonBangaloreInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Lakme Salon (Bangalore) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Lakme Salon in Bangalore, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/lakme-salon-bangalore-in',
              keywords: ['salon, booking, voice ai, Bangalore, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Lakme Salon (Bangalore)", path: "/work/lakme-salon-bangalore-in" }])) }} />
    </>
  );
}
