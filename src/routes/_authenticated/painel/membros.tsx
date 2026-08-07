import { createFileRoute } from "@tanstack/react-router";

import { GraduationCap, Lock, Bell } from "lucide-react";


const TRILHAS = [
  {
    titulo: "Primeira entrega",
    desc: "Do cadastro ao material na mão do anfitrião.",
    aulas: 6,
  },
  {
    titulo: "Encontrar e abordar",
    desc: "Como escolher a região certa e abrir conversa sem parecer venda.",
    aulas: 5,
  },
  {
    titulo: "Preço e negociação",
    desc: "Quanto cobrar, como responder objeção e quando não baixar.",
    aulas: 4,
  },
  {
    titulo: "Escala",
    desc: "Atender vários imóveis por semana sem perder o padrão.",
    aulas: 7,
  },
];

function Membros() {
  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(255,255,255,0.08),transparent_65%)]"
        />
        <div className="relative px-6 py-10 text-center sm:py-12">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
            <GraduationCap className="size-3.5" strokeWidth={2} />
            Em breve
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-bone sm:text-[3rem]">
            Aulas gravadas,{" "}
            <span className="metal-text">sem custo nenhum.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-stone">
            Estamos gravando a formação completa do método. Entra no seu plano
            sem cobrança extra assim que ficar pronta.
          </p>
        </div>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {TRILHAS.map((t, i) => (
          <li
            key={t.titulo}
            style={{ animationDelay: `${i * 80}ms` }}
            className="glass relative overflow-hidden rounded-2xl p-6 motion-safe:animate-rise"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-display text-[1.1rem] font-semibold text-bone">
                  {t.titulo}
                </h2>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-stone">
                  {t.desc}
                </p>
              </div>
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/6 text-stone">
                <Lock className="size-4" strokeWidth={1.8} />
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                {t.aulas} aulas previstas
              </span>
              <span className="rounded-md bg-white/6 px-2 py-1 text-[0.72rem] text-stone">
                Gravando
              </span>
            </div>
          </li>
        ))}
      </ul>

      <section className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/6 text-bone">
            <Bell className="size-4" strokeWidth={1.9} />
          </span>
          <div>
            <p className="text-[0.95rem] font-medium text-bone">
              Avisamos quando a primeira trilha subir
            </p>
            <p className="text-[0.82rem] text-stone">
              Vai para o e-mail cadastrado na sua conta.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-jade/14 px-3.5 py-1.5 text-[0.78rem] font-medium text-jade">
          Aviso já ativado
        </span>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/painel/membros")({
  head: () => ({
    meta: [
      { title: "Área de membros · Nexofly" },
      { name: "description", content: "Área de membros na plataforma Nexofly." },
      { property: "og:title", content: "Área de membros · Nexofly" },
      { property: "og:description", content: "Área de membros na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Membros,
});
