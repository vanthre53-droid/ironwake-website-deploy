'use client';

import { useEffect, useRef } from 'react';

// ponytail: RevealSection — one-shot scrollytelling observer.
// Each <RevealSection data-stage="N"> sets root.dataset.flagshipStage = "N"
// when it crosses 55% of the viewport. CSS keys off [data-flagship-stage] on
// :root, so the entire hero re-stages without per-element JS or rAF.
// No output. No listeners leaked. No global state.
export function RevealSection({ stage, children, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // ponytail: no IO (old browser / SSR rehydration) → leave initial stage so CSS fallback wins
      return undefined;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            document.documentElement.dataset.flagshipStage = String(stage);
            obs.disconnect();
            return;
          }
        }
      },
      { threshold: [0.55] }
    );
    obs.observe(node);
    // ponytail: reduced-motion users get the final stage immediately (no scrub).
    if (reduceMotion) {
      document.documentElement.dataset.flagshipStage = String(stage);
      obs.disconnect();
    }
    return () => obs.disconnect();
  }, [stage]);

  return (
    <div ref={ref} className={className} data-stage={stage}>
      {children}
    </div>
  );
}
