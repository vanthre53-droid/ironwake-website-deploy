// ponytail: shared SEO primitives.
//
// Centralizes:
//   - siteOrigin()           — single source of truth for the canonical site URL
//   - canonicalUrl(path)     — absolute URL for a route, used in metadata.alternates
//                              and BreadcrumbList / Article schema items
//   - organizationLd()       — the Organization JSON-LD we attach site-wide
//   - websiteLd()            — the WebSite JSON-LD (with SearchAction) attached on /
//   - breadcrumbLd(crumbs)   — factory for BreadcrumbList items given [{name,path}]
//   - articleLd({...})       — factory for Article JSON-LD on /insights/[slug]
//   - faqLd(faqs)            — factory for FAQPage JSON-LD
//
// Why a lib helper rather than page-local constants:
//   - One canonical site origin keeps Organization.@@id, WebSite.@@id, and the
//     BreadcrumbList item URLs in sync. Drift between them is the #1 source of
//     structured-data validation warnings.
//   - Tests can import and assert against the same constants.

// PRODUCTION_CANONICAL_ORIGIN is duplicated here (rather than imported from
// lib/site-origin.mjs) because every other module in this codebase follows the
// same inlined-constant pattern — keeping the SEO helpers buildable in the
// Next.js RSC context where they are statically imported from page modules.
const PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev';

const _siteOrigin = PRODUCTION_CANONICAL_ORIGIN;

export const siteOrigin = _siteOrigin;

export function canonicalUrl(path) {
  if (typeof path !== 'string' || path.length === 0) return siteOrigin;
  // Allow already-absolute URLs to pass through unchanged.
  if (/^https?:\/\//.test(path)) return path;
  // Treat "" or "/" as the apex.
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteOrigin}${normalized}`;
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteOrigin}#organization`,
    name: 'IronWake',
    legalName: 'IronWake',
    url: siteOrigin,
    logo: {
      '@type': 'ImageObject',
      url: `${siteOrigin}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${siteOrigin}/logo.png`,
    sameAs: [
      // Pinned to the social presence that the LIVE production emits.
      // Editing requires updating production + CLAIM_LEDGER simultaneously.
      'https://www.instagram.com/ironwake.dev/',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: `${siteOrigin}/audit`,
        availableLanguage: ['English'],
      },
    ],
    description: 'IronWake builds operational systems that capture enquiries, manage follow-up, and surface revenue leaks for service businesses.',
    foundingDate: '2024',
    knowsAbout: [
      'Lead follow-up automation',
      'Customer enquiry handling',
      'Revenue leak diagnostics',
      'Business operations systems',
    ],
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteOrigin}#website`,
    url: siteOrigin,
    name: 'IronWake',
    inLanguage: 'en',
    publisher: { '@id': `${siteOrigin}#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteOrigin}/insights?q={search_term_string}`,
      },
      // schema.org requires the query-input property name to literally be
      // "required" + "name=search_term_string" for Google to honor it.
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbLd(crumbs) {
  if (!Array.isArray(crumbs) || crumbs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  };
}

export function articleLd({ headline, description, path, datePublished, dateModified, authorName = 'IronWake' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl(path) },
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: authorName, '@id': `${siteOrigin}#organization` },
    publisher: {
      '@type': 'Organization',
      name: 'IronWake',
      '@id': `${siteOrigin}#organization`,
      logo: { '@type': 'ImageObject', url: `${siteOrigin}/logo.png` },
    },
    url: canonicalUrl(path),
  };
}

export function faqLd(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ponytail: Service JSON-LD used on /systems/* and /audit. Per-page service
// offers a Provider reference back to the Organization so every service node
// resolves to the same canonical brand entity (no orphan Service nodes).
export function serviceLd({ name, description, path, price, areaServed, serviceType, providerName = 'IronWake' }) {
  const trimmed = (s) => (typeof s === 'string' ? s.trim() : '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: trimmed(name),
    description: trimmed(description),
    serviceType: trimmed(serviceType) || trimmed(name),
    areaServed: trimmed(areaServed) || 'Worldwide',
    provider: { '@type': 'Organization', name: providerName, '@id': `${siteOrigin}#organization`, url: siteOrigin },
    url: canonicalUrl(path),
    ...(price ? { offers: { '@type': 'Offer', price: trimmed(price), priceCurrency: 'INR', url: canonicalUrl(path) } } : {}),
  };
}

// ponytail: CreativeWork JSON-LD used on /work/[slug] portfolio pages.
// Lets each portfolio item publish as a richly-described artefact without
// overstating client outcomes (artist/provider point back to the brand entity).
export function creativeWorkLd({ name, description, path, authorName = 'IronWake', about, keywords }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url: canonicalUrl(path),
    about: about || description,
    ...(Array.isArray(keywords) && keywords.length ? { keywords: keywords.join(', ') } : {}),
    author: { '@type': 'Organization', name: authorName, '@id': `${siteOrigin}#organization`, url: siteOrigin },
    publisher: { '@type': 'Organization', name: 'IronWake', '@id': `${siteOrigin}#organization`, url: siteOrigin },
    isAccessibleForFree: true,
    inLanguage: 'en',
  };
}

// ponytail: ItemList JSON-LD for a sequence of items on a single page
// (e.g. systems, industries). position is 1-indexed per schema.org.
export function itemListLd({ name, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      url: it.path ? canonicalUrl(it.path) : undefined,
    })),
  };
}
