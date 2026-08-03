"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const W = 600;
const H = 500;
const CX = 300;
const CY = 250;

type No = {
  id: string;
  rotulo: string;
  desc: string;
  x: number;
  y: number;
  anel: "interno" | "externo";
};

const NOS: No[] = [
  {
    id: "busca",
    rotulo: "Busca de imóveis",
    desc: "Anúncios de temporada por cidade e bairro, com o contato do anfitrião.",
    x: 108,
    y: 126,
    anel: "externo",
  },
  {
    id: "diagnostico",
    rotulo: "Diagnóstico",
    desc: "O que está segurando as reservas daquele anúncio, item por item.",
    x: 66,
    y: 296,
    anel: "externo",
  },
  {
    id: "imagem",
    rotulo: "Tratamento de imagem",
    desc: "As fotos do imóvel refeitas com luz, arrumação e enquadramento corretos.",
    x: 208,
    y: 428,
    anel: "externo",
  },
  {
    id: "video",
    rotulo: "Vídeo do imóvel",
    desc: "Um tour curto, pronto para o anúncio e para as redes do anfitrião.",
    x: 392,
    y: 434,
    anel: "externo",
  },
  {
    id: "site",
    rotulo: "Site do anfitrião",
    desc: "Página própria com reserva direta no WhatsApp, publicada pela plataforma.",
    x: 524,
    y: 312,
    anel: "externo",
  },
  {
    id: "preco",
    rotulo: "Precificação",
    desc: "Quanto cobrar por aquele imóvel, com base no tipo, na diária e no pacote.",
    x: 506,
    y: 138,
    anel: "externo",
  },
  {
    id: "proposta",
    rotulo: "Proposta",
    desc: "A mensagem que abre a conversa com o anfitrião, no tom certo.",
    x: 330,
    y: 56,
    anel: "externo",
  },
  {
    id: "portfolio",
    rotulo: "Portfólio",
    desc: "Seus trabalhos entregues viram uma página que apresenta você.",
    x: 196,
    y: 234,
    anel: "interno",
  },
  {
    id: "mentor",
    rotulo: "Mentor",
    desc: "Dúvida de preço, objeção ou negociação respondida a qualquer hora.",
    x: 404,
    y: 262,
    anel: "interno",
  },
];

/** Ligações extras entre nós, para a malha não virar só um sol. */
const PONTES: [string, string][] = [
  ["busca", "diagnostico"],
  ["diagnostico", "imagem"],
  ["imagem", "video"],
  ["video", "site"],
  ["site", "preco"],
  ["preco", "proposta"],
  ["portfolio", "imagem"],
  ["mentor", "proposta"],
  ["mentor", "preco"],
];

const porId = (id: string) => NOS.find((n) => n.id === id)!;
const CICLO = 2600;

export function Teia() {
  const [ativo, setAtivo] = useState<string>("imagem");
  const [pausado, setPausado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (pausado || !visivel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => {
      const i = NOS.findIndex((n) => n.id === ativo);
      setAtivo(NOS[(i + 1) % NOS.length].id);
    }, CICLO);
    return () => clearTimeout(t);
  }, [ativo, pausado, visivel]);

  const noAtivo = porId(ativo);

  return (
    <section id="capacidades" className="relative scroll-mt-24 overflow-x-clip py-24 lg:py-28">
      <div className="mx-auto max-w-[82rem] px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="glass inline-flex rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
            Recursos
          </span>
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] text-bone sm:text-[3.3rem]">
            Uma agência inteira{" "}
            <span className="metal-text">rodando na sua mão.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed text-stone">
            Tudo que uma entrega precisa, conectado dentro da mesma plataforma.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div
            ref={raiz}
            onMouseLeave={() => setPausado(false)}
            className="relative mx-auto mt-8 w-full max-w-2xl"
            style={{ aspectRatio: `${W} / ${H}` }}
          >
            {/* ligações */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="absolute inset-0 size-full"
              aria-hidden
              fill="none"
            >
              <defs>
                <radialGradient id="teia-halo" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={CX} cy={CY} r={200} fill="url(#teia-halo)" />

              {NOS.map((n, i) => {
                const on = n.id === ativo;
                const dist = Math.hypot(n.x - CX, n.y - CY);
                return (
                  <g key={`c-${n.id}`}>
                    <line
                      x1={CX}
                      y1={CY}
                      x2={n.x}
                      y2={n.y}
                      stroke="currentColor"
                      strokeWidth={on ? 1.6 : 1}
                      strokeDasharray={dist}
                      strokeDashoffset={visivel ? 0 : dist}
                      style={{ transitionDelay: `${i * 70}ms` }}
                      className={cn(
                        "transition-all duration-1000 ease-out",
                        on ? "text-white/60" : "text-white/10",
                      )}
                    />
                    {/* pulso viajando pela ligação ativa */}
                    {on && (
                      <circle r="2.6" fill="currentColor" className="text-white">
                        <animateMotion
                          dur="1.5s"
                          repeatCount="indefinite"
                          path={`M${CX} ${CY} L${n.x} ${n.y}`}
                        />
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {PONTES.map(([a, b]) => {
                const na = porId(a);
                const nb = porId(b);
                const on = ativo === a || ativo === b;
                return (
                  <line
                    key={`p-${a}-${b}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                    className={cn(
                      "transition-all duration-700",
                      on ? "text-white/32" : "text-white/7",
                    )}
                  />
                );
              })}
            </svg>

            {/* núcleo */}
            <div
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(CX / W) * 100}%`, top: `${(CY / H) * 100}%` }}
            >
              <div className="glass-deep rim-lit flex size-[4.6rem] flex-col items-center justify-center gap-1 rounded-full sm:size-[5.6rem]">
                <LogoMark className="size-5 sm:size-6" />
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-stone">
                  Nexofly
                </span>
              </div>
            </div>

            {/* nós */}
            {NOS.map((n, i) => {
              const on = n.id === ativo;
              return (
                <button
                  key={n.id}
                  type="button"
                  onMouseEnter={() => {
                    setAtivo(n.id);
                    setPausado(true);
                  }}
                  onFocus={() => {
                    setAtivo(n.id);
                    setPausado(true);
                  }}
                  onClick={() => {
                    setAtivo(n.id);
                    setPausado(true);
                  }}
                  aria-pressed={on}
                  className={cn(
                    "absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[0.68rem] transition-all duration-500 sm:px-3.5 sm:py-2 sm:text-[0.8rem]",
                    "motion-safe:animate-float",
                    on
                      ? "glass-deep scale-110 font-medium text-bone shadow-[0_0_24px_-4px_rgba(255,255,255,0.35)]"
                      : "glass text-stone hover:text-bone",
                  )}
                  style={{
                    left: `${(n.x / W) * 100}%`,
                    top: `${(n.y / H) * 100}%`,
                    animationDelay: `${-i * 1.4}s`,
                    animationDuration: `${9 + (i % 4)}s`,
                  }}
                >
                  {n.rotulo}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* descrição do nó ativo */}
        <Reveal delay={200}>
          <p
            key={ativo}
            className="mx-auto mt-4 max-w-md text-center text-[0.98rem] leading-relaxed text-stone motion-safe:animate-rise"
          >
            <span className="text-bone">{noAtivo.rotulo}.</span>{" "}
            {noAtivo.desc}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
