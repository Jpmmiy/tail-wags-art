import { cn } from "@/lib/utils";

/**
 * Atmosfera do fundo: três massas de luz dourada que se movem em
 * ritmos diferentes. Nunca formam o mesmo desenho duas vezes.
 */
export function LiquidBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -left-[18%] top-[-22%] size-[46rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.13),transparent_66%)] blur-3xl motion-safe:animate-aurora" />
      <div className="absolute -right-[14%] top-[6%] size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(214,222,232,0.12),transparent_64%)] blur-3xl motion-safe:animate-aurora [animation-delay:-7s]" />
      <div className="absolute bottom-[-26%] left-[26%] size-[42rem] rounded-full bg-[radial-gradient(circle,rgba(150,165,190,0.13),transparent_66%)] blur-3xl motion-safe:animate-aurora [animation-delay:-14s]" />
    </div>
  );
}

/**
 * Gota de metal fundido. A silhueta se deforma devagar enquanto o
 * degradê cônico gira por baixo, então a luz escorre pela superfície.
 */
export function MetalBlob({
  className,
  speed = 18,
}: {
  className?: string;
  speed?: number;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      <div
        className="metal-surface size-full opacity-90 blur-[1px] motion-safe:animate-morph motion-safe:[animation:morph_var(--dur)_ease-in-out_infinite,metal-spin_14s_linear_infinite]"
        style={{ "--dur": `${speed}s` } as React.CSSProperties}
      />
    </div>
  );
}
