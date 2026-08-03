"use client";

import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  KeyRound,
  ShieldAlert,
  Play,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";

/* eslint-disable @next/next/no-img-element */

const CHAVE_DEMO = "NEXO-7K2QVCSKYHV98CIOQF09";

const PASSOS = [
  {
    n: "01",
    titulo: "Baixe a extensão",
    texto:
      "Um loader leve. O pacote real é baixado do servidor quando você abre a Lovable.",
  },
  {
    n: "02",
    titulo: "Ative os user scripts",
    texto:
      "Em chrome://extensions, ligue o Modo de desenvolvedor e ative “Permitir user scripts” nos detalhes da extensão.",
  },
  {
    n: "03",
    titulo: "Cole sua chave",
    texto:
      "Abra a extensão, cole a chave abaixo e pronto. Os créditos ficam liberados.",
  },
];

function Chave() {
  const [copiado, setCopiado] = useState(false);
  const [revelado, setRevelado] = useState(false);

  const mascarada = `${CHAVE_DEMO.slice(0, 9)}${"•".repeat(14)}`;

  return (
    <div className="glass-deep rim-lit rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="metal-pill grid size-9 place-items-center rounded-lg text-[#08090B]">
            <KeyRound className="size-4" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[0.95rem] font-medium text-bone">
              Sua chave de acesso
            </p>
            <p className="text-[0.78rem] text-stone">
              Única e intransferível · 1 licença ativa por vez
            </p>
          </div>
        </div>
        <span className="rounded-full bg-jade/14 px-3 py-1.5 text-[0.74rem] font-medium text-jade">
          Plano vitalício
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/35 p-2 pl-4">
        <code className="min-w-0 flex-1 truncate font-mono text-[0.9rem] tracking-[0.04em] text-bone">
          {revelado ? CHAVE_DEMO : mascarada}
        </code>
        <button
          type="button"
          onClick={() => setRevelado((v) => !v)}
          className="rounded-lg border border-white/12 px-3 py-2 text-[0.78rem] text-stone transition-colors hover:border-white/25 hover:text-bone"
        >
          {revelado ? "Ocultar" : "Revelar"}
        </button>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(CHAVE_DEMO);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 1800);
          }}
          className="metal-pill inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.8rem] font-semibold text-[#08090B] transition-transform hover:-translate-y-0.5"
        >
          {copiado ? (
            <Check className="size-3.5" strokeWidth={3} />
          ) : (
            <Copy className="size-3.5" strokeWidth={2} />
          )}
          {copiado ? "Copiada" : "Copiar"}
        </button>
      </div>

      <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] p-3.5 text-[0.82rem] leading-relaxed text-amber-200/90">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
        Guarde esta chave num gerenciador de senhas. Você vai precisar dela toda
        vez que ativar a extensão em um computador novo.
      </p>
    </div>
  );
}

export function Creditos() {
  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(255,255,255,0.1),transparent_65%)]"
        />
        <div className="relative px-6 py-10 text-center sm:px-10 sm:py-12">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
            <span className="size-1.5 rounded-full bg-jade motion-safe:animate-pulse" />
            Parceria exclusiva
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-bone sm:text-[3.2rem]">
            Créditos <span className="metal-text">infinitos</span>
            <br />
            na Lovable.
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-stone">
            Integração incluída no seu plano. Os sites que você entrega ao
            anfitrião saem sem consumir crédito seu.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="glass flex items-center gap-2 rounded-full px-4 py-2">
              <LogoMark className="size-4" />
              <span className="text-[0.85rem] text-bone">Nexofly</span>
            </span>
            <span className="text-stone/40" aria-hidden>
              ×
            </span>
            <span className="glass flex items-center gap-2 rounded-full px-4 py-2">
              <img src="/logos/lovable.svg" alt="" className="size-4" />
              <span className="text-[0.85rem] text-bone">Lovable</span>
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* passos */}
        <section className="glass rounded-2xl p-6 sm:p-7">
          <h2 className="font-display text-[1.15rem] font-semibold text-bone">
            Como ativar
          </h2>

          <ol className="mt-6 space-y-6">
            {PASSOS.map((p, i) => (
              <li key={p.n} className="relative flex gap-4">
                {i < PASSOS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-9 h-[calc(100%+0.75rem)] w-px bg-gradient-to-b from-white/20 to-transparent"
                  />
                )}
                <span className="metal-pill z-10 grid size-8 shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold text-[#08090B]">
                  {p.n}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-[0.95rem] font-medium text-bone">
                    {p.titulo}
                  </h3>
                  <p className="mt-1 text-[0.86rem] leading-relaxed text-stone">
                    {p.texto}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <button
            type="button"
            className="metal-pill mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-[0.92rem] font-semibold text-[#08090B] transition-transform hover:-translate-y-0.5"
          >
            <Download className="size-4" strokeWidth={2.2} />
            Baixar extensão
          </button>

          <p className="mt-3 text-center text-[0.78rem] text-stone">
            Compatível com Chrome, Edge e Brave
          </p>
        </section>

        <div className="space-y-5">
          <Chave />

          {/* tutorial */}
          <section className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2.5 border-b border-white/8 px-5 py-3.5">
              <Play className="size-3.5 text-stone" strokeWidth={2} />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                Tutorial em vídeo
              </span>
            </div>
            <div className="relative aspect-video bg-ink">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="grid size-12 place-items-center rounded-full border border-white/12 bg-white/[0.04]">
                  <Play className="size-4 text-stone" strokeWidth={2} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone/70">
                  Como instalar
                </span>
              </div>
              <video
                className="relative z-10 size-full object-cover"
                controls
                preload="none"
              >
                <source src="/videos/tutorial-extensao.mp4" type="video/mp4" />
              </video>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
