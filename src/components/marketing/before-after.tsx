"use client";

import { useId, useState } from "react";
import { RoomScene } from "./room-scene";
import { cn } from "@/lib/utils";

/**
 * Assinatura da marca: arraste e veja o mesmo quarto virar produto.
 * Usa <input type="range"> por baixo — teclado, toque e leitor de tela
 * funcionam sem código extra.
 */
export function BeforeAfter({ className }: { className?: string }) {
  const [pos, setPos] = useState(52);
  const id = useId();

  return (
    <figure className={cn("group/ba relative", className)}>
      <div className="edge-lit grain relative aspect-[9/7] w-full overflow-hidden rounded-2xl bg-ink-sunk shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] sm:aspect-[10/7]">
        {/* depois (fundo) */}
        <div className="absolute inset-0">
          <RoomScene variant="depois" />
        </div>

        {/* antes (recortado pela posição) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <RoomScene variant="antes" />
        </div>

        {/* etiquetas */}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm transition-opacity sm:text-[10px] sm:tracking-[0.16em]",
            pos < 22 && "opacity-0",
          )}
        >
          Foto do anfitrião
        </span>
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full bg-chrome/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#08090B] backdrop-blur-sm transition-opacity sm:text-[10px] sm:tracking-[0.16em]",
            pos > 78 && "opacity-0",
          )}
        >
          Entregue pela Nexofly
        </span>

        {/* linha divisória + alça */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-chrome/90 shadow-[0_0_22px_4px_rgba(255,255,255,0.22)]"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-chrome/70 bg-ink/85 backdrop-blur-md transition-transform duration-200 group-hover/ba:scale-110">
            <svg viewBox="0 0 24 24" className="size-4 text-chrome" fill="none">
              <path
                d="M9.5 7 5 12l4.5 5M14.5 7l4.5 5-4.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <label htmlFor={id} className="sr-only">
          Comparar foto original e foto tratada pela Nexofly
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${Math.round(pos)}% da foto original visível`}
          className="absolute inset-0 z-20 size-full cursor-ew-resize opacity-0"
        />
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-stone">
          Mesmo imóvel. Mesma diária.{" "}
          <span className="text-bone">Outro anúncio.</span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone/70">
          Arraste para comparar
        </span>
      </figcaption>
    </figure>
  );
}
