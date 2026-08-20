import { BonVivantGlasgowUkCaseStudy } from './BonVivantGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Bon Vivant (Glasgow) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Bon Vivant in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/bon-vivant-glasgow-uk") },
};

export default function BonVivantGlasgowUkCaseStudyPage() {
  return (
    <>
      <BonVivantGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Bon Vivant (Glasgow) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Bon Vivant in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/bon-vivant-glasgow-uk',
              keywords: ['salon, booking, voice ai, Glasgow, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Bon Vivant (Glasgow)", path: "/work/bon-vivant-glasgow-uk" }])) }} />
    </>
  );
}
