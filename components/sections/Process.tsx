'use client';

import { useEffect, useRef } from 'react';
import { PROCESS } from '@/data/content';
import { TechLabel } from '@/components/ui/TechLabel';
import { ScrollTrigger } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

/** SECTION 5 — engineering process timeline. */
export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (reduced) {
      if (hLineRef.current) hLineRef.current.style.transform = 'scaleX(1)';
      if (vLineRef.current) vLineRef.current.style.transform = 'scaleY(1)';
      itemRefs.current.forEach((el) => el?.classList.add('is-active'));
      return;
    }

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top 75%',
      end: 'bottom 45%',
      onUpdate: (self) => {
        const p = self.progress;
        if (hLineRef.current) hLineRef.current.style.transform = `scaleX(${p})`;
        if (vLineRef.current) vLineRef.current.style.transform = `scaleY(${p})`;
        const idx = Math.min(PROCESS.length - 1, Math.floor(p * PROCESS.length));
        itemRefs.current.forEach((el, i) => el?.classList.toggle('is-active', i <= idx));
      },
    });
    return () => st.kill();
  }, [reduced]);

  return (
    <section id="process" className="relative overflow-hidden bg-abyss py-[22vh]">
      <div className="bp-grid-fine absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-8">
          <div>
            <TechLabel red className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-signal" />
              04 // METHOD
            </TechLabel>
            <h2 className="t-display t-h3">ENGINEERING PROCESS</h2>
          </div>
          <TechLabel>PHASES // 05</TechLabel>
        </div>

        <div ref={trackRef} className="relative">
          {/* horizontal rail (lg) */}
          <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-bone/10 lg:block" aria-hidden="true" />
          <div ref={hLineRef} className="absolute left-0 right-0 top-[5px] hidden h-px origin-left scale-x-0 bg-signal shadow-[0_0_8px_rgba(193,18,31,0.6)] lg:block" aria-hidden="true" />
          {/* vertical rail (mobile) */}
          <span className="absolute bottom-0 left-[5px] top-0 w-px bg-bone/10 lg:hidden" aria-hidden="true" />
          <div ref={vLineRef} className="absolute bottom-0 left-[5px] top-0 w-px origin-top scale-y-0 bg-signal lg:hidden" aria-hidden="true" />

          <ol className="grid gap-12 lg:grid-cols-5 lg:gap-8">
            {PROCESS.map((stage, i) => (
              <li
                key={stage.index}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="pitem relative pl-10 lg:pl-0 lg:pt-12"
              >
                {/* node */}
                <span className="pnode absolute left-0 top-0 h-3 w-3 rotate-45 lg:left-0 lg:top-0" aria-hidden="true" />
                <span className="pidx t-label block">{stage.index}</span>
                <h3 className="pttl t-display mt-3 text-2xl">{stage.title}</h3>
                <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-ash">{stage.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
