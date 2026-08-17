import { AiReceptionistSystem } from './AiReceptionistSystem';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'AI Receptionist Planning',
  description: 'Requirements for a disclosed, human-supervised AI receptionist build. The IronWake site assistant is live and model-backed; client AI Receptionist deployments require a separately scoped provider build per client.',
  alternates: { canonical: canonicalUrl("/systems/ai-receptionist") },
};

export default function AiReceptionistPage() {
  return <AiReceptionistSystem />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "ai-receptionist", path: "/systems/ai-receptionist" },
      ])) }} />
;
}
