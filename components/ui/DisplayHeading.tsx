'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface Props {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** red accent applied to a specific line (0-based) */
  accentLine?: number;
}

/** Huge thin display type with a line-mask reveal, driven by scroll. */
export function DisplayHeading({ lines, as = 'h2', className, accentLine }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLElement>('.mask-line > span');
    if (prefersReducedMotion()) {
      gsap.set(spans, { yPercent: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  const Tag = as;
  return (
    <Tag ref={ref as never} className={cn('t-display', className)}>
      {lines.map((line, i) => (
        <span key={i} className={cn('mask-line', i === accentLine && 'text-signal-hot')}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
