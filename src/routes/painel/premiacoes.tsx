import { createFileRoute } from "@tanstack/react-router";

import { Trophy, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";


/** Faturamento acumulado do usuário. Zerado até haver dados reais. */
const FATURADO = 0;

const NIVEIS = [
  {
    meta: 5_000,
    titulo: "Primeiros R$ 5 mil",
    premio: "Selo de verificado no seu portfólio",
  },
  {
    meta: 20_000,
    titulo: "R$ 20 mil faturados",
    premio: "Consultoria de 1 hora com a equipe",
  },
  {
    meta: 50_000,
    titulo: "R$ 50 mil faturados",
    premio: "Placa Nexofly enviada para sua casa",
  },
  {
    meta: 100_000,
    titulo: "R$ 100 mil faturados",
    premio: "Destaque na vitrine oficial de prestadores",
  },
];

const proximo = NIVEIS.find((n) => FATURADO < n.meta) ?? NIVEIS[NIVEIS.length - 1];
const progresso = Math.min(100, (FATURADO / proximo.meta) * 100);

function Premiacoes() {
  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Premiações</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-4xl">
          Seu progresso.
        </h1>
        <p className="mt-1.5 text-[0.95rem] text-stone">
          As metas contam o que você faturou usando a plataforma.
        </p>
      </header>

      {/* progresso do nível atual */}
      <section className="glass-deep rim-lit rounded-2xl p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
              Faturado até agora
            </p>
            <p className="metal-text mt-2 font-display text-[2.8rem] font-semibold leading-none tracking-[-0.04em]">
              R$ {FATURADO.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
              Próxima meta
            </p>
            <p className="mt-1.5 text-[1.05rem] font-medium text-bone">
              R$ {proximo.meta.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/50 to-white transition-[width] duration-1000 ease-out"
            style={{ width: `${progresso}%` }}
          />
        </div>

        <p className="mt-3 text-[0.84rem] text-stone">
          {FATURADO === 0
            ? "Feche a primeira entrega para começar a contar."
            : `Faltam R$ ${(proximo.meta - FATURADO).toLocaleString("pt-BR")} para ${proximo.premio.toLowerCase()}.`}
        </p>
      </section>

      {/* trilha de níveis */}
      <ol className="space-y-3">
        {NIVEIS.map((n, i) => {
          const conquistado = FATURADO >= n.meta;
          const atual = n.meta === proximo.meta;
          return (
            <li
              key={n.meta}
              style={{ animationDelay: `${i * 70}ms` }}
              className={cn(
                "flex flex-wrap items-center gap-4 rounded-2xl p-5 motion-safe:animate-rise",
                atual ? "glass-deep" : "glass",
                !conquistado && !atual && "opacity-60",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
                  conquistado
                    ? "bg-jade/16 text-jade"
                    : atual
                      ? "metal-pill text-[#08090B]"
                      : "bg-white/6 text-stone",
                )}
              >
                {conquistado ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : atual ? (
                  <Trophy className="size-4" strokeWidth={2} />
                ) : (
                  <Lock className="size-4" strokeWidth={1.8} />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="text-[0.98rem] font-medium text-bone">
                  {n.titulo}
                </h2>
                <p className="mt-0.5 text-[0.84rem] text-stone">{n.premio}</p>
              </div>

              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[0.74rem] font-medium",
                  conquistado
                    ? "bg-jade/14 text-jade"
                    : atual
                      ? "bg-white/10 text-bone"
                      : "bg-white/6 text-stone",
                )}
              >
                {conquistado ? "Conquistado" : atual ? "Em andamento" : "Bloqueado"}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="text-center text-[0.82rem] text-stone">
        Novas premiações entram nesta lista conforme a plataforma cresce.
      </p>
    </div>
  );
}

export const Route = createFileRoute("/painel/premiacoes")({
  head: () => ({
    meta: [
      { title: "Premiações · Nexofly" },
      { name: "description", content: "Premiações na plataforma Nexofly." },
      { property: "og:title", content: "Premiações · Nexofly" },
      { property: "og:description", content: "Premiações na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Premiacoes,
});
