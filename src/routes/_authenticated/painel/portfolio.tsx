import { createFileRoute } from "@tanstack/react-router";

import { Link2, Eye } from "lucide-react";
import { RoomScene } from "@/components/marketing/room-scene";
import { GeradorPortfolio } from "@/components/painel/gerador-portfolio";


const TRABALHOS = [
  {
    imovel: "Chalé Vista Serra",
    cidade: "Monte Verde, MG",
    entregue: "Fotos · Vídeo · Site",
    resultado: "Diária de R$ 280 para R$ 410",
  },
  {
    imovel: "Studio Centro",
    cidade: "Gramado, RS",
    entregue: "Fotos · Site",
    resultado: "Diária de R$ 210 para R$ 305",
  },
];

function Portfolio() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Prova</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-4xl">
            Seu portfólio
          </h1>
          <p className="mt-1.5 text-[0.95rem] text-stone">
            Uma página só sua. Mande o link junto com a abordagem.
          </p>
        </div>
      </header>

      <ul className="grid gap-5 lg:grid-cols-2">
        {TRABALHOS.map((t) => (
          <li
            key={t.imovel}
            className="overflow-hidden glass rounded-2xl"
          >
            <div className="grid grid-cols-2 gap-px bg-white/8">
              <div className="relative aspect-[4/3] bg-ink-sunk">
                <RoomScene variant="antes" />
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/80">
                  Antes
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-ink-sunk">
                <RoomScene variant="depois" />
                <span className="absolute bottom-2 left-2 rounded bg-chrome/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#08090B]">
                  Depois
                </span>
              </div>
            </div>

            <div className="p-5">
              <h2 className="font-display text-[1.1rem] font-semibold text-bone">
                {t.imovel}
              </h2>
              <p className="mt-0.5 text-[0.8rem] text-stone">{t.cidade}</p>
              <p className="mt-3 text-[0.82rem] text-stone">{t.entregue}</p>
              <p className="mt-1 text-[0.85rem] font-medium text-jade">
                {t.resultado}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <GeradorPortfolio />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/painel/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfólio · Nexofly" },
      { name: "description", content: "Portfólio na plataforma Nexofly." },
      { property: "og:title", content: "Portfólio · Nexofly" },
      { property: "og:description", content: "Portfólio na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Portfolio,
});
