"use client";

import { useState } from "react";
import { Monitor, Smartphone, Play } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import plataformaDesktopAsset from "@/assets/plataforma-desktop.mov.asset.json";
import { cn } from "@/lib/utils";

type Tela = "computador" | "celular";

/**
 * Espaço reservado para o vídeo da plataforma. Trocar os arquivos em
 * /public/videos é tudo que precisa ser feito quando a gravação existir.
 */
function Palco({ tela }: { tela: Tela }) {
  const arquivo =
    tela === "computador"
      ? "/videos/plataforma-desktop.mp4"
      : "/videos/plataforma-mobile.mp4";

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-white/10 bg-ink",
        tela === "computador"
          ? "size-full rounded-none border-0"
          : "glass-deep h-full max-h-[34rem] rounded-[2.25rem] p-2 aspect-[9/19]",
      )}
    >
      <div
        className={cn(
          "relative size-full overflow-hidden bg-ink",
          tela === "celular" && "rounded-[1.75rem]",
        )}
      >
        {/* Abaixo do vídeo: some sozinho quando o arquivo existir. */}
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-3">
          <span className="grid size-12 place-items-center rounded-full border border-white/12 bg-white/[0.04]">
            <Play className="size-4 text-stone" strokeWidth={2} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone/70">
            {tela === "computador" ? "Computador" : "Celular"}
          </span>
        </div>

        <video
          key={arquivo}
          className="relative z-10 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        >
          <source src={arquivo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export function Plataforma() {
  const [tela, setTela] = useState<Tela>("computador");

  return (
    <section id="plataforma" className="relative scroll-mt-24 overflow-x-clip">
      <ContainerScroll
        semMoldura={tela === "celular"}
        titleComponent={
          <div className="px-5">
            <span className="glass inline-flex rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
              A plataforma por dentro
            </span>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] text-bone sm:text-[3.3rem]">
              Tudo em <span className="metal-text">uma tela só.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[1.02rem] leading-relaxed text-stone">
              Quanto entrou, quais imóveis estão em produção e o que falta
              entregar.
            </p>

            <div className="mt-7 inline-flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
              {(
                [
                  { id: "computador", rotulo: "Computador", Icone: Monitor },
                  { id: "celular", rotulo: "Celular", Icone: Smartphone },
                ] as const
              ).map(({ id, rotulo, Icone }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTela(id)}
                  aria-pressed={tela === id}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.82rem] transition-all duration-300",
                    tela === id
                      ? "metal-pill font-medium text-[#08090B]"
                      : "text-stone hover:text-bone",
                  )}
                >
                  <Icone className="size-3.5" strokeWidth={2} />
                  {rotulo}
                </button>
              ))}
            </div>
          </div>
        }
      >
        <Palco tela={tela} />
      </ContainerScroll>
    </section>
  );
}
