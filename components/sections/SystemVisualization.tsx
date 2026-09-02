'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { TechLabel } from '@/components/ui/TechLabel';

/** Deterministic PRNG so the network is identical on every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Graph {
  nodes: Node[];
  edges: Edge[];
}
interface Node {
  x: number;
  y: number;
  hub: boolean;
  ph: number;
}
interface Edge {
  a: number;
  b: number;
  red: boolean;
}

function buildGraph(): { nodes: Node[]; edges: Edge[] } {
  const rnd = mulberry32(1337);
  const nodes: Node[] = [];
  const N = 42;
  for (let i = 0; i < N; i++) {
    nodes.push({ x: 0.06 + rnd() * 0.88, y: 0.06 + rnd() * 0.88, hub: i % 8 === 0, ph: rnd() });
  }
  const edges: Edge[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < N; i++) {
    // connect to 2 nearest neighbours
    const d = nodes
      .map((n, j) => ({ j, dist: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
    for (const { j } of d) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: i, b: j, red: nodes[i].hub || nodes[j].hub });
    }
  }
  return { nodes, edges };
}

/** Single shared graph so the overlay legend matches the render. */
const GRAPH: Graph = buildGraph();

/**
 * SECTION 4 — real-time engineering/system visualization.
 * A sticky full-viewport canvas: thin red routes, glowing hub nodes, white
 * links, floating mono labels, particles and a subtle grid. Scroll pans and
 * rotates the network; it never reads as a static website graphic.
 */
