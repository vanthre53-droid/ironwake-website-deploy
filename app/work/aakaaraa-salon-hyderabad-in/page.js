import { AakaaraaSalonHyderabadInCaseStudy } from './AakaaraaSalonHyderabadInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'AAKAARAA SALON (Hyderabad) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for AAKAARAA SALON in Hyderabad, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/aakaaraa-salon-hyderabad-in") },
};

export default function AakaaraaSalonHyderabadInCaseStudyPage() {
  return (
    <>
      <AakaaraaSalonHyderabadInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'AAKAARAA SALON (Hyderabad) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for AAKAARAA SALON in Hyderabad, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/aakaaraa-salon-hyderabad-in',
              keywords: ['salon, booking, voice ai, Hyderabad, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "AAKAARAA SALON (Hyderabad)", path: "/work/aakaaraa-salon-hyderabad-in" }])) }} />
    </>
  );
}
