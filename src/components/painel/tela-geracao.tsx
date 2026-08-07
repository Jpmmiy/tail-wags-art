"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Search, Palette, Plug, Cpu, FileText } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type Etapa = { rotulo: string; icone: typeof Search; linhas: string[] };

const ETAPAS: Etapa[] = [
  {
    rotulo: "Lendo o anúncio",
    icone: Search,
    linhas: [
      "$ nexofly engine — iniciando",
      "→ analisando fotos do anúncio",
      "→ medindo luz, enquadramento e ordem",
      "✓ diagnóstico pronto",
    ],
  },
  {
    rotulo: "Definindo a direção",
    icone: Palette,
    linhas: [
      "→ aplicando clima e público do briefing",
      "→ calculando altura de câmera e lente",
      "✓ direção de arte fechada",
    ],
  },
  {
    rotulo: "Conectando",
    icone: Plug,
    linhas: [
      "→ Nano Banana Pro · imagem",
      "→ Sora · vídeo",
      "→ Lovable · site",
      "✓ 3 conexões ativas",
    ],
  },
  {
    rotulo: "Produzindo",
    icone: Cpu,
    linhas: [
      "→ tratando ambientes selecionados",
      "→ montando o tour de 8 segundos",
      "→ publicando a página do anfitrião",
      "✓ material gerado",
    ],
  },
  {
    rotulo: "Montando a proposta",
    icone: FileText,
    linhas: [
      "→ calculando preço sugerido",
      "→ escrevendo a mensagem de abertura",
      "✓ entrega concluída",
    ],
  },
];

const POR_LINHA = 230;

