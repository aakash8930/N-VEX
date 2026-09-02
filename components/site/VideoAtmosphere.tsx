'use client';

import { useEffect, useRef } from 'react';
import { videoBus } from '@/lib/videoBus';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

/**
 * Site-wide cinematic background: the source footage redrawn into a fixed
 * full-viewport canvas, center-cropped to the viewport aspect and only lightly
 * dimmed (no heavy blur) so it reads as a living video backdrop, not a smear.
 * The single decoder is shared with the hero plate via videoBus.
 */
export function VideoAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Internal resolution: 16:9, high enough to read as video when upscaled.
    const W = (canvas.width = 960);
    const H = (canvas.height = 540);

    const draw = () => {
      const v = videoBus.get();
      if (!v || v.readyState < 2) return;
      // Center-crop the 9:16 frame to a 16:9 band (cover) so it isn't distorted.
      const vw = v.videoWidth || 720;
      const vh = v.videoHeight || 1280;
      const sh = vw * (H / W); // source height for target aspect
      const sy = Math.max(0, (vh - sh) / 2);
      ctx.drawImage(v, 0, sy, vw, sh, 0, 0, W, H);
    };

    if (reduced) {
      draw();
      const id = window.setInterval(draw, 800);
      return () => window.clearInterval(id);
    }

    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 66) return; // ~15fps
      last = t;
      if (!document.hidden) draw();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* the footage as a sharp, living backdrop */}
      <canvas
        ref={canvasRef}
        className="nvx-breath absolute inset-0 h-full w-full opacity-[0.5] brightness-[0.72] saturate-[0.95]"
      />
      {/* legibility veil */}
      <div className="absolute inset-0 bg-void/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/60" />
    </div>
  );
}
