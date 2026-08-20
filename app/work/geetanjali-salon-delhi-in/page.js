import { GeetanjaliSalonDelhiInCaseStudy } from './GeetanjaliSalonDelhiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Geetanjali Salon (Delhi) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Geetanjali Salon in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/geetanjali-salon-delhi-in") },
};

export default function GeetanjaliSalonDelhiInCaseStudyPage() {
  return (
    <>
      <GeetanjaliSalonDelhiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Geetanjali Salon (Delhi) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Geetanjali Salon in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/geetanjali-salon-delhi-in',
              keywords: ['salon, booking, voice ai, Delhi, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Geetanjali Salon (Delhi)", path: "/work/geetanjali-salon-delhi-in" }])) }} />
    </>
  );
}
