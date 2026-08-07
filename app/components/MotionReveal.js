'use client';

import { useEffect, useRef, useState } from 'react';

export function MotionReveal({ children, className = '', stagger = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`motion-reveal${visible ? ' is-visible' : ''}${stagger ? ' stagger' : ''} ${className}`}>{children}</div>;
}
