'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

const SRC = '/video/nvex-hero.mp4';
const POSTER = '/video/poster.jpg';

/** Feathered mask so the 9:16 plate dissolves into the near-black void. */
const MASK = 'radial-gradient(120% 96% at 50% 50%, #000 58%, transparent 100%)';

function fmt(t: number): string {
  const m = Math.floor(t / 60).toString().padStart(2, '0');
  const s = (t % 60).toFixed(1).padStart(4, '0');
  return `${m}:${s}`;
}

/**
 * Full-bleed hero composition: a centered, intact 9:16 video plate whose edges
 * feather into the void, an ambient blurred "wash" of the same footage filling
 * the gutters, HUD corner markers, and a live progress rail synced to playback.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const washRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  // Ambient wash: draw the video into a tiny canvas, upscaled + blurred in CSS.
  useEffect(() => {
    const v = videoRef.current;
    const c = washRef.current;
    if (!v || !c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = (c.width = 90);
    const H = (c.height = 160);

    const draw = () => {
      if (v.readyState >= 2) ctx.drawImage(v, 0, 0, W, H);
    };

    if (reduced) {
      const once = () => draw();
      if (v.readyState >= 2) once();
      else v.addEventListener('loadeddata', once, { once: true });
      return;
    }

    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 100) return; // ~10fps is plenty for a blurred wash
      last = t;
      draw();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Reduced motion: show a static, representative frame instead of autoplaying.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !reduced) return;
    const seek = () => {
      v.currentTime = 4.5;
      v.pause();
    };
    if (v.readyState >= 1) seek();
    else v.addEventListener('loadedmetadata', seek, { once: true });
  }, [reduced]);

  // Pause when the hero leaves the viewport (perf) + drive progress rail.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let inView = true;
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (reduced) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!inView || reduced) return;
      const d = v.duration || 1;
      const p = Math.min(1, Math.max(0, (v.currentTime || 0) / d));
      if (tickRef.current) tickRef.current.style.transform = `translateY(${p * 100}%)`;
      if (readRef.current) readRef.current.textContent = fmt(v.currentTime || 0);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* ambient wash of the same footage (gutter ambience, no extra decoder) */}
      <canvas
        ref={washRef}
        className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl saturate-[0.85]"
      />

      {/* the intact 9:16 plate — right-shifted on desktop to free the left gutter */}
      <div className="absolute inset-0 grid place-items-center lg:justify-end lg:pr-[5vw]">
        <div className="relative aspect-[9/16] h-full max-h-full max-w-[96vw]">
          <video
            ref={videoRef}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
              ready ? 'opacity-100' : 'opacity-0',
            )}
            style={{ maskImage: MASK, WebkitMaskImage: MASK }}
            src={SRC}
            poster={POSTER}
            muted
            loop
            playsInline
            autoPlay={!reduced}
            preload="auto"
            disablePictureInPicture
            onLoadedData={() => setReady(true)}
          />

          {/* HUD corner markers hugging the plate */}
          <span className="absolute -left-3 -top-3 h-5 w-5 border-l border-t border-signal/80" />
          <span className="absolute -right-3 -top-3 h-5 w-5 border-r border-t border-signal/80" />
          <span className="absolute -bottom-3 -left-3 h-5 w-5 border-b border-l border-signal/80" />
          <span className="absolute -bottom-3 -right-3 h-5 w-5 border-b border-r border-signal/80" />

          {/* source readout */}
          <div className="absolute -bottom-10 left-0 hidden items-center gap-3 md:flex">
            <span className="t-label text-signal-hot">SRC // NVX-HERO.MP4</span>
            <span className="t-label">720×1280 · 30FPS · 26.47S</span>
          </div>
        </div>
      </div>

      {/* live progress rail */}
      <div className="absolute right-4 top-1/2 hidden h-[46vh] w-px -translate-y-1/2 bg-bone/15 md:block lg:right-8">
        <div
          ref={tickRef}
          className="absolute left-1/2 h-10 w-px -translate-x-1/2 bg-signal-hot shadow-[0_0_8px_rgba(255,45,32,0.8)]"
        />
        <span ref={readRef} className="t-label absolute left-1/2 top-full mt-3 -translate-x-1/2">
          00:00.0
        </span>
      </div>
    </div>
  );
}
