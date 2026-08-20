import { RoseberrySpaDelhiInCaseStudy } from './RoseberrySpaDelhiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Roseberry Spa (Delhi) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Roseberry Spa in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/roseberry-spa-delhi-in") },
};

export default function RoseberrySpaDelhiInCaseStudyPage() {
  return (
    <>
      <RoseberrySpaDelhiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Roseberry Spa (Delhi) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Roseberry Spa in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/roseberry-spa-delhi-in',
              keywords: ['salon, booking, voice ai, Delhi, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Roseberry Spa (Delhi)", path: "/work/roseberry-spa-delhi-in" }])) }} />
    </>
  );
}
