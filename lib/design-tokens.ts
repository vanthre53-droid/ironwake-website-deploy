/**
 * IronWake design tokens — TypeScript mirror of the CSS custom properties
 * declared in `app/globals.css`. Keep these in sync. Components that need to
 * compute layout/typography in JS should import from here, not hard-code values.
 *
 * Ponytail: this is a *mirror*, not a *replacement*. The CSS remains the
 * single source of truth at runtime — these values only exist so JS can
 * avoid hard-coding magic numbers.
 */

export const color = {
  // ponytail: V13 — midrange neutral premium glass (apple.com lineage). No copper.
  paper: '#f5f5f7',
  stone: '#ececee',
  stoneDeep: '#dcdce0',
  ink: '#1d1d1f',
  graphite: '#6e6e73',
  copper: '#1d1d1f',
  copperDark: '#000000',
  aqua: '#0071e3',
  rule: '#d2d2d7',
  surface: '#ffffff',
  white: '#fff',
  noticeError: '#ff3b30',
} as const;

export const font = {
  display: '"Newsreader", "Liberation Serif", Georgia, serif',
  body: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const motion = {
  /** Default duration for UI transitions (ms). */
  duration: { fast: 120, base: 200, slow: 320 },
  /** Easing — ease-out for entrance, ease-in for exit. No linear. */
  ease: {
    out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 0.6, 0.4)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const space = {
  /** 4px base. Allowed values per IRONWAKE_DESIGN_BRIEF.md §7. */
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const breakpoint = {
  mobile: 360,
  mobileLg: 430,
  tablet: 768,
  laptop: 1024,
  laptopLg: 1280,
  desktop: 1440,
  wide: 1920,
} as const;