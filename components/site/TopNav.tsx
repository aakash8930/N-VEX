'use client';

import { useEffect, useState } from 'react';
import { NAV, BRAND, COORDS } from '@/data/content';
import { cn } from '@/lib/cn';

/** Minimal fixed navigation with scroll state + mobile overlay menu. */
export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', open);
    return () => document.documentElement.classList.remove('overflow-hidden');
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled && !open ? 'border-b border-bone/10 bg-void/70 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10">
        {/* logo */}
        <a href="#top" className="group flex items-center gap-3" aria-label={`${BRAND.name} home`}>
          <span className="relative block h-3 w-3">
            <span className="absolute inset-0 border border-signal-hot transition-transform duration-300 group-hover:rotate-45" />
            <span className="glow-dot absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2" />
          </span>
          <span className="t-display text-lg tracking-[0.18em]">{BRAND.name}</span>
        </a>

        {/* desktop links */}
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                't-label transition-colors duration-300 hover:text-bone',
                active === item.href ? 'text-signal-hot' : 'text-ash',
              )}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="group relative ml-2 border border-bone/20 px-4 py-2">
            <span className="t-label text-bone transition-colors group-hover:text-void">START A PROJECT</span>
            <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-signal transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={cn('h-px w-6 bg-bone transition-transform', open && 'translate-y-[3.5px] rotate-45')} />
          <span className={cn('h-px w-6 bg-bone transition-transform', open && '-translate-y-[3.5px] -rotate-45')} />
        </button>
      </div>

      {/* mobile menu */}
      <div
        className={cn(
          'fixed inset-0 -z-10 flex flex-col justify-between bg-void/95 pt-24 backdrop-blur-xl transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-2 px-6">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="t-display flex items-baseline gap-4 border-b border-bone/10 py-4 text-3xl"
            >
              <span className="t-label text-signal-hot">0{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center justify-between px-6 pb-8">
          <span className="t-label">{COORDS.lat} / {COORDS.lon}</span>
          <span className="t-label text-signal-hot">SYS // ONLINE</span>
        </div>
      </div>
    </header>
  );
}
