"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Rastro de linhas presas ao cursor por molas.
 *
 * Cada linha é uma corrente de nós; o primeiro nó persegue o ponteiro
 * e os demais perseguem o anterior. Como cada linha tem constante de
 * mola e atrito ligeiramente diferentes, elas se separam no movimento
 * e voltam a se juntar na parada. É o que dá a leitura de líquido.
 *
 * Sem estado global: tudo vive dentro do efeito e é desmontado junto.
 */

type Config = {
  trails: number;
  nodesPerTrail: number;
  friction: number;
  dampening: number;
  tension: number;
  spring: number;
};

const CONFIG: Config = {
  trails: 30,
  nodesPerTrail: 32,
  friction: 0.5,
  dampening: 0.028,
  tension: 0.985,
  spring: 0.42,
};

type Node = { x: number; y: number; vx: number; vy: number };

function makeTrail(spring: number, x: number, y: number) {
  const nodes: Node[] = [];
  for (let i = 0; i < CONFIG.nodesPerTrail; i++) {
    nodes.push({ x, y, vx: 0, vy: 0 });
  }
  return { spring, friction: CONFIG.friction, nodes };
}

export function CursorCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    let trails = Array.from({ length: CONFIG.trails }, (_, i) =>
      makeTrail(
        CONFIG.spring + (i / CONFIG.trails) * 0.028,
        pointer.x,
        pointer.y,
      ),
    );

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let running = true;
    let raf = 0;
    let phase = Math.random() * Math.PI * 2;

    const step = () => {
      if (!running) return;
      const { width, height } = canvas.getBoundingClientRect();

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      // Brilho respira devagar, entre prata e branco puro.
      phase += 0.0016;
      const lightness = 78 + Math.sin(phase) * 14;
      // Alpha baixíssimo de propósito: as trilhas se somam entre si.
      ctx.strokeStyle = `hsla(220, 12%, ${lightness}%, 0.022)`;
      ctx.lineWidth = 8;

      for (const trail of trails) {
        let spring = trail.spring;
        const head = trail.nodes[0];
        head.vx += (pointer.x - head.x) * spring;
        head.vy += (pointer.y - head.y) * spring;

        for (let i = 0; i < trail.nodes.length; i++) {
          const node = trail.nodes[i];
          if (i > 0) {
            const prev = trail.nodes[i - 1];
            node.vx += (prev.x - node.x) * spring;
            node.vy += (prev.y - node.y) * spring;
            node.vx += prev.vx * CONFIG.dampening;
            node.vy += prev.vy * CONFIG.dampening;
          }
          node.vx *= trail.friction;
          node.vy *= trail.friction;
          node.x += node.vx;
          node.y += node.vy;
          spring *= CONFIG.tension;
        }

        // Curvas quadráticas pelos pontos médios deixam a linha contínua.
        ctx.beginPath();
        ctx.moveTo(trail.nodes[0].x, trail.nodes[0].y);
        let i = 1;
        for (; i < trail.nodes.length - 2; i++) {
          const a = trail.nodes[i];
          const b = trail.nodes[i + 1];
          ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
        }
        const a = trail.nodes[i];
        const b = trail.nodes[i + 1];
        ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
        ctx.stroke();
      }

      raf = window.requestAnimationFrame(step);
    };

    const toLocal = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
    };

    const onPointerMove = (e: PointerEvent) => toLocal(e.clientX, e.clientY);

    const start = () => {
      if (running && raf) return;
      running = true;
      raf = window.requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onReducedChange = () => (reduced.matches ? stop() : start());

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onReducedChange);

    // Só anima enquanto o hero estiver na tela.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    raf = window.requestAnimationFrame(step);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onReducedChange);
      trails = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
