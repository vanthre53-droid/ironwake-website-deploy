import { BellissimoNailStudioMumbaiInCaseStudy } from './BellissimoNailStudioMumbaiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Bellissimo Nail Studio (Mumbai) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Bellissimo Nail Studio in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/bellissimo-nail-studio-mumbai-in") },
};

export default function BellissimoNailStudioMumbaiInCaseStudyPage() {
  return (
    <>
      <BellissimoNailStudioMumbaiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Bellissimo Nail Studio (Mumbai) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Bellissimo Nail Studio in Mumbai, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/bellissimo-nail-studio-mumbai-in',
              keywords: ['salon, booking, voice ai, Mumbai, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Bellissimo Nail Studio (Mumbai)", path: "/work/bellissimo-nail-studio-mumbai-in" }])) }} />
    </>
  );
}
