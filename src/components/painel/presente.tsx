"use client";

import { useSyncExternalStore, useEffect } from "react";
import { Gift, Sparkles, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const CHAVE = "nexofly:presente:inicio";
const DIAS = 5;
const MS_DIA = 24 * 60 * 60 * 1000;

/**
 * Relógio do presente como store externo.
 *
 * O prazo vive no localStorage e o tempo corre fora do React, então
 * useSyncExternalStore é o encaixe certo: nada de setState dentro de
 * efeito e nenhuma divergência entre servidor e cliente.
 */
type Instantaneo = { inicio: number; agora: number };

const VAZIO: Instantaneo = { inicio: 0, agora: 0 };

let instantaneo: Instantaneo = VAZIO;
let timer: ReturnType<typeof setInterval> | null = null;
const ouvintes = new Set<() => void>();

function lerInicio() {
  const salvo = localStorage.getItem(CHAVE);
  if (salvo) return Number(salvo);
  const agora = Date.now();
  localStorage.setItem(CHAVE, String(agora));
  return agora;
}

function assinar(aoMudar: () => void) {
  if (ouvintes.size === 0) {
    instantaneo = { inicio: lerInicio(), agora: Date.now() };
    timer = setInterval(() => {
      instantaneo = { inicio: instantaneo.inicio, agora: Date.now() };
      ouvintes.forEach((f) => f());
    }, 1000);
  }
  ouvintes.add(aoMudar);

  return () => {
    ouvintes.delete(aoMudar);
    if (ouvintes.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const pegar = () => instantaneo;
const pegarNoServidor = () => VAZIO;

function Bloco({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div className="glass min-w-[4.5rem] rounded-xl px-4 py-3 text-center">
      <p className="metal-text font-display text-[1.9rem] font-semibold leading-none tabular-nums">
        {String(valor).padStart(2, "0")}
      </p>
      <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-stone">
        {rotulo}
      </p>
    </div>
  );
}

export function Presente() {
  const { inicio, agora } = useSyncExternalStore(
    assinar,
    pegar,
    pegarNoServidor,
  );

  const pronto = inicio > 0;
  const falta = pronto ? inicio + DIAS * MS_DIA - agora : DIAS * MS_DIA;
  const liberado = pronto && falta <= 0;

  const restante = {
    dias: Math.max(0, Math.floor(falta / MS_DIA)),
    horas: Math.max(0, Math.floor((falta / (60 * 60 * 1000)) % 24)),
    minutos: Math.max(0, Math.floor((falta / (60 * 1000)) % 60)),
    segundos: Math.max(0, Math.floor((falta / 1000) % 60)),
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Presente</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-4xl">
          Você ganhou algo.
        </h1>
        <p className="mt-1.5 text-[0.95rem] text-stone">
          {liberado
            ? "O prazo acabou. Seu presente está aberto."
            : `Liberamos em ${DIAS} dias a partir da sua entrada.`}
        </p>
      </header>

      <section
        className={cn(
          "relative overflow-hidden rounded-3xl p-8 text-center sm:p-12",
          liberado ? "glass-deep rim-lit" : "glass",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(255,255,255,0.1),transparent_65%)] transition-opacity duration-1000",
            liberado ? "opacity-100" : "opacity-40",
          )}
        />

        <div className="relative">
          <span
            className={cn(
              "mx-auto grid size-16 place-items-center rounded-2xl transition-all duration-700",
              liberado
                ? "metal-pill text-[#08090B] motion-safe:animate-float"
                : "bg-white/6 text-stone",
            )}
          >
            {liberado ? (
              <Sparkles className="size-7" strokeWidth={1.9} />
            ) : (
              <Gift className="size-7" strokeWidth={1.9} />
            )}
          </span>

          {liberado ? (
            <div className="motion-safe:animate-rise">
              <h2 className="mt-7 font-display text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-bone sm:text-[2.8rem]">
                Você está no sorteio de{" "}
                <span className="metal-text">R$ 2.000</span>.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[1rem] leading-relaxed text-stone">
                Sua entrada foi registrada automaticamente. O resultado sai para
                todos os participantes pelo e-mail da conta.
              </p>

              <div className="glass mx-auto mt-8 flex max-w-sm items-center gap-3 rounded-xl p-4 text-left">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-jade/16 text-jade">
                  <Ticket className="size-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[0.9rem] font-medium text-bone">
                    Participação confirmada
                  </p>
                  <p className="text-[0.78rem] text-stone">
                    Um número por conta ativa
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mt-7 font-display text-[1.8rem] font-semibold leading-tight tracking-[-0.03em] text-bone sm:text-[2.2rem]">
                Abre em
              </h2>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <Bloco valor={restante.dias} rotulo="dias" />
                <Bloco valor={restante.horas} rotulo="horas" />
                <Bloco valor={restante.minutos} rotulo="min" />
                <Bloco valor={restante.segundos} rotulo="seg" />
              </div>

              <p className="mx-auto mt-7 max-w-sm text-[0.92rem] leading-relaxed text-stone">
                Não precisa fazer nada. Quando o relógio zerar, o presente
                aparece aqui sozinho.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
