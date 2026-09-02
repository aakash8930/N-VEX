import { APPLICATIONS } from '@/data/content';
import { TechLabel } from '@/components/ui/TechLabel';
import { Reveal } from '@/components/ui/Reveal';

function RingSchematic() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="pointer-events-none absolute -right-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 animate-[nvx-rot_90s_linear_infinite] opacity-60"
      aria-hidden="true"
      fill="none"
    >
      <circle cx="200" cy="200" r="180" stroke="rgba(233,231,224,0.08)" />
      <circle cx="200" cy="200" r="140" stroke="rgba(233,231,224,0.06)" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="96" stroke="rgba(233,231,224,0.10)" />
      {/* red arc */}
      <path d="M200 20 A180 180 0 0 1 380 200" stroke="rgba(255,45,32,0.5)" strokeWidth="1.5" />
      {/* ticks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const x1 = 200 + Math.cos(a) * 172;
        const y1 = 200 + Math.sin(a) * 172;
        const x2 = 200 + Math.cos(a) * 180;
        const y2 = 200 + Math.sin(a) * 180;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(233,231,224,0.15)" />;
      })}
      {/* crosshair */}
      <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(233,231,224,0.05)" />
      <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(233,231,224,0.05)" />
      <circle cx="200" cy="200" r="3" fill="rgba(255,45,32,0.9)" />
    </svg>
  );
}

/** SECTION 6 — applications. */
export function Applications() {
  return (
    <section id="applications" className="relative overflow-hidden py-[22vh]">
      <div className="bp-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <RingSchematic />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <TechLabel red className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-signal" />
              05 // DEPLOYMENT
            </TechLabel>
            <h2 className="t-display t-h3">APPLICATIONS</h2>
          </div>
          <TechLabel>SECTORS // 05</TechLabel>
        </div>

        <ul>
          {APPLICATIONS.map((app, i) => (
            <li key={app.index}>
              <Reveal delay={i * 0.05}>
                <a
                  href="#contact"
                  className="group relative flex flex-wrap items-baseline justify-between gap-4 border-t border-bone/10 py-8 last:border-b md:py-10"
                >
                  <span className="flex items-baseline gap-6">
                    <span className="t-label text-signal-hot">{app.index}</span>
                    <span className="t-display t-h3 transition-all duration-500 group-hover:tracking-[0.02em] group-hover:text-white md:text-5xl">
                      {app.title}
                    </span>
                  </span>
                  <span className="flex items-center gap-6">
                    <span className="t-label hidden md:block">{app.spec}</span>
                    <span className="t-label border border-bone/15 px-3 py-1.5">{app.tag}</span>
                    <span className="hidden h-px w-0 bg-signal-hot transition-all duration-500 group-hover:w-16 md:block" />
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