export function SystemVisualization() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progRef = useRef<HTMLSpanElement>(null);
  const progress = useRef(0.4);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const reduced = usePrefersReducedMotion();

  // Drive progress with scroll.
  useEffect(() => {
    if (reduced) {
      progress.current = 0.45;
      return;
    }
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    return () => st.kill();
  }, [reduced]);

  // Pointer parallax.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [reduced]);

  // Canvas render loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { nodes, edges } = GRAPH;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.width = Math.floor(canvas.clientWidth * dpr);
      H = canvas.height = Math.floor(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let running = true;
    const io = new IntersectionObserver(([e]) => (running = e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    const project = (n: Node, t: number, pan: number, rot: number, scale: number) => {
      const cx = W / 2;
      const cy = H / 2;
      let x = (n.x - 0.5) * scale;
      let y = (n.y - 0.5) * scale;
      // rotate
      const c = Math.cos(rot);
      const s = Math.sin(rot);
      const rx = x * c - y * s;
      const ry = x * s + y * c;
      x = rx;
      y = ry;
      const px = cx + x * W * 0.9 + (pointer.current.x - 0.5) * 30 * dpr;
      const py = cy + y * H * 0.9 + pan + (pointer.current.y - 0.5) * 30 * dpr + Math.sin(t * 0.4 + n.ph * 6) * 6 * dpr;
      return { px, py };
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      const t = time / 1000;
      const p = progress.current;

      // background
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      glow.addColorStop(0, 'rgba(16,19,24,0.9)');
      glow.addColorStop(1, 'rgba(5,5,5,1)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // subtle grid (parallax with scroll)
      const g = 56 * dpr;
      const off = (p * H * 0.2) % g;
      ctx.strokeStyle = 'rgba(233,231,224,0.045)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x += g) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let y = -off; y <= H; y += g) {
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();

      const pan = -p * H * 0.25;
      const rot = (p - 0.5) * 0.25;
      const scale = 1 + p * 0.18;

      const pts = nodes.map((n) => project(n, t, pan, rot, scale));

      // radar sweep
      if (!reduced && typeof ctx.createConicGradient === 'function') {
        const sweep = (t * 0.25) % (Math.PI * 2);
        const grad = ctx.createConicGradient(sweep, W / 2, H / 2);
        grad.addColorStop(0, 'rgba(255,45,32,0.06)');
        grad.addColorStop(0.12, 'rgba(255,45,32,0)');
        grad.addColorStop(1, 'rgba(255,45,32,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // edges (draw-in as you scroll)
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const reveal = i / edges.length;
        if (reveal > p * 1.4 + 0.15) continue;
        const a = pts[e.a];
        const b = pts[e.b];
        if (e.red) {
          ctx.strokeStyle = 'rgba(255,45,32,0.35)';
          ctx.lineWidth = 1.4 * dpr;
          ctx.shadowColor = 'rgba(255,45,32,0.5)';
          ctx.shadowBlur = 8 * dpr;
        } else {
          ctx.strokeStyle = 'rgba(233,231,224,0.08)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // travelling packets on red routes
        if (e.red && !reduced) {
          const pt = (t * 0.12 + e.a * 0.11) % 1;
          const x = a.px + (b.px - a.px) * pt;
          const y = a.py + (b.py - a.py) * pt;
          ctx.fillStyle = 'rgba(255,45,32,0.9)';
          ctx.beginPath();
          ctx.arc(x, y, 1.6 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const { px, py } = pts[i];
        if (n.hub) {
          const pulse = reduced ? 0.6 : 0.5 + Math.sin(t * 2 + n.ph * 8) * 0.3;
          ctx.strokeStyle = `rgba(255,45,32,${0.5 + pulse * 0.4})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.shadowColor = 'rgba(255,45,32,0.8)';
          ctx.shadowBlur = 12 * dpr;
          ctx.beginPath();
          ctx.arc(px, py, 5 * dpr, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = 'rgba(255,45,32,0.95)';
          ctx.beginPath();
          ctx.arc(px, py, 1.8 * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // label chip
          ctx.strokeStyle = 'rgba(233,231,224,0.18)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 10 * dpr, py - 22 * dpr, 74 * dpr, 16 * dpr);
          ctx.fillStyle = 'rgba(233,231,224,0.5)';
          ctx.font = `${9 * dpr}px "IBM Plex Mono", monospace`;
          ctx.fillText(`N-${String(i).padStart(2, '0')}  ${(n.x * 90).toFixed(1)}°`, px + 14 * dpr, py - 11 * dpr);
        } else {
          ctx.fillStyle = 'rgba(233,231,224,0.35)';
          ctx.beginPath();
          ctx.arc(px, py, 1.2 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // measurement annotation between first two hubs
      const hubs = nodes.map((n, i) => ({ n, i })).filter((o) => o.n.hub);
      if (hubs.length >= 2) {
        const a = pts[hubs[0].i];
        const b = pts[hubs[1].i];
        ctx.strokeStyle = 'rgba(233,231,224,0.25)';
        ctx.setLineDash([4 * dpr, 4 * dpr]);
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.stroke();
        ctx.setLineDash([]);
        const dist = Math.hypot(b.px - a.px, b.py - a.py) / dpr;
        ctx.fillStyle = 'rgba(233,231,224,0.45)';
        ctx.font = `${9 * dpr}px "IBM Plex Mono", monospace`;
        ctx.fillText(`Δ ${(dist / 40).toFixed(2)}m`, (a.px + b.px) / 2 + 6 * dpr, (a.py + b.py) / 2);
      }

      // vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      if (progRef.current) progRef.current.textContent = `TRK ${(p * 100).toFixed(0).padStart(3, '0')}%`;
    };

    if (reduced) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <section id="system" ref={sectionRef} className="relative h-[230vh] bg-void">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* overlay UI */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-5 top-24 md:left-10 md:top-28">
            <TechLabel red className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-signal" />
              03 // LIVE TELEMETRY
            </TechLabel>
            <h2 className="t-display t-h3 max-w-md">SYSTEM VISUALIZATION</h2>
          </div>

          {/* corner brackets */}
          <span className="absolute left-5 top-20 h-5 w-5 border-l border-t border-signal/70 md:left-10" />
          <span className="absolute right-5 top-20 h-5 w-5 border-r border-t border-signal/70 md:right-10" />
          <span className="absolute bottom-8 left-5 h-5 w-5 border-b border-l border-signal/70 md:left-10" />
          <span className="absolute bottom-8 right-5 h-5 w-5 border-b border-r border-signal/70 md:right-10" />

          {/* readouts */}
          <div className="absolute bottom-10 left-5 flex flex-col gap-2 md:left-10">
            <span ref={progRef} className="t-label text-signal-hot">TRK 040%</span>
            <span className="t-label">NODES {GRAPH.nodes.length} · ROUTES {GRAPH.edges.length} · GRID 56</span>
          </div>

          {/* legend */}
          <div className="absolute bottom-10 right-5 hidden flex-col gap-3 md:flex md:right-10">
            <span className="t-label flex items-center gap-3"><span className="h-px w-6 bg-signal-hot" /> ACTIVE ROUTE</span>
            <span className="t-label flex items-center gap-3"><span className="h-px w-6 bg-bone/40" /> DATA LINK</span>
            <span className="t-label flex items-center gap-3"><span className="glow-dot" /> HUB NODE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
