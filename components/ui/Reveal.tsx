'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /** vertical offset to rise from */
  y?: number;
  delay?: number;
  duration?: number;
}

/** Scroll-triggered rise + fade reveal (no-op under reduced motion). */
export function Reveal({ children, className, y = 40, delay = 0, duration = 1.1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });
    return () => ctx.revert();
  }, [y, delay, duration]);

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}
