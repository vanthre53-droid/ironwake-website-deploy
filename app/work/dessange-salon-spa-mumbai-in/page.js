import { DessangeSalonSpaMumbaiInCaseStudy } from './DessangeSalonSpaMumbaiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Dessange Salon & Spa (Mumbai) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Dessange Salon & Spa in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/dessange-salon-spa-mumbai-in") },
};

export default function DessangeSalonSpaMumbaiInCaseStudyPage() {
  return (
    <>
      <DessangeSalonSpaMumbaiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Dessange Salon & Spa (Mumbai) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Dessange Salon & Spa in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/dessange-salon-spa-mumbai-in',
              keywords: ['salon, booking, voice ai, Mumbai, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Dessange Salon & Spa (Mumbai)", path: "/work/dessange-salon-spa-mumbai-in" }])) }} />
    </>
  );
}
