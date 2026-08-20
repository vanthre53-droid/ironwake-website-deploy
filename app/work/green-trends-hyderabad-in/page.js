import { GreenTrendsHyderabadInCaseStudy } from './GreenTrendsHyderabadInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Green Trends (Hyderabad) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Green Trends in Hyderabad, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/green-trends-hyderabad-in") },
};

export default function GreenTrendsHyderabadInCaseStudyPage() {
  return (
    <>
      <GreenTrendsHyderabadInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Green Trends (Hyderabad) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Green Trends in Hyderabad, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/green-trends-hyderabad-in',
              keywords: ['salon, booking, voice ai, Hyderabad, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Green Trends (Hyderabad)", path: "/work/green-trends-hyderabad-in" }])) }} />
    </>
  );
}
