import { BRAND, FOOTER_COLUMNS, COORDS } from '@/data/content';

export function SiteFooter() {
  return (
    <footer className="relative border-t border-bone/10 bg-void">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* brand */}
          <div>
            <a href="#top" className="flex items-center gap-3" aria-label={`${BRAND.name} home`}>
              <span className="relative block h-3 w-3">
                <span className="absolute inset-0 border border-signal-hot" />
                <span className="glow-dot absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2" />
              </span>
              <span className="t-display text-2xl tracking-[0.18em]">{BRAND.name}</span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">{BRAND.tagline}</p>
          </div>

          {/* link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="t-label mb-5 text-signal-hot">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-ash transition-colors hover:text-bone">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* metadata strip */}
        <div className="mt-16 hairline-h" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="t-label">© 2026 {BRAND.name} — ALL SYSTEMS NOMINAL</span>
          <div className="flex flex-wrap items-center gap-6">
            <span className="t-label">{COORDS.lat} / {COORDS.lon}</span>
            <span className="t-label">BUILD {COORDS.build}</span>
            <span className="t-label text-signal-hot">NVX.SYS // 05:05:05</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
