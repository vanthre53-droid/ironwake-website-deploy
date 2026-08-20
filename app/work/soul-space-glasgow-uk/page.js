import { SoulSpaceGlasgowUkCaseStudy } from './SoulSpaceGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Soul Space (Glasgow) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Soul Space in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/soul-space-glasgow-uk") },
};

export default function SoulSpaceGlasgowUkCaseStudyPage() {
  return (
    <>
      <SoulSpaceGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Soul Space (Glasgow) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Soul Space in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/soul-space-glasgow-uk',
              keywords: ['salon, booking, voice ai, Glasgow, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Soul Space (Glasgow)", path: "/work/soul-space-glasgow-uk" }])) }} />
    </>
  );
}
