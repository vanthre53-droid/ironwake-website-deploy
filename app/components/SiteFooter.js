// ponytail: site footer.
// v14 — fully rebuilt chrome (owner complaint: "the bottom of every page is so
// messy and unprofessional"). Single semantic <footer> with three rows:
//   1. brand mark + tagline + DEMONSTRATION chip
//   2. navigation grid (Explore / Start / Account / Legal)
//   3. legal/status row (copyright + privacy/terms links)
// No bracket placeholders.  No fake social proof.  No fabricated metrics.

const NAV_EXPLORE = [
  { href: '/work', label: 'Work' },
  { href: '/systems', label: 'Services' },
  { href: '/systems/ai-receptionist', label: 'AI Systems' },
  { href: '/services', label: 'Service catalogue' },
  { href: '/process', label: 'Process' },
];

const NAV_START = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/audit', label: 'Map my leak' },
  { href: '/insights', label: 'Insights' },
  { href: '/verification', label: 'Proof classes' },
  { href: '/about', label: 'About' },
];

const NAV_ACCOUNT = [
  { href: '/login', label: 'Sign in' },
  { href: '/signup', label: 'Create account' },
];

const NAV_LEGAL = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/scope', label: 'Scope & disclosures' },
];

function FooterNavColumn({ heading, links }) {
  return (
    <div className="footer-col">
      <h4 className="footer-col-head">{heading}</h4>
      <ul className="footer-col-list">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="footer-link">{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" aria-labelledby="site-footer-heading">
      <h2 id="site-footer-heading" className="sr-only">Site footer</h2>
      <div className="site-footer-inner">
        <div className="footer-brand">
          <a href="/" className="footer-brand-mark">
            <span className="footer-brand-name">IronWake</span>
            <span className="footer-brand-tagline">Operational systems for service businesses</span>
          </a>
          <p className="footer-brand-desc">
            Capture every enquiry, record a review task, and make the next
            action visible. Demonstrations and pending providers are clearly labelled.
          </p>
          <span className="footer-chip" aria-label="Site status">
            <span className="footer-chip-dot" aria-hidden="true" />
            DEMONSTRATION
          </span>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <FooterNavColumn heading="Explore" links={NAV_EXPLORE} />
          <FooterNavColumn heading="Start here" links={NAV_START} />
          <FooterNavColumn heading="Account" links={NAV_ACCOUNT} />
          <FooterNavColumn heading="Legal" links={NAV_LEGAL} />
        </nav>

        <div className="footer-meta">
          <p className="footer-meta-copyright">
            © {year} IronWake. All rights reserved.
          </p>
          <p className="footer-meta-note">
            Demonstration build. Prices are published offer tiers. No booking,
            quote, or provider connection is implied until scope is confirmed.
          </p>
        </div>
      </div>
    </footer>
  );
}