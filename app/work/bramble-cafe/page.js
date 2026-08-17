import { BrambleCafeCaseStudy } from './BrambleCafeCaseStudy';

import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Bramble Cafe — IronWake Work',
  description: 'A portfolio demonstration of reservation and catering-inquiry capture for hospitality businesses. Capability proof only, not a client engagement or a measured outcome.',
  alternates: { canonical: canonicalUrl("/work/bramble-cafe") },
};

export default function BrambleCafePage() {
  return (
    <>
      <BrambleCafeCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "bramble-cafe", path: "/work/bramble-cafe" },
            ])) }} />
    </>
  );
}
