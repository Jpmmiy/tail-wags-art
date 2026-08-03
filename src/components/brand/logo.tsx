import { cn } from "@/lib/utils";

/**
 * Marca Nexofly: telhado + chevron ascendente.
 * Lê como "imóvel elevado" — a promessa do produto em um glifo.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      {/* chevron de elevação */}
      <path
        d="M11.4 6.6 16 2.4l4.6 4.2"
        stroke="var(--chrome-hi)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />

      {/* telhado */}
      <path
        d="M4.6 17.4 16 8.2l11.4 9.2"
        stroke="var(--chrome-hi)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* paredes */}
      <path
        d="M8.4 15.6v11.2M23.6 15.6v11.2"
        stroke="var(--chrome-mid)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* janela acesa — a luz que a Nexofly acende */}
      <rect
        x="13.7"
        y="19.4"
        width="4.6"
        height="7.4"
        rx="1.3"
        fill="var(--chrome)"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="font-display text-[1.35rem] font-semibold leading-none tracking-[-0.03em] text-bone">
        Nexofly
      </span>
    </span>
  );
}
