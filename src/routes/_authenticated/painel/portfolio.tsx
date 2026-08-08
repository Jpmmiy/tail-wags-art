import { createFileRoute } from "@tanstack/react-router";
import { GeradorPortfolio } from "@/components/painel/gerador-portfolio";

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