"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Palette, Rocket, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

type Passo = {
  n: string;
  icone: typeof Search;
  titulo: string;
  texto: string;
  tela: { rotulo: string; linhas: { nome: string; meta: string }[] };
  saidas: string[];
};

const PASSOS: Passo[] = [
  {
    n: "01",
    icone: Search,
    titulo: "Escolha o imóvel",
    texto:
      "Busque pela cidade. A Nexofly lê o anúncio e aponta o que está segurando as reservas.",
    tela: {
      rotulo: "Imóveis em Monte Verde",
      linhas: [
        { nome: "Chalé Vista Serra", meta: "R$ 280 · 6 fotos" },
        { nome: "Pousada do Vale", meta: "R$ 190 · 4 fotos" },
        { nome: "Casa da Montanha", meta: "R$ 410 · 11 fotos" },
      ],
    },
    saidas: ["Diagnóstico do anúncio", "Contato do anfitrião"],
  },
  {
    n: "02",
    icone: Palette,
    titulo: "Defina a direção",
    texto:
      "Clima, público e ambientes. A parte técnica fica com a plataforma.",
    tela: {
      rotulo: "Direção da entrega",
      linhas: [
        { nome: "Clima", meta: "Aconchegante" },
        { nome: "Público", meta: "Casais" },
        { nome: "Ambientes", meta: "Quarto, sala, vista" },
      ],
    },
    saidas: ["Direção de arte", "Padrão de luz"],
  },
  {
    n: "03",
    icone: Rocket,
    titulo: "Receba o material",
    texto:
      "A Nexofly produz nas ferramentas conectadas e devolve tudo pronto para entregar.",
    tela: {
      rotulo: "Entrega do Chalé Vista Serra",
      linhas: [
        { nome: "Fotos tratadas", meta: "12 imagens" },
        { nome: "Vídeo do imóvel", meta: "8 segundos" },
        { nome: "Site do anfitrião", meta: "no ar" },
      ],
    },
    saidas: ["Fotos", "Vídeo", "Site", "Proposta"],
  },
];

const MENU = [
  "Painel",
  "Imóveis",
  "Nova entrega",
  "Projetos",
  "Mentor",
  "Portfólio",
];

const CICLO = 5200;

/** Depois de escolher um passo na mão, o ciclo volta sozinho. */
const RETOMADA = 9000;

