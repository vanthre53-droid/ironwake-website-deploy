import { AuraArchivesCaseStudy } from './AuraArchivesCaseStudy';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Aura Archives — IronWake Work',
  description: 'A portfolio demonstration of bespoke-inquiry capture for luxury retail. Capability proof only, not a client engagement or a measured outcome.',
  alternates: { canonical: canonicalUrl("/work/aura-archives") },
};

export default function AuraArchivesPage() {
  return <AuraArchivesCaseStudy />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "aura-archives", path: "/work/aura-archives" },
      ])) }} />
;
}
