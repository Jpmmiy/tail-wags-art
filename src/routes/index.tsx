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
import { Logo } from "@/components/brand/logo";

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

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink p-6 text-center">
        <div className="max-w-xl animate-rise space-y-8 rounded-[2.5rem] bg-white/[0.02] p-10 backdrop-blur-md border border-white/10">
          <div className="flex justify-center">
            <Logo markClassName="size-16" className="gap-4 text-3xl" />
          </div>
          
          <div className="space-y-4">
            <h2 className="font-display text-2xl text-bone">Logo para o Checkout</h2>
            <p className="text-stone">Clique no botão abaixo para baixar o arquivo SVG da logo e usar na Appyfy.</p>
          </div>

          <div className="flex justify-center pt-4">
            <a 
              href="/logo-nexofly.svg" 
              download="logo-nexofly.svg"
              className="metal-pill flex h-14 items-center gap-3 px-8 font-bold text-[#08090B]"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Baixar Logo SVG
            </a>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="text-xs text-stone/40 hover:text-stone transition-colors"
          >
            Voltar para o site
          </button>
        </div>
      </div>

      <ScrollSuave />
      <SiteHeader />

      <main id="conteudo" className="pointer-events-none opacity-20 blur-sm">
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