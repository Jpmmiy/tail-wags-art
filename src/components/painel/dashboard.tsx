"use client";

import { useId, useState, useEffect } from "react";
import { Link } from "@/components/ui/link";
import {
  Wand2,
  Clock3,
  CircleCheck,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  Image as ImageIcon,
  Clapperboard,
  LayoutTemplate,
  MessageSquare,
  Plus,
  ArrowRight,
  Play,
  Flame,
} from "lucide-react";
import { useDemo, mesCorrente, ZERADO, type Painel } from "@/lib/demo";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listProjects, setCurrentProjectId } from "@/lib/persistence";
import { supabase } from "@/integrations/supabase/client";


const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const TIPOS = [
  { id: "fotos", rotulo: "Fotos tratadas", icone: ImageIcon },
  { id: "video", rotulo: "Materiais", icone: Clapperboard },
  { id: "site", rotulo: "Sites", icone: LayoutTemplate },
  { id: "abordagem", rotulo: "Propostas", icone: MessageSquare },

] as const;

const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

/* ------------------------------------------------------------- faturamento */

const MESES_LONGOS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function Faturamento({ d }: { d: Painel }) {
  // Comparação real entre o mês corrente e o anterior, tirada do fluxo.
  const m = mesCorrente();
  const atual = d.fluxo[m] ?? 0;
  const anterior = m > 0 ? (d.fluxo[m - 1] ?? 0) : 0;
  const variacao =
    anterior > 0 && atual > 0 ? ((atual - anterior) / anterior) * 100 : null;

  const apoio = [
    {
      icone: Clock3,
      rotulo: "Aguardando pagamento",
      valor: brl(d.aguardando),
      nota: d.propostasAbertas
        ? `${d.propostasAbertas} proposta${d.propostasAbertas > 1 ? "s" : ""} em aberto`
        : "Nenhuma proposta aberta",
    },
    {
      icone: CircleCheck,
      rotulo: "Entregas concluídas",
      valor: String(d.entregas),
      nota: d.entregas ? "No mês corrente" : "Comece pela primeira",
    },
    {
      icone: Wallet,
      rotulo: "Ticket médio",
      valor: d.ticket ? brl(d.ticket) : "—",
      nota: d.ticket ? "Por pacote fechado" : "Sem vendas ainda",
    },
  ];

  return (
    <section className="glass-deep rim-lit relative overflow-hidden rounded-3xl">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_130%_at_10%_0%,rgba(255,255,255,0.1),transparent_60%)]"
      />

      <div className="relative grid items-center lg:grid-cols-[1fr_auto]">
        <div className="p-7 sm:p-9">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
            Faturado no mês
          </p>

          <p className="metal-text mt-3 font-display text-[3.4rem] font-semibold leading-[0.95] tabular-nums sm:text-[4.4rem]">
            {brl(d.faturado)}
          </p>

          {variacao !== null && (
            <p className="mt-4 inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-white/[0.05] px-3 py-1.5 text-[0.82rem] text-stone">
              {variacao >= 0 ? (
                <TrendingUp className="size-3.5 shrink-0 text-jade" strokeWidth={2} />
              ) : (
                <TrendingDown className="size-3.5 shrink-0 text-stone" strokeWidth={2} />
              )}
              <span className="font-medium text-bone">
                {variacao >= 0 ? "+" : ""}
                {Math.round(variacao)}%
              </span>
              em relação a {MESES_LONGOS[m - 1]}
            </p>
          )}
        </div>

        <div className="grid border-t border-white/8 sm:grid-cols-3 lg:border-l lg:border-t-0">
          {apoio.map((a, i) => {
            const Icone = a.icone;
            return (
              <div
                key={a.rotulo}
                className={cn(
                  "min-w-0 px-6 py-6 sm:px-7",
                  i > 0 && "border-t border-white/8 sm:border-l sm:border-t-0",
                )}
              >
                <p className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-stone">
                  <Icone className="size-3.5 shrink-0 text-stone/60" strokeWidth={1.8} />
                  {a.rotulo}
                </p>
                <p className="mt-3 font-display text-[1.5rem] font-semibold leading-none tabular-nums text-bone">
                  {a.valor}
                </p>
                <p className="mt-1.5 text-[0.76rem] text-stone/60">{a.nota}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ fluxo */

/** Teto redondo logo acima do maior valor, para a curva respirar. */
function teto(n: number) {
  if (n <= 0) return 1000;
  const magnitude = 10 ** Math.floor(Math.log10(n));
  const passo = magnitude / 4;
  return Math.ceil(n / passo) * passo;
}

const DIVISOES = 4;

const SERIES = [
  { id: "fluxo", rotulo: "Recebido", forte: true },
  { id: "aberto", rotulo: "Em aberto", forte: false },
] as const;

function Fluxo({ d }: { d: Painel }) {
  const id = useId();
  const L = 100;
  const A = 200;

  const mesAtual = mesCorrente();
  // As curvas param no mês corrente: dezembro não fatura em agosto.
  const recebido = d.fluxo.slice(0, mesAtual + 1);
  const emAberto = d.aberto.slice(0, mesAtual + 1);
  const vazio = [...recebido, ...emAberto].every((v) => v === 0);
  const alto = teto(Math.max(...recebido, ...emAberto, 0));
  // O eixo termina no mês corrente. Mês que não chegou não entra no gráfico,
  // nem como rótulo apagado — a curva ocupa a largura inteira.
  const meses = MESES.slice(0, mesAtual + 1);
  const vaos = Math.max(1, meses.length - 1);

  const caminho = (serie: number[]) =>
    serie
      .map((v, i) => {
        const x = (i / vaos) * L;
        const y = (1 - v / alto) * A;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  const linhaRecebido = caminho(recebido);

  return (
    <section className="glass flex flex-col rounded-2xl p-6 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[1.05rem] font-semibold text-bone">
            Fluxo de faturamento
          </h2>
          <p className="mt-1 text-[0.82rem] text-stone">
            {new Date().getFullYear()} · total recebido {brl(
              recebido.reduce((s, v) => s + v, 0),
            )}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-4">
          {SERIES.map((s) => (
            <li key={s.id} className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "size-2 rounded-full",
                  s.forte ? "bg-chrome" : "bg-stone/60",
                )}
              />
              <span className="text-[0.8rem] text-stone">{s.rotulo}</span>
            </li>
          ))}
        </ul>
      </header>

      {/*
        Grade de duas linhas: o eixo Y precisa ter exatamente a altura da
        área de plotagem. Numa flexbox única ele esticava também sobre a
        régua de meses e o rótulo "R$ 0" descia abaixo da linha de base.
      */}
      <div className="mt-7 grid flex-1 grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-x-4">
        <div className="relative w-[4.6rem]">
          {Array.from({ length: DIVISOES + 1 }, (_, i) => {
            const t = i / DIVISOES;
            return (
              <span
                key={t}
                style={{ top: `${t * 100}%` }}
                className="absolute right-0 -translate-y-1/2 text-[0.78rem] tabular-nums text-stone/50"
              >
                {brl(Math.round(alto * (1 - t)))}
              </span>
            );
          })}
        </div>

        {/* O svg fica absoluto de propósito: com viewBox 1:2 e altura em
            porcentagem ele impõe altura intrínseca ao cartão e estica o
            painel inteiro. Fora do fluxo, quem manda é o contêiner. */}
        <div className="relative min-h-56">
          <svg
            viewBox={`0 0 ${L} ${A}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={
              vazio
                ? "Faturamento por mês, ainda sem movimentação"
                : `Recebido e em aberto de janeiro a ${MESES_LONGOS[mesAtual]}`
            }
            className="absolute inset-0 size-full"
          >
            <defs>
              <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.22" />
                <stop offset="72%" stopColor="white" stopOpacity="0.04" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>

            {Array.from({ length: DIVISOES + 1 }, (_, i) => {
              const t = i / DIVISOES;
              return (
                <line
                  key={t}
                  x1="0"
                  x2={L}
                  y1={A * t}
                  y2={A * t}
                  stroke="white"
                  strokeOpacity={t === 1 ? 0.16 : 0.05}
                  strokeWidth="0.4"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {!vazio && (
              <>
                <path
                  d={`${linhaRecebido} L ${L} ${A} L 0 ${A} Z`}
                  fill={`url(#${id}-area)`}
                />
                {/* Em aberto vem primeiro para o recebido ficar por cima. */}
                <path
                  d={caminho(emAberto)}
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.32"
                  strokeWidth="1.6"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <path
                  d={linhaRecebido}
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.92"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>

          {vazio && (
            <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-stone/45">
              Sem movimentação ainda
            </p>
          )}
        </div>

        <span aria-hidden />

        {/*
          Cada rótulo fica sobre o seu ponto de dados. As pontas são a
          exceção: centradas, metade do texto ficaria fora da área do
          gráfico — o primeiro encosta pela esquerda, o último pela direita.
        */}
        <ol className="relative mt-3.5 h-[1.1rem] text-[0.76rem]">
          {meses.map((mes, i) => {
            const ultimo = i === meses.length - 1;
            return (
              <li
                key={mes}
                style={{ left: `${(i / vaos) * 100}%` }}
                className={cn(
                  "absolute top-0 whitespace-nowrap",
                  i === 0
                    ? "translate-x-0"
                    : ultimo
                      ? "-translate-x-full"
                      : "-translate-x-1/2",
                  ultimo ? "font-medium text-bone" : "text-stone/50",
                )}
              >
                {mes}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- distribuição */

function Distribuicao({ d }: { d: Painel }) {
  const valores = TIPOS.map((t) => ({ ...t, valor: d.pecas[t.id] }));
  const total = valores.reduce((s, v) => s + v.valor, 0);
  const R = 52;
  const C = 2 * Math.PI * R;
  let acumulado = 0;

  return (
    <section className="glass flex flex-col rounded-2xl p-6 sm:p-7">
      <h2 className="font-display text-[1.05rem] font-semibold text-bone">
        O que você entregou
      </h2>
      <p className="mt-1 text-[0.82rem] text-stone">Peças por tipo</p>

      <div className="relative mx-auto mt-7 size-40 shrink-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="white"
            strokeOpacity="0.07"
            strokeWidth="13"
          />
          {total > 0 &&
            valores.map((v, i) => {
              const fatia = (v.valor / total) * C;
              const offset = acumulado;
              acumulado += fatia;
              return (
                <circle
                  key={v.id}
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke="white"
                  strokeOpacity={0.92 - i * 0.19}
                  strokeWidth="13"
                  strokeDasharray={`${fatia} ${C - fatia}`}
                  strokeDashoffset={-offset}
                />
              );
            })}
        </svg>

        <div className="absolute inset-0 grid place-content-center text-center">
          <p className="metal-text font-display text-[2rem] font-semibold leading-none tabular-nums">
            {total}
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-stone">
            peças
          </p>
        </div>
      </div>

      <ul className="mt-7 space-y-2.5">
        {valores.map((v, i) => {
          const Icone = v.icone;
          const pct = total ? Math.round((v.valor / total) * 100) : 0;
          return (
            <li key={v.id} className="flex items-center gap-3">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-white"
                style={{ opacity: 0.92 - i * 0.19 }}
              />
              <Icone className="size-3.5 shrink-0 text-stone/60" strokeWidth={1.8} />
              <span className="flex-1 truncate text-[0.84rem] text-bone/85">
                {v.rotulo}
              </span>
              <span className="font-display text-[0.84rem] tabular-nums text-stone">
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* --------------------------------------------------------------- atividade */

function Atividade({ d, projects }: { d: Painel; projects?: any[] }) {
  const itensAtividade = projects ? projects.map(p => {
    const statusMap: Record<string, string> = {
      'rascunho': 'Radar de oportunidade iniciado',
      'aguardando_resposta': 'Perfil do imóvel em andamento',
      'em_producao': 'Materiais gerados',
      'concluido': 'Projeto finalizado'
    };

    
    return {
      texto: `${p.properties?.[0]?.nome || p.name || 'Novo Projeto'} · ${statusMap[p.status] || 'Atualizado'}`,
      quando: new Date(p.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      valor: null
    };
  }).slice(0, 5) : d.atividade;

  return (
    <section className="glass flex flex-col rounded-2xl p-6 sm:p-7">
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[1.05rem] font-semibold text-bone">
          Atividade recente
        </h2>
        <Activity className="size-4 text-stone/45" strokeWidth={1.7} />
      </header>

      {itensAtividade.length === 0 ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-12 text-center">
          <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-stone">
            <Activity className="size-4" strokeWidth={1.8} />
          </span>
          <p className="mt-4 text-[0.88rem] font-medium text-bone">
            Nada registrado ainda
          </p>
          <p className="mt-1 max-w-xs text-[0.8rem] leading-relaxed text-stone">
            Cada entrega, proposta e pagamento aparece aqui em ordem.
          </p>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-white/6">
          {itensAtividade.map((a, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[0.86rem] text-bone/90">{a.texto}</p>
                <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-stone/60">
                  {a.quando}
                </p>
              </div>
              {a.valor !== null && (
                <span className="shrink-0 font-display text-[0.92rem] font-medium tabular-nums text-bone">
                  {brl(a.valor)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- onboarding */

function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [passo, setPasso] = useState(0);

  const passos = [
    {
      titulo: "Boas-vindas à Nexofly",
      desc: "O cérebro operacional para quem vende marketing imobiliário. Vamos transformar imóveis em ativos de alta conversão.",
      icone: Wand2,
    },
    {
      titulo: "O Fluxo Inteligente",
      desc: "1. Encontre oportunidades no Radar. 2. Personalize a estratégia. 3. Gere entregáveis de elite (vídeos, sites e propostas).",
      icone: Activity,
    },
    {
      titulo: "Sempre em Mãos",
      desc: "Seus rascunhos são salvos automaticamente. Você pode continuar de onde parou a qualquer momento pelo painel.",
      icone: Clock3,
    },
  ];

  const atual = passos[passo];
  const Icone = atual.icone;

  const proximo = async () => {
    if (passo < passos.length - 1) {
      setPasso(passo + 1);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from("profiles")
          .update({ onboarding_completed: true } as any)

          .eq("id", session.user.id);
      }
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/90 p-6 backdrop-blur-md">
      <div className="glass-deep max-w-md overflow-hidden rounded-3xl p-8 text-center ring-1 ring-white/10">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-chrome/10 text-chrome">
          <Icone className="size-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-bone">{atual.titulo}</h2>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-stone">{atual.desc}</p>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-1.5">
            {passos.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all",
                  i === passo ? "w-6 bg-chrome" : "w-1.5 bg-white/10"
                )}
              />
            ))}
          </div>
          <button
            onClick={proximo}
            className="metal-pill px-6 py-2.5 text-sm font-bold text-black"
          >
            {passo === passos.length - 1 ? "Começar agora" : "Continuar"}
          </button>
        </div>

        <button
          onClick={onComplete}
          className="mt-6 text-[0.82rem] text-stone/60 hover:text-stone"
        >
          Pular introdução
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- dashboard */

export function Dashboard() {
  const { ligado: demo, dados } = useDemo();
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: listProjects,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      return data as any;
    }
  });

  useEffect(() => {
    if (profile && profile.onboarding_completed === false) {
      setMostrarOnboarding(true);
    }
  }, [profile]);


  const p = demo ? dados : ZERADO;
  const temProjetos = (projects && projects.length > 0) || demo;
  const projetoAtivo = projects?.[0]; // O mais recente devido ao order no listProjects

  return (
    <div className="space-y-6">
      {mostrarOnboarding && <Onboarding onComplete={() => setMostrarOnboarding(false)} />}

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <p className="eyebrow">Painel</p>
            {demo && (
              <span className="rounded-md border border-white/14 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-stone">
                Demonstração
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-4xl">
            {temProjetos ? "Sua operação hoje." : "Boas-vindas, vamos começar?"}
          </h1>
        </div>

        <Link
          href="/painel/criar"
          className="metal-pill flex items-center gap-2 px-6 py-3 text-sm font-bold text-black"
        >
          <Plus className="size-4" /> Novo Projeto
        </Link>
      </header>

      {/* Estado: Continuar de onde parou */}
      {!demo && projetoAtivo && projetoAtivo.status !== 'concluido' && (
        <section className="glass-deep rim-lit overflow-hidden rounded-3xl p-1 px-1">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="grid size-14 place-items-center rounded-2xl bg-chrome/10 text-chrome">
                <Play className="size-6 fill-chrome" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-stone">Continuar de onde parou</p>
                <h3 className="mt-1 font-display text-xl font-bold text-bone">
                  {projetoAtivo.properties?.[0]?.nome || "Projeto sem nome"}
                </h3>
                <div className="mt-1.5 flex items-center gap-3 text-sm text-stone">
                   <span className="flex items-center gap-1.5">
                     <span className="size-1.5 rounded-full bg-chrome" />
                     Passo {projetoAtivo.current_step + 1}
                   </span>
                   {projetoAtivo.properties?.[0]?.opportunity_score && (
                     <span className="flex items-center gap-1 text-orange-400">
                       <Flame className="size-3 fill-orange-400" />
                       {projetoAtivo.properties[0].opportunity_score}
                     </span>
                   )}
                </div>
              </div>
            </div>
            <Link
              href="/painel/criar"
              onClick={() => setCurrentProjectId(projetoAtivo.id)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-8 py-4 text-sm font-bold text-bone ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              Retomar agora <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Estado: Sem projetos (Zero State) */}
      {!temProjetos && !isLoading && (
        <section className="glass flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-dashed border-white/10 p-12 text-center">
          <div className="grid size-20 place-items-center rounded-3xl bg-white/5 text-stone">
            <Wand2 className="size-10" />
          </div>
          <h2 className="mt-8 font-display text-2xl font-semibold text-bone">
            Pronto para o seu primeiro projeto?
          </h2>
          <p className="mt-4 max-w-sm text-stone">
            Encontre imóveis com baixo desempenho visual e crie entregáveis que vendem em minutos.
          </p>
          <Link
            href="/painel/criar"
            className="metal-pill mt-8 flex items-center gap-2 px-10 py-4 text-base font-bold text-black"
          >
            Iniciar meu primeiro projeto <Plus className="size-5" />
          </Link>
        </section>
      )}

      {/* Métricas: Só aparecem se houver projetos ou no modo demo */}
      {temProjetos && (
        <>
          {demo && <Faturamento d={p} />}
          <div className="grid gap-5 lg:grid-cols-2">
            {demo && <Fluxo d={p} />}
            <Distribuicao d={p} />
            <Atividade d={p} projects={demo ? undefined : projects} />
          </div>
        </>
      )}
    </div>
  );
}

