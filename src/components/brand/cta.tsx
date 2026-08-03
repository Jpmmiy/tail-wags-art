"use client";

import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Size = "md" | "lg";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9rem]",
  lg: "h-[3.35rem] px-7 text-[0.97rem]",
};

function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  };

  return { ref, onMove, onLeave };
}

/**
 * Botão fundido em ouro. O ângulo do degradê cônico acompanha o
 * cursor, então a peça parece girar sob a luz em vez de acender.
 */
export function Cta({
  href,
  children,
  size = "md",
  className,
}: {
  href: string;
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  const { ref, onMove, onLeave } = useTilt<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "metal-pill group relative inline-flex shrink-0 items-center justify-center gap-2",
        "overflow-hidden whitespace-nowrap rounded-full font-semibold tracking-[-0.01em] text-[#08090B]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(90,50,10,0.35),0_16px_40px_-14px_rgba(255,255,255,0.30)]",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-2px_6px_rgba(90,50,10,0.3),0_24px_52px_-14px_rgba(255,255,255,0.38)]",
        "active:translate-y-0",
        sizes[size],
        className,
      )}
    >
      {/* poça de luz sob o cursor */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.55), transparent 60%)",
        }}
      />
      {/* varredura de brilho */}
      <span
        aria-hidden
        className="absolute inset-y-0 -left-1/2 w-1/4 bg-white/45 blur-md motion-safe:animate-[sheen_4.5s_ease-in-out_infinite]"
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}

/** Ação secundária: vidro, não metal. Fica atrás na hierarquia. */
export function CtaGhost({
  href,
  children,
  size = "md",
  className,
}: {
  href: string;
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  const { ref, onMove } = useTilt<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={onMove}
      className={cn(
        "glass specular group relative inline-flex shrink-0 items-center justify-center gap-2",
        "whitespace-nowrap rounded-full font-medium text-bone",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-chrome/35",
        sizes[size],
        className,
      )}
    >
      <span className="relative z-[3] inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  );
}
