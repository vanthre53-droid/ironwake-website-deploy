import { LuxeStudioCaseStudy } from './LuxeStudioCaseStudy';

import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Luxe Studio — IronWake Work',
  description: 'A portfolio demonstration of booking and studio-system capture for experience-led businesses. Capability proof only, not a client engagement or a measured outcome.',
  alternates: { canonical: canonicalUrl("/work/luxe-studio") },
};

export default function LuxeStudioPage() {
  return (
    <>
      <LuxeStudioCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "luxe-studio", path: "/work/luxe-studio" },
            ])) }} />
    </>
  );
}
