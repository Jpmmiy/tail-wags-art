"use client";

import { Plus, Trash2, RotateCcw, Eraser } from "lucide-react";
import {
  useDemo,
  editarDemo,
  restaurarDemo,
  salvarDemo,
  mesCorrente,
  ZERADO,
  type Atividade,
  type Painel,
} from "@/lib/demo";
import { cn } from "@/lib/utils";

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const SERIES: { id: "fluxo" | "aberto"; rotulo: string; forte: boolean }[] = [
  { id: "fluxo", rotulo: "Recebido", forte: true },
  { id: "aberto", rotulo: "Em aberto", forte: false },
];

const PECAS: { id: keyof Painel["pecas"]; rotulo: string }[] = [
  { id: "fotos", rotulo: "Fotos tratadas" },
  { id: "video", rotulo: "Vídeos" },
  { id: "site", rotulo: "Sites" },
  { id: "abordagem", rotulo: "Propostas" },
];

const campo =
  "h-10 w-full rounded-lg border border-white/12 bg-white/[0.03] px-3 text-[0.86rem] text-bone outline-none transition-colors placeholder:text-stone/45 focus-visible:border-chrome";

function Numero({
  rotulo,
  valor,
  onChange,
  moeda,
  compacto,
  travado,
  dica,
}: {
  rotulo: string;
  valor: number;
  onChange: (n: number) => void;
  moeda?: boolean;
  compacto?: boolean;
  travado?: boolean;
  dica?: string;
}) {
  return (
    <label className="block">
      <span
        className={cn(
          "font-mono uppercase tracking-[0.12em] text-stone",
          compacto ? "text-[9px]" : "text-[9.5px]",
        )}
      >
        {rotulo}
      </span>
      <div className="relative mt-1.5">
        {moeda && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.8rem] text-stone/70">
            R$
          </span>
        )}
        <input
          type="number"
          min={0}
          value={valor}
          disabled={travado}
          title={dica}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className={cn(
            campo,
            "tabular-nums",
            moeda && "pl-9",
            travado && "cursor-not-allowed opacity-35",
          )}
        />
      </div>
    </label>
  );
}

function Bloco({
  titulo,
  desc,
  children,
}: {
  titulo: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-white/8 pt-6 first:border-0 first:pt-0">
      <h3 className="font-display text-[0.95rem] font-semibold text-bone">
        {titulo}
      </h3>
      {desc && <p className="mt-0.5 text-[0.8rem] text-stone">{desc}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function EditorDemo() {
  const { dados: d } = useDemo();
  const mes = mesCorrente();

  const trocaAtividade = (i: number, troca: Partial<Atividade>) => {
    const atividade = d.atividade.map((a, k) =>
      k === i ? { ...a, ...troca } : a,
    );
    editarDemo({ atividade });
  };

  return (
    <section className="glass rounded-2xl p-6 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[1.1rem] font-semibold text-bone">
            Valores do painel
          </h2>
          <p className="mt-1 text-[0.86rem] text-stone">
            Tudo que aparece no dashboard, editável aqui. Salva sozinho.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={restaurarDemo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-stone transition-colors hover:border-chrome/40 hover:text-bone"
          >
            <RotateCcw className="size-3" strokeWidth={2} />
            Restaurar exemplo
          </button>
          <button
            type="button"
            onClick={() => salvarDemo(ZERADO)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-stone transition-colors hover:border-chrome/40 hover:text-bone"
          >
            <Eraser className="size-3" strokeWidth={2} />
            Zerar
          </button>
        </div>
      </header>

      <div className="mt-7 space-y-6">
        <Bloco titulo="Topo" desc="A faixa grande de faturamento e os três apoios.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Numero
              rotulo="Faturado no mês"
              valor={d.faturado}
              moeda
              onChange={(faturado) => editarDemo({ faturado })}
            />
            <Numero
              rotulo="Aguardando pagamento"
              valor={d.aguardando}
              moeda
              onChange={(aguardando) => editarDemo({ aguardando })}
            />
            <Numero
              rotulo="Propostas em aberto"
              valor={d.propostasAbertas}
              onChange={(propostasAbertas) => editarDemo({ propostasAbertas })}
            />
            <Numero
              rotulo="Entregas concluídas"
              valor={d.entregas}
              onChange={(entregas) => editarDemo({ entregas })}
            />
            <Numero
              rotulo="Ticket médio"
              valor={d.ticket}
              moeda
              onChange={(ticket) => editarDemo({ ticket })}
            />
          </div>
        </Bloco>

        <Bloco
          titulo="Fluxo de faturamento"
          desc={`As duas linhas do gráfico, de janeiro a ${MESES[mes]}. A escala segue o maior valor das duas séries.`}
        >
          {SERIES.map((serie) => (
            <div key={serie.id} className="mt-5 first:mt-0">
              <p className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-stone">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-full",
                    serie.forte ? "bg-chrome" : "bg-stone/60",
                  )}
                />
                {serie.rotulo}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {MESES.slice(0, mes + 1).map((m, i) => (
                  <Numero
                    key={m}
                    compacto
                    rotulo={m}
                    valor={d[serie.id][i] ?? 0}
                    onChange={(v) => {
                      const proximo = [...d[serie.id]];
                      proximo[i] = v;
                      editarDemo({ [serie.id]: proximo });
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </Bloco>

        <Bloco titulo="Peças entregues" desc="Alimenta o donut e o total no centro.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PECAS.map((p) => (
              <Numero
                key={p.id}
                rotulo={p.rotulo}
                valor={d.pecas[p.id]}
                onChange={(v) =>
                  editarDemo({ pecas: { ...d.pecas, [p.id]: v } })
                }
              />
            ))}
          </div>
        </Bloco>

        <Bloco
          titulo="Atividade recente"
          desc="Deixe o valor em branco para a linha aparecer sem cifra."
        >
          <div className="space-y-2.5">
            {d.atividade.map((a, i) => (
              <div
                key={i}
                className="grid gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] p-3 sm:grid-cols-[7rem_1fr_8rem_auto] sm:items-center"
              >
                <input
                  value={a.quando}
                  onChange={(e) => trocaAtividade(i, { quando: e.target.value })}
                  placeholder="há 2 h"
                  className={campo}
                />
                <input
                  value={a.texto}
                  onChange={(e) => trocaAtividade(i, { texto: e.target.value })}
                  placeholder="Imóvel · o que aconteceu"
                  className={campo}
                />
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.8rem] text-stone/70">
                    R$
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={a.valor ?? ""}
                    placeholder="—"
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) =>
                      trocaAtividade(i, {
                        valor:
                          e.target.value === ""
                            ? null
                            : Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className={cn(campo, "pl-9 tabular-nums")}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    editarDemo({
                      atividade: d.atividade.filter((_, k) => k !== i),
                    })
                  }
                  aria-label={`Remover linha ${i + 1}`}
                  className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/12 text-stone transition-colors hover:border-white/25 hover:text-bone"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.9} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                editarDemo({
                  atividade: [
                    ...d.atividade,
                    { quando: "agora", texto: "", valor: null },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/14 px-3.5 py-2.5 text-[0.84rem] text-stone transition-colors hover:border-chrome/40 hover:text-bone"
            >
              <Plus className="size-3.5" strokeWidth={2} />
              Adicionar linha
            </button>
          </div>
        </Bloco>
      </div>
    </section>
  );
}
