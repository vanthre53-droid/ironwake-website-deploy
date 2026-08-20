import { VolumeUnisexSalonGlasgowUkCaseStudy } from './VolumeUnisexSalonGlasgowUkCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Volume unisex salon (Glasgow) — IronWake Work',
  description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Volume unisex salon in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
  alternates: { canonical: canonicalUrl("/work/volume-unisex-salon-glasgow-uk") },
};

export default function VolumeUnisexSalonGlasgowUkCaseStudyPage() {
  return (
    <>
      <VolumeUnisexSalonGlasgowUkCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Volume unisex salon (Glasgow) — capability demonstration',
              description: 'A portfolio demonstration of missed-call recovery and after-hours booking capture for Volume unisex salon in Glasgow, UK. Built with only public business info. Capability proof only, not a client engagement.',
              path: '/work/volume-unisex-salon-glasgow-uk',
              keywords: ['salon, booking, voice ai, Glasgow, UK', 'IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Volume unisex salon (Glasgow)", path: "/work/volume-unisex-salon-glasgow-uk" }])) }} />
    </>
  );
}
