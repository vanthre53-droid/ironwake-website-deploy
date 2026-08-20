import { AboveSalonsLeedsUkCaseStudy } from './AboveSalonsLeedsUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Above Salons (Leeds) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Above Salons in Leeds, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/above-salons-leeds-uk") },
};

export default function AboveSalonsLeedsUkCaseStudyPage() {
  return (
    <>
      <AboveSalonsLeedsUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Above Salons (Leeds) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Above Salons in Leeds, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/above-salons-leeds-uk',
              keywords: ['salon, booking, voice ai, Leeds, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Above Salons (Leeds)", path: "/work/above-salons-leeds-uk" }])) }} />
    </>
  );
}
