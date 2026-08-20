import { CoiaHairdressingGlasgowUkCaseStudy } from './CoiaHairdressingGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Coia Hairdressing (Glasgow) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Coia Hairdressing in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/coia-hairdressing-glasgow-uk") },
};

export default function CoiaHairdressingGlasgowUkCaseStudyPage() {
  return (
    <>
      <CoiaHairdressingGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Coia Hairdressing (Glasgow) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Coia Hairdressing in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/coia-hairdressing-glasgow-uk',
              keywords: ['salon, booking, voice ai, Glasgow, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Coia Hairdressing (Glasgow)", path: "/work/coia-hairdressing-glasgow-uk" }])) }} />
    </>
  );
}
