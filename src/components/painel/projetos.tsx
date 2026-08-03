"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Circle, Pencil, Trash2, Plus, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

const ETAPAS = ["Imóvel", "Direção", "Fotos", "Vídeo", "Site", "Proposta"];

const SITUACOES = [
  "Em produção",
  "Proposta enviada",
  "Entregue",
  "Cancelado",
] as const;

type Situacao = (typeof SITUACOES)[number];

type Projeto = {
  id: string;
  imovel: string;
  cidade: string;
  cliente: string;
  valor: number;
  etapa: number;
  situacao: Situacao;
};

const CORES: Record<Situacao, string> = {
  Entregue: "bg-jade/14 text-jade",
  "Em produção": "bg-white/10 text-bone",
  "Proposta enviada": "bg-white/6 text-stone",
  Cancelado: "bg-destructive/12 text-destructive",
};

const entrada =
  "h-10 w-full rounded-lg border border-white/12 bg-white/[0.03] px-3 text-[0.88rem] text-bone outline-none transition-colors focus-visible:border-chrome";

function Editor({
  projeto,
  aoSalvar,
  aoFechar,
}: {
  projeto: Projeto;
  aoSalvar: (p: Projeto) => void;
  aoFechar: () => void;
}) {
  const [rascunho, setRascunho] = useState(projeto);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="glass-deep rim-lit w-full max-w-md rounded-2xl p-6 motion-safe:animate-rise">
        <h2 className="font-display text-[1.2rem] font-semibold text-bone">
          Editar projeto
        </h2>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
              Imóvel
            </span>
            <input
              value={rascunho.imovel}
              onChange={(e) =>
                setRascunho({ ...rascunho, imovel: e.target.value })
              }
              className={cn(entrada, "mt-2")}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                Cliente
              </span>
              <input
                value={rascunho.cliente}
                onChange={(e) =>
                  setRascunho({ ...rascunho, cliente: e.target.value })
                }
                className={cn(entrada, "mt-2")}
              />
            </label>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                Valor (R$)
              </span>
              <input
                value={rascunho.valor || ""}
                inputMode="numeric"
                onChange={(e) =>
                  setRascunho({
                    ...rascunho,
                    valor: Number(e.target.value.replace(/\D/g, "")) || 0,
                  })
                }
                className={cn(entrada, "mt-2")}
              />
            </label>
          </div>

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
              Situação
            </span>
            <select
              value={rascunho.situacao}
              onChange={(e) =>
                setRascunho({
                  ...rascunho,
                  situacao: e.target.value as Situacao,
                })
              }
              className={cn(entrada, "mt-2")}
            >
              {SITUACOES.map((s) => (
                <option key={s} value={s} className="bg-ink">
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
              Etapa concluída
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ETAPAS.map((e, i) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setRascunho({ ...rascunho, etapa: i + 1 })}
                  aria-pressed={rascunho.etapa === i + 1}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[0.76rem] transition-colors",
                    rascunho.etapa >= i + 1
                      ? "border-chrome/50 bg-white/10 text-bone"
                      : "border-white/10 text-stone hover:text-bone",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <button
            type="button"
            onClick={aoFechar}
            className="h-10 rounded-lg border border-white/12 px-4 text-[0.86rem] text-stone transition-colors hover:text-bone"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => aoSalvar(rascunho)}
            className="metal-pill h-10 rounded-lg px-5 text-[0.86rem] font-semibold text-[#08090B]"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [editando, setEditando] = useState<Projeto | null>(null);

  const total = projetos
    .filter((p) => p.situacao !== "Cancelado")
    .reduce((s, p) => s + p.valor, 0);

  const novo = () =>
    setEditando({
      id: crypto.randomUUID(),
      imovel: "",
      cidade: "",
      cliente: "",
      valor: 0,
      etapa: 1,
      situacao: "Em produção",
    });

  const salvar = (p: Projeto) => {
    setProjetos((lista) =>
      lista.some((x) => x.id === p.id)
        ? lista.map((x) => (x.id === p.id ? p : x))
        : [...lista, p],
    );
    setEditando(null);
  };

  return (
    <div className="space-y-8">
      {editando && (
        <Editor
          projeto={editando}
          aoSalvar={salvar}
          aoFechar={() => setEditando(null)}
        />
      )}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Carteira</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-4xl">
            Seus projetos
          </h1>
          <p className="mt-1.5 text-[0.95rem] text-stone">
            {projetos.length
              ? `${projetos.length} imóveis · R$ ${total.toLocaleString("pt-BR")} em serviços`
              : "Nenhum projeto ainda."}
          </p>
        </div>
        <button
          type="button"
          onClick={novo}
          className="metal-pill inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[0.88rem] font-semibold text-[#08090B] transition-transform hover:-translate-y-0.5"
        >
          <Plus className="size-4" strokeWidth={2.4} />
          Adicionar projeto
        </button>
      </header>

      {projetos.length === 0 ? (
        <section className="glass rounded-2xl p-10 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/6 text-stone">
            <FolderKanban className="size-5" strokeWidth={1.8} />
          </span>
          <h2 className="mt-5 font-display text-[1.3rem] font-semibold text-bone">
            A carteira começa vazia
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-relaxed text-stone">
            Cada entrega que você gerar pode ser salva aqui, com valor, situação
            e etapa. Dá para editar tudo depois.
          </p>
          <Link
            href="/painel/criar"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-5 text-[0.88rem] text-bone transition-colors hover:border-chrome/40"
          >
            Montar uma entrega
          </Link>
        </section>
      ) : (
        <ul className="space-y-3">
          {projetos.map((p) => (
            <li
              key={p.id}
              className="glass rounded-2xl p-5 transition-colors sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-display text-[1.15rem] font-semibold text-bone">
                    {p.imovel || "Sem nome"}
                  </h2>
                  <p className="mt-0.5 text-[0.82rem] text-stone">
                    {[p.cidade, p.cliente].filter(Boolean).join(" · ") ||
                      "Sem cliente definido"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-display text-xl text-bone">
                    R$ {p.valor.toLocaleString("pt-BR")}
                  </span>
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-[0.72rem] font-medium",
                      CORES[p.situacao],
                    )}
                  >
                    {p.situacao}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditando(p)}
                    aria-label={`Editar ${p.imovel || "projeto"}`}
                    className="grid size-9 place-items-center rounded-lg border border-white/12 text-stone transition-colors hover:border-chrome/40 hover:text-bone"
                  >
                    <Pencil className="size-3.5" strokeWidth={1.9} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProjetos((l) => l.filter((x) => x.id !== p.id))
                    }
                    aria-label={`Remover ${p.imovel || "projeto"}`}
                    className="grid size-9 place-items-center rounded-lg border border-white/12 text-stone transition-colors hover:border-destructive/40 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.9} />
                  </button>
                </div>
              </div>

              <ol className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {ETAPAS.map((e, i) => {
                  const feito = i < p.etapa;
                  return (
                    <li
                      key={e}
                      className={cn(
                        "flex items-center gap-1.5 text-[0.8rem]",
                        feito ? "text-bone" : "text-stone/45",
                      )}
                    >
                      {feito ? (
                        <Check className="size-3.5 text-chrome" strokeWidth={2.5} />
                      ) : (
                        <Circle className="size-3.5" strokeWidth={1.6} />
                      )}
                      {e}
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
