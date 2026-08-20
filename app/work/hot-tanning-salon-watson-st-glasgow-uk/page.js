import { HotTanningSalonWatsonStGlasgowUkCaseStudy } from './HotTanningSalonWatsonStGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Hot Tanning Salon Watson St Glasgow Uk — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for hot-tanning-salon-watson-st-glasgow-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/hot-tanning-salon-watson-st-glasgow-uk") },
};

export default function HotTanningSalonWatsonStGlasgowUkCaseStudyPage() {
  return (
    <>
      <HotTanningSalonWatsonStGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Hot Tanning Salon Watson St Glasgow Uk — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for hot-tanning-salon-watson-st-glasgow-uk in , . Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/hot-tanning-salon-watson-st-glasgow-uk',
              keywords: ['salon, booking, voice ai, , ', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Hot Tanning Salon Watson St Glasgow Uk", path: "/work/hot-tanning-salon-watson-st-glasgow-uk" }])) }} />
    </>
  );
}
