import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { TechLabel } from '@/components/ui/TechLabel';
import { Reveal } from '@/components/ui/Reveal';

/** Intro / statement — nearly black, blueprint grid, huge thin type. */
export function Statement() {
  return (
    <section id="about" className="relative overflow-hidden py-[24vh]">
      {/* drifting blueprint grid */}
      <div className="bp-grid absolute inset-0 opacity-70" data-speed="0.85" aria-hidden="true" />
      <div className="bp-grid-fine absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            <TechLabel red className="mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-signal" />
              01 // PHILOSOPHY
            </TechLabel>
            <DisplayHeading as="h2" className="t-h2" lines={['PRECISION', 'IN MOTION.']} />
          </div>

          <div className="flex flex-col justify-end gap-10">
            <Reveal>
              <p className="max-w-md text-base leading-relaxed text-ash md:text-lg">
                We treat engineering as a discipline of restraint. Every gram, every micron and
                every millisecond is a decision — so we make each one deliberately, then prove it
                under load. The result is machinery that behaves less like a product and more like
                a law of physics.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid grid-cols-3 gap-6 border-t border-bone/10 pt-6">
                <div>
                  <span className="t-label text-signal-hot">TOL</span>
                  <p className="t-display mt-2 text-2xl normal-case">±2µm</p>
                </div>
                <div>
                  <span className="t-label text-signal-hot">MASS</span>
                  <p className="t-display mt-2 text-2xl">-38%</p>
                </div>
                <div>
                  <span className="t-label text-signal-hot">MTBF</span>
                  <p className="t-display mt-2 text-2xl">50kH</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
