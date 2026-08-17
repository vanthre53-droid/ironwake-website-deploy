import { TrustLeadCaptureSystem } from './TrustLeadCaptureSystem';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Trust and Lead Capture — IronWake',
  description: 'The validation, consent, and credential-handling steps behind every IronWake lead-capture form, from server-side schema validation to a hidden spam trap.',
  alternates: { canonical: canonicalUrl("/systems/trust-lead-capture") },
};

export default function TrustLeadCapturePage() {
  return <TrustLeadCaptureSystem />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "trust-lead-capture", path: "/systems/trust-lead-capture" },
      ])) }} />
;
}