export function Fluxo() {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const retomar = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    // threshold 0: a seção é mais alta que a janela em telas menores e
    // um limiar alto nunca dispararia.
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (pausado || !visivel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setAtivo((a) => (a + 1) % PASSOS.length), CICLO);
    return () => clearTimeout(t);
  }, [ativo, pausado, visivel]);

  useEffect(
    () => () => {
      if (retomar.current) clearTimeout(retomar.current);
    },
    [],
  );

  /** Fixa o passo escolhido e agenda a volta do ciclo automático. */
  const escolher = (i: number) => {
    setAtivo(i);
    setPausado(true);
    if (retomar.current) clearTimeout(retomar.current);
    retomar.current = setTimeout(() => setPausado(false), RETOMADA);
  };

  const passo = PASSOS[ativo];

  return (
    <section
      id="processo"
      className="relative scroll-mt-24 overflow-x-clip py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[82rem] px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="glass inline-flex rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
            Como funciona
          </span>
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] text-bone sm:text-[3.3rem]">
            Três passos.{" "}
            <span className="metal-text">Resultado de estúdio.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed text-stone">
            Do imóvel à entrega em minutos.
          </p>
        </Reveal>

        <div
          ref={raiz}
          className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-6"
        >
          {/* janela da plataforma */}
          <Reveal>
            <div className="glass-deep overflow-hidden rounded-[1.4rem]">
              <div className="flex items-center gap-2.5 border-b border-white/8 px-4 py-3">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-white/14" />
                  <span className="size-2.5 rounded-full bg-white/14" />
                  <span className="size-2.5 rounded-full bg-white/14" />
                </span>
                <span className="font-mono text-[10.5px] text-stone">
                  Nexofly
                </span>
              </div>

              <div className="flex min-h-[19rem]">
                <aside className="hidden w-36 shrink-0 border-r border-white/8 p-3 sm:block">
                  <ul className="space-y-0.5">
                    {MENU.map((m, i) => (
                      <li
                        key={m}
                        className={cn(
                          "rounded-lg px-2.5 py-2 text-[11px] transition-colors duration-500",
                          i === ativo + 1
                            ? "metal-pill font-semibold text-[#08090B]"
                            : "text-stone",
                        )}
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </aside>

                <div className="min-w-0 flex-1 p-4 sm:p-5">
                  <p
                    key={`${passo.n}-rotulo`}
                    className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-stone motion-safe:animate-rise"
                  >
                    {passo.tela.rotulo}
                  </p>

                  <ul className="mt-3 space-y-2">
                    {passo.tela.linhas.map((l, i) => (
                      <li
                        key={`${passo.n}-${l.nome}`}
                        style={{ animationDelay: `${i * 80}ms` }}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-3 motion-safe:animate-rise"
                      >
                        <span className="truncate text-[0.84rem] text-bone">
                          {l.nome}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-stone">
                          {l.meta}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {passo.saidas.map((s) => (
                      <span
                        key={`${passo.n}-${s}`}
                        className="flex items-center gap-1.5 rounded-md bg-emerald-400/12 px-2 py-1 text-[0.7rem] text-emerald-400"
                      >
                        <Check className="size-2.5" strokeWidth={3} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Nó de conexão. As curvas saem da borda do rótulo, não do
              centro, para nenhuma linha cruzar por cima do texto. */}
          <div className="relative hidden lg:block lg:h-72 lg:w-36">
            <svg
              viewBox="0 0 144 288"
              className="absolute inset-0 size-full"
              aria-hidden
              fill="none"
            >
              {[60, 144, 228].map((y, i) => (
                <path
                  key={y}
                  d={`M112 144 C 128 144, 128 ${y}, 144 ${y}`}
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className={cn(
                    "transition-all duration-700",
                    i === ativo ? "text-white/60" : "text-white/12",
                  )}
                />
              ))}
              <path
                d="M0 144 H 32"
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-white/25"
              />
            </svg>

            <span className="glass absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-3.5 py-2">
              <span className="size-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              <span className="whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.14em] text-bone">
                Conexões
              </span>
            </span>
          </div>

          {/* cartões dos passos */}
          <Reveal delay={100}>
            <ol className="space-y-3">
              {PASSOS.map((p, i) => {
                const on = i === ativo;
                const Icone = p.icone;
                return (
                  <li key={p.n}>
                    <button
                      type="button"
                      onClick={() => escolher(i)}
                      onMouseEnter={() => escolher(i)}
                      aria-current={on ? "step" : undefined}
                      className={cn(
                        "w-full rounded-2xl p-5 text-left transition-all duration-500 sm:p-6",
                        on
                          ? "glass-deep rim-lit"
                          : "glass opacity-60 hover:opacity-100",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-xl transition-all duration-500",
                            on
                              ? "metal-pill text-[#08090B]"
                              : "bg-white/6 text-stone",
                          )}
                        >
                          <Icone className="size-4" strokeWidth={2} />
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
                          Passo {p.n}
                        </span>
                      </div>

                      <h3
                        className={cn(
                          "mt-4 font-display text-[1.3rem] font-semibold leading-tight transition-colors",
                          on ? "text-bone" : "text-bone/70",
                        )}
                      >
                        {p.titulo}
                      </h3>

                      <div
                        className={cn(
                          "grid transition-all duration-500",
                          on
                            ? "mt-2 grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <p className="overflow-hidden text-[0.92rem] leading-relaxed text-stone">
                          {p.texto}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
