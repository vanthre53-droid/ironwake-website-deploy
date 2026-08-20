import { WestendHairGlasgowUkCaseStudy } from './WestendHairGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Westend Hair (Glasgow) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Westend Hair in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/westend-hair-glasgow-uk") },
};

export default function WestendHairGlasgowUkCaseStudyPage() {
  return (
    <>
      <WestendHairGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Westend Hair (Glasgow) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Westend Hair in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/westend-hair-glasgow-uk',
              keywords: ['salon, booking, voice ai, Glasgow, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Westend Hair (Glasgow)", path: "/work/westend-hair-glasgow-uk" }])) }} />
    </>
  );
}
