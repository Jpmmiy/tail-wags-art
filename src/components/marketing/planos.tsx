"use client";

import { useState } from "react";
import { Check, X, Tag, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Cta, CtaGhost } from "@/components/brand/cta";
import { PLANOS } from "@/lib/conteudo";
import { cn } from "@/lib/utils";

function Marca({ ok }: { ok: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full",
        ok ? "bg-chrome/18 text-chrome" : "bg-white/6 text-stone/50",
      )}
    >
      {ok ? (
        <Check className="size-2.5" strokeWidth={3.2} />
      ) : (
        <X className="size-2.5" strokeWidth={3} />
      )}
    </span>
  );
}

export function Planos() {
  const [codigo, setCodigo] = useState("");
  const [aplicado, setAplicado] = useState<string | null>(null);

  const isCupomValido = aplicado === "PAIS2026";

  const mensal = PLANOS.find((p) => p.id === "mensal")!;
  const vitalicio = PLANOS.find((p) => p.id === "vitalicio")!;

  const precoMensal = isCupomValido ? "169,00" : mensal.preco;
  const precoVitalicio = isCupomValido ? "249,00" : vitalicio.preco;

  return (
    <section
      id="planos"
      className="relative overflow-hidden scroll-mt-24 py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="window-light left-1/2 top-1/3 h-[28rem] w-[46rem] -translate-x-1/2 opacity-70"
      />

      <div className="relative mx-auto max-w-[76rem] px-5 lg:px-8">
        <Reveal className="text-center">
          <span className="glass inline-flex rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
            Planos
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.02] text-bone sm:text-[3.3rem]">
            Escolha o ritmo{" "}
            <span className="metal-text">do seu trabalho.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed text-stone">
            Cancele quando quiser. Sem letras miúdas. O que você cobra do
            anfitrião é seu por inteiro.
          </p>
        </Reveal>

        {/* cupom */}
        <Reveal delay={80}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const c = codigo.trim().toUpperCase();
              if (c) setAplicado(c);
            }}
            className="glass mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full p-1.5"
          >
            <label htmlFor="cupom" className="sr-only">
              Código de cupom
            </label>
            <span className="pl-3 text-stone" aria-hidden>
              <Tag className="size-4" strokeWidth={1.8} />
            </span>
            <input
              id="cupom"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value);
                setAplicado(null);
              }}
              placeholder="Tem um cupom de desconto?"
              className="h-10 min-w-0 flex-1 bg-transparent text-[0.9rem] text-bone outline-none placeholder:text-stone/60"
            />
            <button
              type="submit"
              disabled={!codigo.trim()}
              className="metal-pill h-10 shrink-0 rounded-full px-5 text-[0.85rem] font-semibold text-[#08090B] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
            >
              Aplicar
            </button>
          </form>

          {aplicado && (
            <p className={cn(
              "mt-3 text-center text-[0.82rem] motion-safe:animate-rise",
              isCupomValido ? "text-jade" : "text-amber-400"
            )}>
              {isCupomValido ? (
                <>Cupom <span className="font-semibold">{aplicado}</span> aplicado com sucesso!</>
              ) : (
                <>Cupom <span className="font-semibold">{aplicado}</span> é inválido.</>
              )}
            </p>
          )}
        </Reveal>

        {/* cartões: o vitalício domina */}
        <div className="mx-auto mt-12 grid max-w-5xl items-center gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* mensal */}
          <Reveal>
            <article className="glass specular relative flex h-full flex-col rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1">
              <h3 className="font-display text-lg font-semibold text-bone">
                {mensal.nome}
              </h3>
              <p className="mt-1 text-[0.85rem] text-stone">{mensal.chamada}</p>

              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-[1.2rem] text-stone">R$</span>
                <span className={cn(
                  "font-display text-[2.7rem] font-semibold leading-none tracking-[-0.035em] transition-all duration-300",
                  isCupomValido ? "text-jade" : "text-bone"
                )}>
                  {precoMensal}
                </span>
                <span className="ml-1 text-[0.8rem] text-stone">
                  {mensal.periodo}
                </span>
              </p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {mensal.inclui.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.86rem] text-bone/80"
                  >
                    <Marca ok />
                    {item}
                  </li>
                ))}
                {mensal.fora.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.86rem] text-stone/55">
                    <Marca ok={false} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <CtaGhost href={mensal.href} size="lg" className="w-full">
                  {mensal.acao}
                </CtaGhost>
              </div>
            </article>
          </Reveal>

          {/* vitalício */}
          <Reveal delay={120}>
            <article className="glass-deep rim-lit specular relative flex h-full flex-col rounded-[1.75rem] p-8 shadow-[0_50px_120px_-40px_rgba(255,255,255,0.22)] transition-all duration-500 hover:-translate-y-1.5 sm:p-9">
              <span className="metal-pill absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#08090B] shadow-[0_10px_24px_-10px_rgba(255,255,255,0.5)]">
                <Sparkles className="size-3" strokeWidth={2.5} />
                Mais escolhido
              </span>

              <h3 className="font-display text-2xl font-semibold text-bone">
                {vitalicio.nome}
              </h3>
              <p className="mt-1 text-[0.9rem] text-stone">
                {vitalicio.chamada}
              </p>

              <div className="mt-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <p className="flex items-baseline gap-2">
                  <span className="font-display text-[1.5rem] text-stone">
                    R$
                  </span>
                  <span className={cn(
                    "font-display text-[4.2rem] font-semibold leading-none tracking-[-0.04em] transition-all duration-300 sm:text-[4.8rem]",
                    isCupomValido ? "text-jade" : "metal-text"
                  )}>
                    {precoVitalicio}
                  </span>
                </p>
                <div className="pb-1.5">
                  <p className="text-[0.86rem] text-stone">
                    {vitalicio.periodo}
                  </p>
                  <p className="mt-1 text-[0.82rem] font-medium text-jade">
                    Economiza R$ 1.789 no primeiro ano
                  </p>
                </div>
              </div>

              {/* Lista em coluna única: em duas colunas os itens de altura
                  diferente desalinhavam as linhas de baixo. */}
              <ul className="mt-7 flex-1 divide-y divide-white/6 border-y border-white/6">
                {vitalicio.inclui.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 py-3 text-[0.92rem] text-bone/90"
                  >
                    <Marca ok />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Cta href={vitalicio.href} size="lg" className="w-full">
                  {vitalicio.acao}
                </Cta>
              </div>

              <p className="mt-4 text-center text-[0.8rem] text-stone">
                Pagamento único · sem renovação · acesso na hora
              </p>
            </article>
          </Reveal>
        </div>

        <Reveal delay={220}>
          <p className="mt-8 text-center text-[0.84rem] text-stone">
            Pagamento por Pix ou cartão · Cancele o mensal quando quiser
          </p>
        </Reveal>
      </div>
    </section>
  );
}
