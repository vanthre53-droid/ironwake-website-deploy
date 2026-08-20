import { SameerscissorComDelhiInCaseStudy } from './SameerscissorComDelhiInCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Sameerscissor.com (Delhi) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Sameerscissor.com in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/sameerscissor-com-delhi-in") },
};

export default function SameerscissorComDelhiInCaseStudyPage() {
  return (
    <>
      <SameerscissorComDelhiInCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Sameerscissor.com (Delhi) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Sameerscissor.com in Delhi, IN. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/sameerscissor-com-delhi-in',
              keywords: ['salon, booking, voice ai, Delhi, IN', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Sameerscissor.com (Delhi)", path: "/work/sameerscissor-com-delhi-in" }])) }} />
    </>
  );
}
