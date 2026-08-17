import { AuditForm } from './AuditForm';

import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';
import { canonicalUrl } from '../../lib/seo.mjs';
export const metadata = {
  title: 'Business Leak Audit — IronWake',
  description: 'Request a Business Leak Audit — published tier pricing on /pricing. No booking, quote, or provider connection is implied.',
  alternates: { canonical: canonicalUrl("/audit") },
};

export default function AuditPage() {
  return (
    <>
      <AuditForm />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([
                  { name: "Home", path: "/" },
                  { name: "audit", path: "/audit" },
          ])) }} />
        </>
  );
}
