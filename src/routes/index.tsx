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
  "A plataforma para prestadores de serviços que vendem fotos, vídeos e sites para o mercado imobiliário e de temporada.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
      { name: "twitter:title", content: TITULO },
      { name: "twitter:description", content: DESCRICAO },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative min-h-screen bg-ink font-sans text-bone antialiased selection:bg-chrome selection:text-ink">
      <ScrollSuave />
      <SiteHeader />

      <main>
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
    </div>
  );
}
