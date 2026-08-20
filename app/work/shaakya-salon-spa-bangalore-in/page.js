import { ShaakyaSalonSpaBangaloreInCaseStudy } from './ShaakyaSalonSpaBangaloreInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Shaakya Salon & Spa (Bangalore) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Shaakya Salon & Spa in Bangalore, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/shaakya-salon-spa-bangalore-in") },
};

export default function ShaakyaSalonSpaBangaloreInCaseStudyPage() {
  return (
    <>
      <ShaakyaSalonSpaBangaloreInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Shaakya Salon & Spa (Bangalore) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Shaakya Salon & Spa in Bangalore, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/shaakya-salon-spa-bangalore-in',
              keywords: ['salon, booking, voice ai, Bangalore, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Shaakya Salon & Spa (Bangalore)", path: "/work/shaakya-salon-spa-bangalore-in" }])) }} />
    </>
  );
}
