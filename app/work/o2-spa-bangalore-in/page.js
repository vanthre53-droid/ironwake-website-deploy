import { O2SpaBangaloreInCaseStudy } from './O2SpaBangaloreInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'O2 Spa (Bangalore) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for O2 Spa in Bangalore, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/o2-spa-bangalore-in") },
};

export default function O2SpaBangaloreInCaseStudyPage() {
  return (
    <>
      <O2SpaBangaloreInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'O2 Spa (Bangalore) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for O2 Spa in Bangalore, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/o2-spa-bangalore-in',
              keywords: ['salon, booking, voice ai, Bangalore, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "O2 Spa (Bangalore)", path: "/work/o2-spa-bangalore-in" }])) }} />
    </>
  );
}
