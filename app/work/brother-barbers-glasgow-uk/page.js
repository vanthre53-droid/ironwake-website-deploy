import { BrotherBarbersGlasgowUkCaseStudy } from './BrotherBarbersGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Brother Barbers Glasgow Uk — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for brother-barbers-glasgow-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/brother-barbers-glasgow-uk") },
};

export default function BrotherBarbersGlasgowUkCaseStudyPage() {
  return (
    <>
      <BrotherBarbersGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Brother Barbers Glasgow Uk — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for brother-barbers-glasgow-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/brother-barbers-glasgow-uk',
              keywords: ['salon, booking, voice ai, , ', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Brother Barbers Glasgow Uk", path: "/work/brother-barbers-glasgow-uk" }])) }} />
    </>
  );
}
