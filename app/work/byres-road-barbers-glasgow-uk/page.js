import { ByresRoadBarbersGlasgowUkCaseStudy } from './ByresRoadBarbersGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Byres Road Barbers (Glasgow) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Byres Road Barbers in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/byres-road-barbers-glasgow-uk") },
};

export default function ByresRoadBarbersGlasgowUkCaseStudyPage() {
  return (
    <>
      <ByresRoadBarbersGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Byres Road Barbers (Glasgow) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Byres Road Barbers in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/byres-road-barbers-glasgow-uk',
              keywords: ['salon, booking, voice ai, Glasgow, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Byres Road Barbers (Glasgow)", path: "/work/byres-road-barbers-glasgow-uk" }])) }} />
    </>
  );
}
