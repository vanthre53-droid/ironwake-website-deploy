'use client';

// ponytail: motion primitives — small hooks + components that power the
// motion polish system. They are intentionally tiny, declarative, and
// gated by prefers-reduced-motion. None of them render if motion is
// disabled, so the SSR HTML is identical to the no-motion state and
// there is no hydration jank.
//
// Layout:
//   useMotionPrefs   — read prefers-reduced-motion / coarse pointer once
//   usePointerParallax — bind a CSS var to scrollY (lerp-smoothed)
//   useHeroTilt      — bind --tilt-x/--tilt-y to a pointer position
//   ScrollProgress   — fixed top-bar showing scroll progress
//   Tilt             — pretty wrapper that wires up tilt-host + magnet
//   HeroParallax     — hero block that follows scrollY with a slight drift
//
// All hooks are SSR-safe: window access is guarded, and the default
// state is the unmounted/motion-off state so the first paint is
// identical between server and client.

import { useEffect, useRef, useState } from 'react';

export function useMotionPrefs() {
  const [prefs, setPrefs] = useState({ reducedMotion: false, coarsePointer: false });
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
    const sync = () => setPrefs({ reducedMotion: motion.matches, coarsePointer: coarse.matches });
    sync();
    const onChange = (event) => sync();
    if (motion.addEventListener) motion.addEventListener('change', onChange);
    if (coarse.addEventListener) coarse.addEventListener('change', onChange);
    return () => {
      if (motion.removeEventListener) motion.removeEventListener('change', onChange);
      if (coarse.removeEventListener) coarse.removeEventListener('change', onChange);
    };
  }, []);
  return prefs;
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ponytail: usePointerParallax — writes --scroll-y on the element so its
// children with [data-parallax] shift with the page. The function uses
// requestAnimationFrame and reads scrollY once per frame, so it is
// cheaper than a per-element hook. The 'amount' parameter controls how
// far the element drifts (in px) at the bottom of the viewport.
export function usePointerParallax({ amount = 80, smoothing = 0.12 } = {}) {
  const ref = useRef(null);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (typeof window === 'undefined' || !node) return undefined;
    if (typeof window.matchMedia === 'function') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) return undefined;
    }

    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // -1 when the element is below the viewport, +1 when above.
      const progress = clamp((viewport - rect.top) / (viewport + rect.height), -0.5, 1.5);
      target.current = -progress * amount;
    };

    const tick = () => {
      current.current += (target.current - current.current) * smoothing;
      // below 0.1px, snap to 0 to avoid subpixel jitter.
      const y = Math.abs(current.current) < 0.1 ? 0 : current.current;
      node.style.setProperty('--scroll-y', `${y.toFixed(2)}px`);
      raf.current = window.requestAnimationFrame(tick);
    };

    setEnabled(true);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    raf.current = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(raf.current);
      node.style.removeProperty('--scroll-y');
    };
  }, [amount, smoothing]);

  return { ref, enabled };
}

// ponytail: useHeroTilt — writes --tilt-x and --tilt-y on the element so
// the .tilt-host CSS can rotate it. The values are clamped to [-1,1] and
// the maximum angle is small (4deg) so the interaction is sugar, not a
// navigation surface. Touch + reduced-motion users get zero effect.
export function useHeroTilt({ maxAngle = 6, easing = 0.18 } = {}) {
  const ref = useRef(null);
  const state = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const raf = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (typeof window === 'undefined' || !node) return undefined;
    if (typeof window.matchMedia === 'function') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) return undefined;
      const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
      if (coarse.matches) return undefined;
    }

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      state.current.targetX = clamp(x * 2 - 1, -1, 1);
      state.current.targetY = clamp(y * 2 - 1, -1, 1);
    };
    const onLeave = () => {
      state.current.targetX = 0;
      state.current.targetY = 0;
    };

    const tick = () => {
      const s = state.current;
      s.currentX += (s.targetX - s.currentX) * easing;
      s.currentY += (s.targetY - s.currentY) * easing;
      const angleX = s.currentY * (maxAngle * 0.5);
      const angleY = s.currentX * (maxAngle * 0.5);
      if (Math.abs(s.currentX) < 0.005 && Math.abs(s.currentY) < 0.005) {
        node.style.setProperty('--tilt-x', '0');
        node.style.setProperty('--tilt-y', '0');
      } else {
        node.style.setProperty('--tilt-x', s.currentX.toFixed(3));
        node.style.setProperty('--tilt-y', s.currentY.toFixed(3));
        node.style.setProperty('--tilt-angle-x', `${angleX.toFixed(2)}deg`);
        node.style.setProperty('--tilt-angle-y', `${angleY.toFixed(2)}deg`);
      }
      raf.current = window.requestAnimationFrame(tick);
    };

    setEnabled(true);
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave, { passive: true });
    node.addEventListener('blur', onLeave, { passive: true });
    raf.current = window.requestAnimationFrame(tick);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      node.removeEventListener('blur', onLeave);
      window.cancelAnimationFrame(raf.current);
      node.style.removeProperty('--tilt-x');
      node.style.removeProperty('--tilt-y');
      node.style.removeProperty('--tilt-angle-x');
      node.style.removeProperty('--tilt-angle-y');
    };
  }, [maxAngle, easing]);

  return { ref, enabled };
}

// ponytail: ScrollProgress — fixed top bar that grows as the page scrolls.
// Renders nothing visible when motion is disabled. The smooth lerp runs
// inside a single rAF loop per page, not per element. SSR output is the
// empty bar so the layout is stable.
export function ScrollProgress({ height = 2 } = {}) {
  const ref = useRef(null);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef(0);
  const { reducedMotion } = useMotionPrefs();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (reducedMotion) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    const compute = () => {
      const max = (document.documentElement.scrollHeight || 0) - window.innerHeight;
      target.current = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };

    const tick = () => {
      current.current += (target.current - current.current) * 0.22;
      if (Math.abs(target.current - current.current) < 0.001) current.current = target.current;
      node.style.setProperty('--scroll-progress', current.current.toFixed(3));
      raf.current = window.requestAnimationFrame(tick);
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    raf.current = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
      window.cancelAnimationFrame(raf.current);
    };
  }, [reducedMotion]);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" style={{ height: `${height}px` }} />;
}

// ponytail: Tilt — wraps a child in a tilt-host. SSR-safe: if motion is
// disabled, the wrapper is a plain <div> with no event listeners.
export function Tilt({ children, className = '', nearSelector = '[data-tilt-near]', maxAngle = 6, as: Tag = 'div', ...rest }) {
  const { ref, enabled } = useHeroTilt({ maxAngle });
  return (
    <Tag
      ref={ref}
      className={`tilt-host${enabled ? ' is-enabled' : ''}${className ? ' ' + className : ''}`}
      data-tilt-near-selector={nearSelector}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ponytail: HeroParallax — wrapper that scrolls its inner content with
// the page. The wrapped block must contain elements with [data-parallax]
// so the CSS can target them. SSR-safe.
export function HeroParallax({ children, amount = 80, className = '', as: Tag = 'div', ...rest }) {
  const { ref, enabled } = usePointerParallax({ amount });
  return (
    <Tag
      ref={ref}
      className={`parallax-host${enabled ? ' is-enabled' : ''}${className ? ' ' + className : ''}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
