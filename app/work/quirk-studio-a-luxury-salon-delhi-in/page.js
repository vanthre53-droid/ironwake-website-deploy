import { QuirkStudioALuxurySalonDelhiInCaseStudy } from './QuirkStudioALuxurySalonDelhiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Quirk Studio - A luxury Salon (Delhi) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Quirk Studio - A luxury Salon in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/quirk-studio-a-luxury-salon-delhi-in") },
};

export default function QuirkStudioALuxurySalonDelhiInCaseStudyPage() {
  return (
    <>
      <QuirkStudioALuxurySalonDelhiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Quirk Studio - A luxury Salon (Delhi) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Quirk Studio - A luxury Salon in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/quirk-studio-a-luxury-salon-delhi-in',
              keywords: ['salon, booking, voice ai, Delhi, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Quirk Studio - A luxury Salon (Delhi)", path: "/work/quirk-studio-a-luxury-salon-delhi-in" }])) }} />
    </>
  );
}
