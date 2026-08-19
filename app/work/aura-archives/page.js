import { AuraArchivesCaseStudy } from './AuraArchivesCaseStudy';

import { organizationLd, breadcrumbLd, creativeWorkLd } from '../../../lib/seo.mjs';
import { canonicalUrl } from '../../../lib/seo.mjs';
export const metadata = {
  title: 'Aura Archives — IronWake Work',
  description: 'A portfolio demonstration of bespoke-inquiry capture for luxury retail. Capability proof only, not a client engagement or a measured outcome.',
  alternates: { canonical: canonicalUrl("/work/aura-archives") },
};

export default function AuraArchivesPage() {
  return (
    <>
      <AuraArchivesCaseStudy />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd({
              name: 'Aura Archives — capability demonstration',
              description: 'A portfolio demonstration of enquiry-persistence for a curation-style business. Capability proof only, not a client engagement.',
              path: '/work/aura-archives',
              keywords: ['enquiry persistence, curation, IronWake portfolio'],
            })) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                    { name: "Home", path: "/" },
                    { name: "Work", path: "/work" },
                    { name: "Aura Archives", path: "/work/aura-archives" }])) }} />
    </>
  );
}
