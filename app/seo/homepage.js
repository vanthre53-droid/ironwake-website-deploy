// ponytail: v18 — homepage JSON-LD stub. The original page.js imports
// getHomepageJsonLd from this path; the file was missing from HEAD 13cf9c5.
// We provide a minimal, safe stub so the homepage rebuild does not regress
// a pre-existing import. SEO content is intentionally minimal — owner did
// not ask for SEO work in this rebuild.
export function getHomepageJsonLd({ auditLitePrice = '₹799 / $29' } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IronWake',
    description: 'Operational systems for service businesses — enquiry, booking, and follow-up made visible.',
    url: 'https://ironwake.example.com',
    offers: {
      '@type': 'Offer',
      price: auditLitePrice,
      priceCurrency: 'INR',
      description: 'Audit-lite starting price. No subscription.',
    },
  };
}
