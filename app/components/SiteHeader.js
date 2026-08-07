// ponytail: owner-approved nav order — no architecture change, just link labels/paths.
const links = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/systems', 'Services'],
  ['/systems/ai-receptionist', 'AI Systems'],
  ['/process', 'Process'],
  ['/pricing', 'Pricing'],
  ['/insights', 'Insights'],
  ['/about', 'About']
];

export function SiteHeader() {
  return <header className="header">
    <a className="brand" href="/">IronWake<span>_</span><span className="sr-only">Home</span></a>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {links.slice(1).map(([href, label]) => <a href={href} key={href}>{label}</a>)}
      <a className="nav-cta" href="/audit">Book Diagnostic</a>
    </nav>
    <details className="mobile-nav">
      <summary>Menu</summary>
      <nav aria-label="Mobile navigation">
        {links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        <a className="nav-cta" href="/audit">Book Diagnostic</a>
      </nav>
    </details>
  </header>;
}
