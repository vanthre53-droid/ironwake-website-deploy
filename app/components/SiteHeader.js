const links = [
  ['/', 'Home'],
  ['/systems', 'Systems'],
  ['/work', 'Work'],
  ['/scope', 'Request scope'],
  ['/industries', 'Industries'],
  ['/process', 'Process'],
  ['/about', 'About']
];

export function SiteHeader() {
  return <header className="header">
    <a className="brand" href="/">IronWake<span>_</span><span className="sr-only">Home</span></a>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {links.slice(1).map(([href, label]) => <a href={href} key={href}>{label}</a>)}
      <a className="nav-cta" href="/audit">Find my workflow leak</a>
    </nav>
    <details className="mobile-nav">
      <summary>Menu</summary>
      <nav aria-label="Mobile navigation">
        {links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        <a className="nav-cta" href="/audit">Find my workflow leak</a>
      </nav>
    </details>
  </header>;
}
