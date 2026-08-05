import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/marketing/site-header";
import { ScrollSuave } from "@/components/liquid/scroll-suave";
import { Hero } from "@/components/marketing/hero";
import { Ferramentas } from "@/components/marketing/ferramentas";
import { Numeros } from "@/components/marketing/numeros";
import { Plataforma } from "@/components/marketing/plataforma";
import { Teia } from "@/components/marketing/teia";
import { Galeria } from "@/components/marketing/galeria";
import { Fluxo } from "@/components/marketing/fluxo";
import { Planos } from "@/components/marketing/planos";
import { Duvidas } from "@/components/marketing/duvidas";
import { ChamadaFinal, Rodape } from "@/components/marketing/rodape";

const TITULO = "Nexofly · Fotos, vídeo e site para anúncios de temporada";
const DESCRICAO =
  "A Nexofly organiza todo o trabalho de valorizar um anúncio de temporada. Escolha o imóvel e receba fotos, vídeo, site e abordagem prontos para entregar ao anfitrião.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-chrome focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#08090B]"
      >
        Pular para o conteúdo
      </a>

      <ScrollSuave />
      <SiteHeader />

      <main id="conteudo">
        <Hero />
        <Ferramentas />
        <Numeros />
        <Plataforma />
        <Teia />
        <Galeria />
        <Fluxo />
        <Planos />
        <Duvidas />
        <ChamadaFinal />
      </main>

      <Rodape />
    </>
  );
}
