import { AtmosHairStudioGlasgowUkCaseStudy } from './AtmosHairStudioGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'ATMOS hair studio (Glasgow) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for ATMOS hair studio in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/atmos-hair-studio-glasgow-uk") },
};

export default function AtmosHairStudioGlasgowUkCaseStudyPage() {
  return (
    <>
      <AtmosHairStudioGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'ATMOS hair studio (Glasgow) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for ATMOS hair studio in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/atmos-hair-studio-glasgow-uk',
              keywords: ['salon, booking, voice ai, Glasgow, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "ATMOS hair studio (Glasgow)", path: "/work/atmos-hair-studio-glasgow-uk" }])) }} />
    </>
  );
}
