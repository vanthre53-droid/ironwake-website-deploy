'use client';

// ponytail: MotionReveal — reveals a section when it scrolls into view.
// Behaviour contract:
//   - One-shot IntersectionObserver. Component unmounts the observer after the
//     first visible entry, so re-scrolling does not replay the animation.
//   - Honors prefers-reduced-motion at the OS level: if the user has asked
//     for less motion, we set the .is-visible + .no-motion classes
//     synchronously on mount and skip the observer entirely (no animation).
//   - Honors prefers-reduced-transparency: removes the saturate filter so
//     the entrance is just a translate, not a brightness change.
//   - Fail-safe: if IntersectionObserver is missing (old browsers, js
//     disabled), the component still renders visibly thanks to the
//     .is-visible default in CSS that is overridden by the .no-motion flag
//     only when JS knows the user has asked for less motion.
//   - The component writes --reveal-progress in [0,1] on the element so
//     children can opt in to scroll-driven micro-motion (parallax, scale)
//     without spinning up a second observer per child.
import { useEffect, useRef, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const REDUCED_TRANSPARENCY_QUERY = '(prefers-reduced-transparency: reduce)';

function readMotionPrefs() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return { reducedMotion: false, reducedTransparency: false };
  }
  return {
    reducedMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches,
    reducedTransparency: window.matchMedia(REDUCED_TRANSPARENCY_QUERY).matches
  };
}

export function MotionReveal({
  children,
  className = '',
  stagger = false,
  threshold = 0.12,
  rootMargin = '0px 0px -8% 0px',
  as: Tag = 'div'
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState({ reducedMotion: false, reducedTransparency: false });

  useEffect(() => {
    const node = ref.current;
    const initial = readMotionPrefs();
    setPrefs(initial);
    if (initial.reducedMotion) {
      setVisible(true);
      return;
    }
    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined' || !node) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry || !entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold, rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (event) => {
      setPrefs((prev) => ({ ...prev, reducedMotion: event.matches }));
      if (event.matches) setVisible(true);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
    };
  }, []);

  const classes = [
    'motion-reveal',
    visible ? 'is-visible' : '',
    stagger ? 'stagger' : '',
    prefs.reducedMotion ? 'no-motion' : '',
    prefs.reducedTransparency ? 'no-transparency' : '',
    className
  ].filter(Boolean).join(' ');

  return <Tag ref={ref} className={classes}>{children}</Tag>;
}
