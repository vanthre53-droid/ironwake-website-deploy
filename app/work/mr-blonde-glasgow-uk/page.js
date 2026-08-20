import { MrBlondeGlasgowUkCaseStudy } from './MrBlondeGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Mr Blonde Glasgow Uk — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for mr-blonde-glasgow-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/mr-blonde-glasgow-uk") },
};

export default function MrBlondeGlasgowUkCaseStudyPage() {
  return (
    <>
      <MrBlondeGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Mr Blonde Glasgow Uk — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for mr-blonde-glasgow-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/mr-blonde-glasgow-uk',
              keywords: ['salon, booking, voice ai, , ', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Mr Blonde Glasgow Uk", path: "/work/mr-blonde-glasgow-uk" }])) }} />
    </>
  );
}
