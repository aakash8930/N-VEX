'use client';

import { useEffect, useRef } from 'react';
import { videoBus } from '@/lib/videoBus';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

/**
 * Site-wide cinematic background: the source footage, redrawn at tiny
 * resolution into a fixed full-viewport canvas, then blurred + dimmed so the
 * whole page breathes with the video's motion (blueprint flashes, red
 * particles, the closing globe) without competing with content.
 * Purely decorative; the single decoder is shared with the hero plate.
 */
export function VideoAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = (canvas.width = 120);
    const H = (canvas.height = 213);

    const draw = () => {
      const v = videoBus.get();
      if (v && v.readyState >= 2) ctx.drawImage(v, 0, 0, W, H);
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
      if (t - last < 100) return; // ~10fps is plenty for a blurred wash
      last = t;
      if (!document.hidden) draw();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* the footage as ambient motion */}
      <canvas
        ref={canvasRef}
        className="nvx-breath absolute inset-0 h-full w-full opacity-[0.45] blur-[22px] brightness-[0.7] saturate-[0.9]"
      />
      {/* legibility veil */}
      <div className="absolute inset-0 bg-void/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/60" />
    </div>
  );
}
