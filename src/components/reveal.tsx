"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Revela o conteúdo quando entra na viewport.
 * Respeita prefers-reduced-motion via CSS (globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "shown");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Agrupa filhos com atraso incremental — sequência orquestrada. */
export function RevealGroup({
  children,
  step = 90,
  start = 0,
  className,
}: {
  children: React.ReactNode;
  step?: number;
  start?: number;
  className?: string;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className={cn(className)}>
      {items.map((child, i) => (
        <Reveal key={i} delay={start + i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
