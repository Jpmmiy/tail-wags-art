"use client";

import { useEffect, useRef } from "react";

/**
 * Escreve a posição do cursor em --mx/--my no elemento.
 * As superfícies de vidro usam essas variáveis para posicionar o
 * reflexo especular, então a luz parece bater de onde a pessoa olha.
 */
export function usePointerLight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    const mover = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };

    el.addEventListener("pointermove", mover);
    return () => {
      el.removeEventListener("pointermove", mover);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

/** Envolve um bloco e faz o brilho seguir o cursor dentro dele. */
export function PointerLight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = usePointerLight<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
