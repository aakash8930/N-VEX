'use client';

import { useEffect } from 'react';
import { ScrollSmoother } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import type { ReactNode } from 'react';

/**
 * Cinematic inertial scrolling via ScrollSmoother (desktop, motion allowed).
 * Degrades to native scrolling on touch devices and under reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) {
      document.documentElement.classList.remove('has-smoother');
      return;
    }
    document.documentElement.classList.add('has-smoother');
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      effects: true,
    });
    return () => {
      smoother.kill();
      document.documentElement.classList.remove('has-smoother');
    };
  }, [reduced]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
