"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { RoomScene } from "./room-scene";
import { cn } from "@/lib/utils";

type Imovel = {
  id: string;
  rotulo: string;
  nome: string;
  local: string;
  diaria: number;
  sugerido: number;
  fotos: number;
  /** Deslocamento de cor do "depois", para cada região ter luz própria. */
  tom: string;
};

const IMOVEIS: Imovel[] = [
  {
    id: "chale",
    rotulo: "Chalé na serra",
    nome: "Chalé Vista Serra",
    local: "Monte Verde, MG",
    diaria: 280,
    sugerido: 1560,
    fotos: 12,
    tom: "none",
  },
  {
    id: "loft",
    rotulo: "Loft na praia",
    nome: "Loft Beira-Mar 302",
    local: "Ubatuba, SP",
    diaria: 340,
    sugerido: 1480,
    fotos: 9,
    tom: "hue-rotate(-24deg) saturate(0.85) brightness(1.12)",
  },
  {
    id: "casa",
    rotulo: "Casa de campo",
    nome: "Casa do Lago",
    local: "Capitólio, MG",
    diaria: 620,
    sugerido: 2140,
    fotos: 16,
    tom: "hue-rotate(30deg) saturate(1.1)",
  },
];

type Etapa = { id: string; label: string; saida: (i: Imovel) => string };

const ETAPAS: Etapa[] = [
  { id: "ler", label: "Lendo o anúncio", saida: (i) => `${i.fotos} fotos` },
  { id: "fotos", label: "Tratando as imagens", saida: (i) => `${i.fotos} prontas` },
  { id: "video", label: "Montando o vídeo", saida: () => "8 segundos" },
  { id: "site", label: "Publicando o site", saida: () => "no ar" },
  { id: "oferta", label: "Preparando a proposta", saida: (i) => `R$ ${i.sugerido}` },
];

const DURACAO = 1150;

/**
 * Painel de produção rodando em loop. Mostra o produto trabalhando em
 * vez de descrever o que ele faz. Trocar o imóvel reinicia o ciclo.
 */
