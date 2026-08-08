"use client";

import { useState, useEffect } from "react";
import { Check, X, Tag, Sparkles, Flame, Clock } from "lucide-react";
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
  const [timer, setTimer] = useState("08:00:00");

  useEffect(() => {
    const updateTimer = () => {
      const agora = new Date();
      const meiaNoite = new Date();
      meiaNoite.setHours(24, 0, 0, 0); // Próxima meia-noite

      const diff = meiaNoite.getTime() - agora.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimer(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const mensal = PLANOS.find((p) => p.id === "mensal")! as any;
  const vitalicio = PLANOS.find((p) => p.id === "vitalicio")! as any;

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


        {/* cartões: o vitalício domina */}
        <div className="mx-auto mt-12 grid max-w-5xl items-center gap-6 lg:grid-cols-2">
          {/* mensal */}
          <Reveal>
            <article className="glass specular relative flex h-full flex-col rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1">
              <h3 className="font-display text-lg font-semibold text-bone">
                {mensal.nome}
              </h3>
              <p className="mt-1 text-[0.85rem] text-stone">{mensal.chamada}</p>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-red-500">
                  <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                  SUPER DESCONTO DE 1 ANO — ANIVERSÁRIO DA PLATAFORMA
                </div>
                
                <div className="flex items-center gap-2 px-1 text-[0.75rem] font-medium text-red-500/80">
                  <Clock className="size-3.5" />
                  OFERTA TERMINA EM: <span className="font-mono">{timer}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[0.9rem] font-medium text-red-500 line-through decoration-2 opacity-80">
                  R$ {mensal.precoAntigo}
                </p>
                <p className="flex items-baseline gap-1.5">
                  <span className="font-display text-[1.2rem] text-stone">R$</span>
                  <span className="font-display text-[2.7rem] font-semibold leading-none tracking-[-0.035em] text-bone">
                    {mensal.preco}
                  </span>
                  <span className="ml-1 text-[0.8rem] text-stone">
                    {mensal.periodo}
                  </span>
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {mensal.inclui.map((item: string) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.86rem] text-bone/80"
                  >
                    <Marca ok />
                    {item}
                  </li>
                ))}
                {mensal.fora.map((item: string) => (
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
            <article className="glass-deep rim-lit specular relative flex h-full flex-col rounded-3xl p-7 shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute -right-2 -top-4 z-10 flex animate-bounce items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-wider text-white shadow-xl shadow-red-600/20">
                <Flame className="size-4 fill-white" />
                Restam apenas 3 vitalícios
              </div>

              <span className="metal-pill absolute -top-3.5 left-8 flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#08090B] shadow-[0_10px_24px_-10px_rgba(255,255,255,0.5)]">
                <Sparkles className="size-3" strokeWidth={2.5} />
                Mais escolhido
              </span>

              <h3 className="font-display text-2xl font-semibold text-bone">
                {vitalicio.nome}
              </h3>
              <p className="mt-1 text-[0.9rem] text-stone">
                {vitalicio.chamada}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-red-500">
                  <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                  SUPER DESCONTO DE 1 ANO — ANIVERSÁRIO DA PLATAFORMA
                </div>
                
                <div className="flex items-center gap-2 px-1 text-[0.75rem] font-medium text-red-500/80">
                  <Clock className="size-3.5" />
                  OFERTA TERMINA EM: <span className="font-mono">{timer}</span>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <div>
                  <p className="text-[1.1rem] font-medium text-red-500 line-through decoration-2 opacity-80">
                    R$ {vitalicio.precoAntigo}
                  </p>
                  <p className="flex items-baseline gap-2">
                    {vitalicio.parcelas && (
                      <span className="font-display text-[1.4rem] text-blue-400 font-medium">
                        {vitalicio.parcelas}
                      </span>
                    )}
                    <span className="font-display text-[1.2rem] text-stone">
                      R$
                    </span>
                    <span className="metal-text font-display text-[2.7rem] font-semibold leading-none tracking-[-0.035em] text-bone">
                      {vitalicio.preco}
                    </span>
                  </p>
                </div>
                <div className="pb-0.5">
                  <p className="text-[0.86rem] uppercase tracking-widest text-blue-400 font-bold">
                    {vitalicio.periodo}
                  </p>
                </div>
              </div>

              {/* Lista em coluna única: em duas colunas os itens de altura
                  diferente desalinhavam as linhas de baixo. */}
              <ul className="mt-7 flex-1 divide-y divide-white/6 border-y border-white/6">
                {vitalicio.inclui.map((item: string) => (
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
