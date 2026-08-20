import { EnrichSalonMumbaiInCaseStudy } from './EnrichSalonMumbaiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Enrich Salon (Mumbai) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Enrich Salon in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/enrich-salon-mumbai-in") },
};

export default function EnrichSalonMumbaiInCaseStudyPage() {
  return (
    <>
      <EnrichSalonMumbaiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Enrich Salon (Mumbai) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Enrich Salon in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/enrich-salon-mumbai-in',
              keywords: ['salon, booking, voice ai, Mumbai, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Enrich Salon (Mumbai)", path: "/work/enrich-salon-mumbai-in" }])) }} />
    </>
  );
}