export function ProducaoLive() {
  const [imovelIdx, setImovelIdx] = useState(0);
  const [etapa, setEtapa] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [visivel, setVisivel] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  // Sem animação, o painel nasce no estado final em vez de vazio.
  const [reduzido] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const imovel = IMOVEIS[imovelIdx];
  const etapaVisivel = reduzido ? ETAPAS.length : etapa;
  const progressoVisivel = reduzido ? 100 : progresso;
  const concluido = etapaVisivel >= ETAPAS.length;

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
    if (!visivel || reduzido) return;

    // Terminou o ciclo: segura o resultado e passa para o próximo imóvel.
    if (etapa >= ETAPAS.length) {
      const t = setTimeout(() => {
        setImovelIdx((i) => (i + 1) % IMOVEIS.length);
        setEtapa(0);
        setProgresso(0);
      }, 2600);
      return () => clearTimeout(t);
    }

    const inicio = performance.now();
    let raf = 0;
    const tick = (agora: number) => {
      const p = Math.min(1, (agora - inicio) / DURACAO);
      setProgresso(((etapa + p) / ETAPAS.length) * 100);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setEtapa((e) => e + 1);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [etapa, visivel, imovelIdx, reduzido]);

  const trocar = (i: number) => {
    setImovelIdx(i);
    setEtapa(0);
    setProgresso(0);
  };

  return (
    <div ref={raiz} className="w-full">
      {/* seletor */}
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
          Teste um imóvel
        </span>
        {IMOVEIS.map((im, i) => (
          <button
            key={im.id}
            type="button"
            onClick={() => trocar(i)}
            aria-pressed={i === imovelIdx}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[0.8rem] transition-all duration-300",
              i === imovelIdx
                ? "metal-pill font-medium text-[#08090B]"
                : "glass text-stone hover:text-bone",
            )}
          >
            {im.rotulo}
          </button>
        ))}
      </div>

      <div className="glass-deep rim-lit overflow-hidden rounded-[1.5rem]">
        {/* barra do navegador */}
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-white/14" />
            <span className="size-2.5 rounded-full bg-white/14" />
            <span className="size-2.5 rounded-full bg-white/14" />
          </span>
          <span className="rounded-md bg-black/30 px-3 py-1 font-mono text-[10.5px] text-stone">
            nexofly.app/producao
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
            ao vivo
          </span>
        </div>

        <div className="space-y-3.5 p-4 sm:p-5">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-stone">
              Imóvel selecionado
            </p>
            <p className="mt-1 font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-bone">
              {imovel.nome}
            </p>
            <p className="mt-0.5 text-[0.78rem] text-stone">
              {imovel.local} · diária de R$ {imovel.diaria}
            </p>
          </div>

          {/* O antes/depois é revelado pelo próprio progresso da produção. */}
          <figure className="overflow-hidden rounded-xl border border-white/10">
            <div className="relative aspect-[21/6]">
              <div className="absolute inset-0">
                <RoomScene variant="antes" />
              </div>
              <div
                className="absolute inset-0 transition-[clip-path] duration-300 ease-out"
                style={{
                  clipPath: `inset(0 ${100 - progressoVisivel}% 0 0)`,
                  filter: imovel.tom,
                }}
              >
                <RoomScene variant="depois" />
              </div>

              {progressoVisivel > 2 && progressoVisivel < 99 && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 w-px bg-white/90 shadow-[0_0_18px_3px_rgba(255,255,255,0.5)]"
                  style={{ left: `${progressoVisivel}%` }}
                />
              )}

              <span className="absolute left-2.5 top-2.5 rounded-md bg-black/60 px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                Foto do anfitrião
              </span>
              <span
                className={cn(
                  "absolute right-2.5 top-2.5 rounded-md bg-white/90 px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#08090B] transition-opacity duration-500",
                  progressoVisivel > 30 ? "opacity-100" : "opacity-0",
                )}
              >
                Nexofly
              </span>
            </div>
          </figure>

          <div>
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-stone">
                {concluido ? "Entrega concluída" : "Produzindo"}
              </p>
              <span className="font-mono text-[10.5px] tabular-nums text-stone">
                {Math.round(progressoVisivel)}%
              </span>
            </div>

            <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-white/8">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/60 to-white"
                style={{ width: `${progressoVisivel}%` }}
              />
            </div>

            <ul className="mt-2.5 space-y-1.5">
              {ETAPAS.map((e, i) => {
                const feito = i < etapaVisivel;
                const ativa = i === etapaVisivel;
                return (
                  <li key={e.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-300",
                        feito && "bg-emerald-400/18",
                        ativa && "bg-white/12",
                        !feito && !ativa && "bg-white/5",
                      )}
                    >
                      {feito ? (
                        <Check
                          className="size-3 text-emerald-400"
                          strokeWidth={3.2}
                        />
                      ) : ativa ? (
                        <Loader2 className="size-3 animate-spin text-bone" />
                      ) : (
                        <span className="size-1 rounded-full bg-white/25" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[0.85rem] transition-colors duration-300",
                        feito || ativa ? "text-bone" : "text-stone/55",
                      )}
                    >
                      {e.label}
                    </span>
                    <span
                      className={cn(
                        "ml-auto font-mono text-[10.5px] tabular-nums transition-opacity duration-300",
                        feito ? "text-emerald-400 opacity-100" : "opacity-0",
                      )}
                    >
                      {e.saida(imovel)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Uma linha só: o painel precisa caber na primeira dobra. */}
          <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-white/8 pt-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-stone">
            <div className="flex items-baseline gap-1.5">
              <dt>Entrega</dt>
              <dd className="font-sans text-[0.8rem] font-semibold normal-case tracking-normal text-bone">
                4 itens
              </dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>Tempo</dt>
              <dd className="font-sans text-[0.8rem] font-semibold normal-case tracking-normal text-bone">
                6 min
              </dd>
            </div>
            <div className="ml-auto flex items-baseline gap-1.5">
              <dt>Sugerido</dt>
              <dd
                className={cn(
                  "font-sans text-[0.95rem] font-semibold normal-case tracking-normal transition-colors duration-500",
                  concluido ? "text-emerald-400" : "text-stone/50",
                )}
              >
                R$ {imovel.sugerido}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
