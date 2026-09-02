'use client';

import { cn } from '@/lib/cn';
import { useInViewOnce } from '@/lib/useInViewOnce';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  red?: boolean;
}

/** Small uppercase mono label with a tracking-in reveal. */
export function TechLabel({ children, className, red }: Props) {
  const [ref, inView] = useInViewOnce<HTMLSpanElement>(0.4);
  return (
    <span
      ref={ref}
      className={cn('t-label trk-in', red && 'text-signal-hot', inView && 'is-in', className)}
    >
      {children}
    </span>
  );
}
