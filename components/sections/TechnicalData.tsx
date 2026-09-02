'use client';

import { useEffect, useState } from 'react';
import { TECH_DATA, type TechStat } from '@/data/content';
import { TechLabel } from '@/components/ui/TechLabel';
import { useInViewOnce } from '@/lib/useInViewOnce';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { gsap } from '@/lib/motion';

const GAUGE: Record<string, number> = {
  precision: 99.9,
  intelligence: 100,
  response: 96,
  engineered: 100,
};

function Stat({ stat }: { stat: TechStat }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.4);
  const [text, setText] = useState(stat.animate ? '0' : String(stat.value));
  const [bar, setBar] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView) return;
    const gauge = GAUGE[stat.id] ?? 100;
    if (reduced) {
      setText(stat.value.toFixed(stat.decimals));
      setBar(gauge);
      return;
    }
    const obj = { v: 0, b: 0 };
    const tw = gsap.to(obj, {
      v: stat.value,
      b: gauge,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (stat.animate) setText(obj.v.toFixed(stat.decimals));
        setBar(obj.b);
      },
    });
    return () => {
      tw.kill();
    };
  }, [inView, reduced, stat]);

  return (
    <div ref={ref} className="hud-corner group relative flex flex-col gap-6 border border-bone/10 bg-carbon/60 p-8">
      <div className="flex items-center justify-between">
        <span className="t-label">{stat.note}</span>
        <span className="glow-dot glow-pulse" aria-hidden="true" />
      </div>

      <div className="t-display flex items-baseline text-6xl md:text-7xl">
        <span className="text-signal-hot">{stat.prefix}</span>
        <span>{stat.animate ? text : stat.value}</span>
        <span className="ml-1 text-3xl text-signal-hot md:text-4xl">{stat.suffix}</span>
      </div>

      <div>
        <span className="t-label">{stat.label}</span>
        <div className="mt-3 h-px w-full bg-bone/10" aria-hidden="true">
          <div
            className="h-px bg-signal-hot shadow-[0_0_8px_rgba(255,45,32,0.7)]"
            style={{ width: `${bar}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/** SECTION 7 — technical readouts (easily replaceable placeholders). */
export function TechnicalData() {
  return (
    <section id="data" className="relative overflow-hidden py-[22vh]">
      <div className="bp-grid-fine absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <TechLabel red className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-signal" />
              06 // TELEMETRY
            </TechLabel>
            <h2 className="t-display t-h3">TECHNICAL DATA</h2>
          </div>
          <TechLabel>LIVE // REPLACE WITH COMPANY DATA</TechLabel>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TECH_DATA.map((s) => (
            <Stat key={s.id} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