export function TelaGeracao({ aoTerminar }: { aoTerminar: () => void }) {
  const [etapa, setEtapa] = useState(0);
  const [linha, setLinha] = useState(0);
  const [erro, setErro] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  const terminou = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const total = ETAPAS.reduce((s, e) => s + e.linhas.length, 0);
  const feitas =
    ETAPAS.slice(0, etapa).reduce((s, e) => s + e.linhas.length, 0) + linha;
  const progresso = Math.min(100, (feitas / total) * 100);

  // Safety Timeout: 30 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!terminou.current) {
        setErro(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (terminou.current || erro) return;

    if (etapa >= ETAPAS.length) {
      terminou.current = true;
      const t = setTimeout(aoTerminar, 950);
      return () => clearTimeout(t);
    }

    const atual = ETAPAS[etapa];
    timeoutRef.current = setTimeout(() => {
      if (linha + 1 >= atual.linhas.length) {
        setEtapa((e) => e + 1);
        setLinha(0);
      } else {
        setLinha((l) => l + 1);
      }
    }, POR_LINHA);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [etapa, linha, aoTerminar, erro]);

  useEffect(() => {
    consoleRef.current?.scrollTo({
      top: consoleRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [etapa, linha]);

  const visiveis = ETAPAS.flatMap((e, i) =>
    i < etapa ? e.linhas : i === etapa ? e.linhas.slice(0, linha + 1) : [],
  );

  const concluido = etapa >= ETAPAS.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/88 p-4 backdrop-blur-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_66%)] blur-3xl motion-safe:animate-aurora"
      />

      <div
        role="status"
        aria-live="polite"
        className="glass-deep rim-lit relative w-full max-w-4xl overflow-hidden rounded-[2rem] motion-safe:animate-rise"
      >
        {/* cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-7 py-6">
          <div className="flex items-center gap-4">
            <span className="glass grid size-12 shrink-0 place-items-center rounded-2xl">
              <LogoMark className="size-6" />
            </span>
            <div>
              <p className="font-display text-[1.35rem] font-semibold tracking-[-0.025em] text-bone">
                {erro ? "Ops! Algo deu errado" : concluido ? "Material pronto" : ETAPAS[etapa].rotulo}
              </p>
              <p className="mt-0.5 text-[0.86rem] text-stone">
                {erro ? "A geração demorou mais do que o esperado." : "A Nexofly está montando sua entrega"}
              </p>
            </div>
          </div>

          <span className="metal-text font-display text-[2.4rem] font-semibold leading-none tabular-nums">
            {erro ? "!" : Math.round(progresso)}%
          </span>
        </div>

        {/* trilha das etapas */}
        <div className="border-b border-white/8 px-7 py-5">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
            {ETAPAS.map((e, i) => {
              const feito = i < etapa;
              const ativa = i === etapa;
              const Icone = e.icone;
              return (
                <li key={e.rotulo} className="flex flex-1 items-center gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-xl transition-all duration-500",
                        feito && "bg-jade/16 text-jade",
                        ativa && "metal-pill text-[#08090B]",
                        !feito && !ativa && "bg-white/5 text-stone/50",
                      )}
                    >
                      {feito ? (
                        <Check className="size-3.5" strokeWidth={3} />
                      ) : ativa ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Icone className="size-3.5" strokeWidth={1.9} />
                      )}
                    </span>
                    <span
                      className={cn(
                        "hidden truncate text-[0.8rem] transition-colors duration-300 lg:block",
                        feito && "text-jade",
                        ativa && "text-bone",
                        !feito && !ativa && "text-stone/45",
                      )}
                    >
                      {e.rotulo}
                    </span>
                  </div>

                  {i < ETAPAS.length - 1 && (
                    <span
                      aria-hidden
                      className="h-px flex-1 overflow-hidden rounded-full bg-white/8"
                    >
                      <span
                        className={cn(
                          "block h-full origin-left bg-jade/60 transition-transform duration-700 ease-out",
                          feito ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-white/8">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/45 to-white transition-[width] duration-300 ease-out"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* console */}
        <div className="p-7">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50">
            <div className="flex items-center gap-2.5 border-b border-white/8 px-4 py-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-white/14" />
                <span className="size-2.5 rounded-full bg-white/14" />
                <span className="size-2.5 rounded-full bg-white/14" />
              </span>
              <span className="font-mono text-[10.5px] text-stone">
                nexofly ~ produção
              </span>
              <span className={cn(
                "ml-auto flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em]",
                erro ? "text-red-400" : "text-jade"
              )}>
                <span className={cn("size-1.5 rounded-full", erro ? "bg-red-400" : "bg-jade motion-safe:animate-pulse")} />
                {erro ? "erro" : concluido ? "concluído" : "executando"}
              </span>
            </div>

            <div
              ref={consoleRef}
              className="h-64 overflow-y-auto px-5 py-4 font-mono text-[12px] leading-[1.9]"
            >
              {erro ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-red-400">Tempo limite de geração atingido.</p>
                  <p className="mt-2 text-stone/60">Isso pode acontecer por instabilidade na rede.</p>
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => window.location.reload()}
                      className="rounded-lg bg-white/5 px-4 py-2 text-[11px] font-bold text-bone ring-1 ring-white/10 transition-hover hover:bg-white/10"
                    >
                      Tentar de novo
                    </button>
                    <button 
                      onClick={() => window.location.href = '/painel'}
                      className="px-4 py-2 text-[11px] font-medium text-stone hover:text-bone"
                    >
                      Voltar ao painel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {visiveis.map((l, i) => (
                    <p
                      key={`${l}-${i}`}
                      className={cn(
                        "motion-safe:animate-rise",
                        l.startsWith("✓")
                          ? "text-jade"
                          : l.startsWith("$")
                            ? "text-bone"
                            : "text-stone",
                      )}
                    >
                      {l}
                    </p>
                  ))}
                  {!concluido && (
                    <span className="inline-block h-3.5 w-1.5 translate-y-0.5 bg-bone motion-safe:animate-pulse" />
                  )}
                </>
              )}
            </div>
          </div>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-stone/60">
            {erro ? "operação interrompida" : concluido ? "abrindo sua entrega" : "não feche esta janela"}
          </p>
        </div>
      </div>
    </div>
  );
}
