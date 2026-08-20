import { RinkySandhalUnisexSalonDelhiInCaseStudy } from './RinkySandhalUnisexSalonDelhiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Rinky Sandhal Unisex Salon (Delhi) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Rinky Sandhal Unisex Salon in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/rinky-sandhal-unisex-salon-delhi-in") },
};

export default function RinkySandhalUnisexSalonDelhiInCaseStudyPage() {
  return (
    <>
      <RinkySandhalUnisexSalonDelhiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Rinky Sandhal Unisex Salon (Delhi) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Rinky Sandhal Unisex Salon in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/rinky-sandhal-unisex-salon-delhi-in',
              keywords: ['salon, booking, voice ai, Delhi, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Rinky Sandhal Unisex Salon (Delhi)", path: "/work/rinky-sandhal-unisex-salon-delhi-in" }])) }} />
    </>
  );
}
