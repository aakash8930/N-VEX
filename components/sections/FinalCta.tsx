'use client';

import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { TechLabel } from '@/components/ui/TechLabel';
import { useInViewOnce } from '@/lib/useInViewOnce';
import { cn } from '@/lib/cn';

/** SECTION 8 — final call to action. */
export function FinalCta() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);

  return (
    <section id="contact" className="relative overflow-hidden py-[28vh]">
      {/* faint globe-like glow bottom */}
      <div
        className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[80%] w-[120%] -translate-x-1/2 rounded-[100%] opacity-40"
        style={{ background: 'radial-gradient(closest-side, rgba(193,18,31,0.18), transparent 70%)' }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative mx-auto max-w-[1600px] px-5 text-center md:px-10">
        <TechLabel red className="mb-8 inline-flex items-center gap-3">
          <span className="h-px w-10 bg-signal" />
          07 // INITIATE
          <span className="h-px w-10 bg-signal" />
        </TechLabel>

        <DisplayHeading as="h2" className="t-h2" lines={['BUILD THE', 'IMPOSSIBLE.']} accentLine={1} />

        {/* red line draw */}
        <div className="mx-auto mt-10 h-px w-56 overflow-hidden" aria-hidden="true">
          <div
            className={cn(
              'h-px w-full origin-left bg-signal-hot shadow-[0_0_12px_rgba(255,45,32,0.8)] transition-transform duration-[1400ms] ease-[var(--ease-cine)]',
              inView ? 'scale-x-100' : 'scale-x-0',
            )}
          />
        </div>

        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-ash md:text-lg">
          Let&rsquo;s engineer what comes next.
        </p>

        <div className="mt-12 flex justify-center">
          <a href="mailto:hello@novex.systems" className="group relative overflow-hidden border border-signal px-10 py-5">
            <span className="t-label relative z-10 text-bone transition-colors group-hover:text-white">START A PROJECT</span>
            <span className="absolute inset-0 origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
          </a>
        </div>
      </div>
    </section>
  );
}
