import { ShaakyaBodySpaBangaloreInCaseStudy } from './ShaakyaBodySpaBangaloreInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Shaakya Body Spa (Bangalore) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Shaakya Body Spa in Bangalore, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/shaakya-body-spa-bangalore-in") },
};

export default function ShaakyaBodySpaBangaloreInCaseStudyPage() {
  return (
    <>
      <ShaakyaBodySpaBangaloreInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Shaakya Body Spa (Bangalore) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Shaakya Body Spa in Bangalore, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/shaakya-body-spa-bangalore-in',
              keywords: ['salon, booking, voice ai, Bangalore, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Shaakya Body Spa (Bangalore)", path: "/work/shaakya-body-spa-bangalore-in" }])) }} />
    </>
  );
}
