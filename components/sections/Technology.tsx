'use client';

import { useLayoutEffect, useRef } from 'react';
import { CAPABILITIES, type Capability } from '@/data/content';
import { TechLabel } from '@/components/ui/TechLabel';
import { useInViewOnce } from '@/lib/useInViewOnce';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { gsap } from '@/lib/motion';
import { cn } from '@/lib/cn';

function TechRow({ cap }: { cap: Capability }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.4);
  return (
    <div
      ref={ref}
      className="group relative grid gap-5 border-t border-bone/10 py-10 pl-8 md:grid-cols-[72px_1fr_1.1fr_auto] md:items-center md:gap-8 md:pl-12"
    >
      {/* node on the left rail */}
      <span
        className={cn(
          'absolute left-[3px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border transition-all duration-500',
          inView ? 'border-signal-hot bg-signal-hot shadow-[0_0_10px_rgba(255,45,32,0.7)]' : 'border-bone/30 bg-void',
        )}
        aria-hidden="true"
      />

      <span className="t-display text-2xl text-dim transition-colors group-hover:text-signal-hot">{cap.index}</span>

      <div>
        <h3 className="t-display flex items-center gap-4 text-2xl md:text-3xl">
          {cap.title}
          <span
            className={cn('glow-dot transition-opacity duration-500', inView ? 'opacity-100' : 'opacity-0')}
            aria-hidden="true"
          />
        </h3>
      </div>

      <p className="max-w-md text-sm leading-relaxed text-ash">{cap.description}</p>

      <div className="flex flex-wrap gap-2 md:justify-end">
        {cap.meta.map((m) => (
          <span key={m.k} className="border border-bone/15 px-3 py-1.5">
            <span className="t-label">
              {m.k} <span className="text-signal-hot">{m.v}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Technology — capabilities rendered as an engineering HUD, not cards. */
export function Technology() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = railRef.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el, { scaleY: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top 70%', end: 'bottom 40%', scrub: 0.6 },
        },
      );
    });
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="capabilities" className="relative overflow-hidden bg-abyss py-[22vh]">
      <div className="bp-grid-fine absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <TechLabel red className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-signal" />
              02 // CAPABILITIES
            </TechLabel>
            <h2 className="t-display t-h3">TECHNOLOGY</h2>
          </div>
          <TechLabel>SYS.MODULES // 04 ACTIVE</TechLabel>
        </div>

        <div className="relative">
          {/* left rail */}
          <span className="absolute left-[7px] top-0 h-full w-px bg-bone/10" aria-hidden="true" />
          <div
            ref={railRef}
            className="absolute left-[7px] top-0 h-full w-px origin-top bg-signal shadow-[0_0_8px_rgba(193,18,31,0.6)]"
            aria-hidden="true"
          />
          <div className="border-b border-bone/10">
            {CAPABILITIES.map((cap) => (
              <TechRow key={cap.id} cap={cap} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
