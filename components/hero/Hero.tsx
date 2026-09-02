'use client';

import { useLayoutEffect, useRef } from 'react';
import { HeroVideo } from './HeroVideo';
import { TechLabel } from '@/components/ui/TechLabel';
import { BRAND } from '@/data/content';
import { gsap } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/usePrefersReducedMotion';

/** Full-viewport cinematic hero. */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('[data-hero]'), { opacity: 1, y: 0 });
      gsap.set(el.querySelectorAll('.mask-line > span'), { yPercent: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('[data-hero-fade]', { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0.2)
        .fromTo(
          '.mask-line > span',
          { yPercent: 120 },
          { yPercent: 0, duration: 1.4, stagger: 0.14 },
          0.5,
        )
        .fromTo(
          '[data-hero]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
          1.0,
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={rootRef} className="relative min-h-[100svh] overflow-hidden bg-void">
      <HeroVideo />

      {/* legibility scrims */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-void via-void/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void/80 to-transparent" />

      {/* copy */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-5 pb-28 md:px-10 lg:justify-center lg:pb-0">
        <div className="lg:max-w-[58%]">
          <TechLabel red className="mb-6 flex items-center gap-3">
            <span className="glow-dot glow-pulse" />
            ADVANCED ENGINEERING SYSTEMS
          </TechLabel>

          <h1 className="t-display t-h1">
            <span className="mask-line"><span>ENGINEERING</span></span>
            <span className="mask-line"><span>WHAT&rsquo;S NEXT.</span></span>
          </h1>

          <p data-hero className="mt-8 max-w-md text-base leading-relaxed text-ash md:text-lg">
            {BRAND.tagline}
          </p>

          <div data-hero className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#system" className="group relative overflow-hidden border border-signal px-7 py-4">
              <span className="t-label relative z-10 text-bone transition-colors group-hover:text-white">
                EXPLORE TECHNOLOGY
              </span>
              <span className="absolute inset-0 origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
            </a>
            <a href="#capabilities" className="group border border-bone/20 px-7 py-4 transition-colors hover:border-bone/50">
              <span className="t-label">VIEW CAPABILITIES</span>
            </a>
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div data-hero className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2" aria-hidden="true">
        <div className="flex flex-col items-center gap-3">
          <span className="t-label">SCROLL</span>
          <span className="relative block h-12 w-px overflow-hidden bg-bone/15">
            <span className="absolute left-0 top-0 h-4 w-px animate-[nvx-scroll_2s_var(--ease-soft)_infinite] bg-signal-hot" />
          </span>
        </div>
      </div>
    </section>
  );
}
