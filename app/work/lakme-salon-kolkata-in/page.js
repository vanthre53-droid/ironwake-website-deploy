import { LakmeSalonKolkataInCaseStudy } from './LakmeSalonKolkataInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Lakme Salon (Kolkata) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Lakme Salon in Kolkata, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/lakme-salon-kolkata-in") },
};

export default function LakmeSalonKolkataInCaseStudyPage() {
  return (
    <>
      <LakmeSalonKolkataInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Lakme Salon (Kolkata) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Lakme Salon in Kolkata, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/lakme-salon-kolkata-in',
              keywords: ['salon, booking, voice ai, Kolkata, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Lakme Salon (Kolkata)", path: "/work/lakme-salon-kolkata-in" }])) }} />
    </>
  );
}
