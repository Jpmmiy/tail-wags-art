import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/marketing/site-header";
import { ScrollSuave } from "@/components/liquid/scroll-suave";
import { Hero } from "@/components/marketing/hero";
import { Planos } from "@/components/marketing/planos";
import { Duvidas } from "@/components/marketing/duvidas";
import { Rodape } from "@/components/marketing/rodape";
import { Reveal } from "@/components/reveal";
import { Check, ImageIcon, Clapperboard, LayoutTemplate, MessageSquare, ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

function ComoFunciona() {
  const passos = [
    { num: "01", icon: MapPin, text: "Escolha um imóvel real da sua cidade" },
    { num: "02", icon: Check, text: "Confirme o diagnóstico e o briefing" },
    { num: "03", icon: Clapperboard, text: "Receba o plano de produção e os materiais" },
  ];

  return (
    <section id="processo" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-[76rem] px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">Simples assim</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-bone sm:text-5xl">Como funciona</h2>
        </Reveal>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {passos.map((p) => (
            <Reveal key={p.num} className="glass flex flex-col items-center rounded-3xl p-8 text-center">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-chrome/10 text-chrome">
                <p.icon className="size-6" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-stone">{p.num}</p>
              <p className="mt-4 text-lg font-medium text-bone">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Entregaveis() {
  const itens = [
    { icon: Clapperboard, title: "Vídeo curto", desc: "Roteiros e prompts otimizados para o Google Flow." },
    { icon: ImageIcon, title: "Fotos tratadas", desc: "Curadoria e tratamento para destacar o melhor do imóvel." },
    { icon: LayoutTemplate, title: "Site de reserva", desc: "Página de alta conversão com botão direto para WhatsApp." },
    { icon: MessageSquare, title: "Proposta", desc: "Argumentos baseados em dados reais para fechar a venda." },
  ];

  return (
    <section id="plataforma" className="scroll-mt-24 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-[76rem] px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">Entregáveis</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-bone sm:text-5xl">O que seu cliente recebe</h2>
        </Reveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {itens.map((i) => (
            <Reveal key={i.title} className="glass flex flex-col rounded-3xl p-8 transition-all hover:rim-lit">
              <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-white/5 text-bone">
                <i.icon className="size-5" />
              </div>
              <h3 className="text-xl font-semibold text-bone">{i.title}</h3>
              <p className="mt-3 text-stone">{i.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProvaSocial() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[76rem] px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">Sucesso</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-bone sm:text-5xl">Quem já usa a Nexofly</h2>
        </Reveal>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <Reveal className="glass flex flex-col rounded-3xl p-8 italic text-stone">
            <p className="text-lg">"Placeholder para depoimento de usuário 1. Relato sobre como a plataforma ajudou a fechar novos clientes."</p>
            <div className="mt-6 flex items-center gap-4 not-italic">
              <div className="size-12 rounded-full bg-white/10" />
              <div>
                <p className="font-bold text-bone">Nome do Usuário</p>
                <p className="text-sm">Cargo / Região</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100} className="glass flex flex-col rounded-3xl p-8 italic text-stone">
            <p className="text-lg">"Placeholder para depoimento de usuário 2. Relato sobre a facilidade de gerar os materiais e a qualidade dos prompts."</p>
            <div className="mt-6 flex items-center gap-4 not-italic">
              <div className="size-12 rounded-full bg-white/10" />
              <div>
                <p className="font-bold text-bone">Nome do Usuário</p>
                <p className="text-sm">Cargo / Região</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CtaFinal() {
  const [cidade, setCidade] = useState("");

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cidade) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info("Suba para o topo para ver os resultados!");
  };

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <Reveal className="glass-deep rounded-[2.5rem] p-10 text-center sm:p-20">
          <h2 className="font-display text-3xl font-semibold text-bone sm:text-5xl">Comece pela sua cidade</h2>
          <p className="mt-6 text-lg text-stone">Digite o nome da sua cidade abaixo para encontrar as melhores oportunidades de prospecção hoje.</p>
          
          <form onSubmit={handleBuscar} className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
            <input 
              type="text" 
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Digite sua cidade"
              className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 text-bone outline-none focus:border-chrome/50"
            />
            <button type="submit" className="metal-pill flex h-14 items-center justify-center gap-2 rounded-2xl px-8 font-bold text-black">
              Buscar <ArrowRight className="size-4" />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <ScrollSuave />
      <SiteHeader />

      <main id="conteudo">
        <Hero />
        <ComoFunciona />
        <Entregaveis />
        <ProvaSocial />
        <Planos />
        <Duvidas />
        <CtaFinal />
      </main>

      <Rodape />
    </>
  );
}
