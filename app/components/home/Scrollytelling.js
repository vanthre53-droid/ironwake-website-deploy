'use client';

import { useEffect } from 'react';

// ponytail: Scrollytelling — the client root for the home page. It does four things:
//   1. damped scroll-progress → writes --hero-progress (0..1) to :root via rAF lerp
//   2. chapter-adaptive theme morph → reflects [data-chapter] into body data-theme
//   3. ambient float driver → toggles body.home-ambient class while not reduced-motion
//   4. cleanup → all listeners removed on unmount; rAF cancelled
// No JSX output. Returns null. Rendered once near the top of <main>.
export function Scrollytelling() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reduceTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
    const ambientAllowed = !reduceMotion && !reduceTransparency;

    const root = document.documentElement;
    const body = document.body;
    if (ambientAllowed) body.classList.add('home-ambient');

    // --- 1. damped scroll-progress ----------------------------------------
    let target = 0;
    let current = 0;
    let raf = 0;
    let queued = false;

    const measure = () => {
      const max = (root.scrollHeight || 1) - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (!queued) {
        queued = true;
        raf = window.requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      // 0.12 lerp → smooth damped follow without lagging long pages
      const diff = target - current;
      if (Math.abs(diff) < 0.0008) {
        current = target;
        root.style.setProperty('--hero-progress', current.toFixed(4));
        queued = false;
        return;
      }
      current += diff * 0.12;
      root.style.setProperty('--hero-progress', current.toFixed(4));
      raf = window.requestAnimationFrame(tick);
    };

    // --- 2. chapter-adaptive theme morph -----------------------------------
    const sections = Array.from(document.querySelectorAll('main.home [data-chapter]'));
    const themeCache = new Map();

    const applyChapterTheme = (theme) => {
      const t = theme || 'paper';
      if (body.getAttribute('data-theme') !== t) body.setAttribute('data-theme', t);
    };

    const chapterIo = !reduceMotion && 'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const el = entry.target;
              const theme = themeCache.get(el) || el.getAttribute('data-theme') || 'paper';
              if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
                applyChapterTheme(theme);
              }
            }
          },
          { threshold: [0.35, 0.6] }
        )
      : null;

    sections.forEach((el) => {
      themeCache.set(el, el.getAttribute('data-theme') || 'paper');
      if (chapterIo) chapterIo.observe(el);
    });
    if (!chapterIo) applyChapterTheme('paper');

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      if (raf) window.cancelAnimationFrame(raf);
      if (chapterIo) chapterIo.disconnect();
      body.classList.remove('home-ambient');
    };
  }, []);

  return null;
}