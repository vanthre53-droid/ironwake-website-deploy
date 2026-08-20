import { SinhSalonDelhiInCaseStudy } from './SinhSalonDelhiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Sinh Salon (Delhi) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Sinh Salon in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/sinh-salon-delhi-in") },
};

export default function SinhSalonDelhiInCaseStudyPage() {
  return (
    <>
      <SinhSalonDelhiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Sinh Salon (Delhi) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Sinh Salon in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/sinh-salon-delhi-in',
              keywords: ['salon, booking, voice ai, Delhi, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Sinh Salon (Delhi)", path: "/work/sinh-salon-delhi-in" }])) }} />
    </>
  );
}
