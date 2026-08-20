import { HotTanningSalonBearsdenGlasgowUkCaseStudy } from './HotTanningSalonBearsdenGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Hot Tanning Salon Bearsden Glasgow Uk — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for hot-tanning-salon-bearsden-glasgow-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/hot-tanning-salon-bearsden-glasgow-uk") },
};

export default function HotTanningSalonBearsdenGlasgowUkCaseStudyPage() {
  return (
    <>
      <HotTanningSalonBearsdenGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Hot Tanning Salon Bearsden Glasgow Uk — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for hot-tanning-salon-bearsden-glasgow-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/hot-tanning-salon-bearsden-glasgow-uk',
              keywords: ['salon, booking, voice ai, , ', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Hot Tanning Salon Bearsden Glasgow Uk", path: "/work/hot-tanning-salon-bearsden-glasgow-uk" }])) }} />
    </>
  );
}
