'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Fixed full-viewport atmosphere layers: film grain, scanlines, vignette
 * and a restrained red HUD frame. Purely decorative (aria-hidden).
 */
export function Overlays() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {/* atmosphere */}
      <div className="grain absolute inset-0 opacity-[0.05]" />
      <div className="scanlines absolute inset-0 opacity-[0.04]" />
      <div className="vig absolute inset-0" />

      {/* HUD frame */}
      <div
        className={cn(
          'absolute inset-3 transition-opacity duration-1000 md:inset-5',
          on ? 'opacity-100' : 'opacity-0',
        )}
      >
        {/* corner brackets */}
        <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-signal/70" />
        <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-signal/70" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-signal/70" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-signal/70" />

        {/* top + bottom center ticks */}
        <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-signal/60" />
        <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-signal/60" />

        {/* side tick rails */}
        <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={cn('h-px', i === 4 ? 'w-3 bg-signal/70' : 'w-1.5 bg-bone/20')} />
          ))}
        </div>
        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-2 md:flex">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={cn('h-px', i === 4 ? 'w-3 bg-signal/70' : 'w-1.5 bg-bone/20')} />
          ))}
        </div>
      </div>
    </div>
  );
}
