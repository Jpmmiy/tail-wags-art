"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ⚠️ NÚMEROS DE EXEMPLO.
 * Trocar por dados reais antes de publicar. É a única parte da página
 * que afirma algo sobre a base de usuários.
 */
const NUMEROS = [
  { valor: 1800, rotulo: "Assinantes ativos" },
  { valor: 6400, rotulo: "Imóveis atendidos" },
  {
    valor: 3.2,
    casas: 1,
    prefixo: "R$ ",
    sufixo: "mi",
    rotulo: "Faturado pelos assinantes",
  },
  { valor: 94, sufixo: "%", rotulo: "Entregas aprovadas de primeira" },
];

const DURACAO = 1900;

function useContador(alvo: number, casas: number, rodar: boolean) {
  const [n, setN] = useState(0);
  const [reduzido] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!rodar || reduzido) return;

    const inicio = performance.now();
    let raf = 0;
    const tick = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / DURACAO);
      // desaceleração forte: dispara e assenta, em vez de subir linear
      const eased = 1 - Math.pow(1 - t, 4);
      setN(Number((alvo * eased).toFixed(casas)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [alvo, casas, rodar, reduzido]);

  return reduzido ? alvo : n;
}

function Item({
  valor,
  casas = 0,
  prefixo = "",
  sufixo = "",
  rotulo,
  rodar,
  atraso,
}: {
  valor: number;
  casas?: number;
  prefixo?: string;
  sufixo?: string;
  rotulo: string;
  rodar: boolean;
  atraso: number;
}) {
  const n = useContador(valor, casas, rodar);

  return (
    <div
      style={{ transitionDelay: `${atraso}ms` }}
      className={cn(
        "group relative px-6 py-4 text-center transition-all duration-[900ms] ease-out",
        rodar ? "translate-y-0 opacity-100 blur-0" : "translate-y-5 opacity-0 blur-sm",
      )}
    >
      {/* nowrap: "R$ 3,2mi" quebrava em duas linhas e desalinhava a fila */}
      <p className="metal-text whitespace-nowrap font-display text-[2.4rem] font-semibold leading-none tracking-[-0.045em] tabular-nums sm:text-[2.9rem]">
        {prefixo}
        {n.toLocaleString("pt-BR", {
          minimumFractionDigits: casas,
          maximumFractionDigits: casas,
        })}
        {sufixo}
      </p>
      <p className="mt-3 text-[0.8rem] leading-snug text-stone">{rotulo}</p>
    </div>
  );
}

export function Numeros() {
  const [rodar, setRodar] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRodar(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-label="Números da plataforma"
      className="relative overflow-hidden py-20 lg:py-24"
    >
      {/* faixa de luz cruzando os números */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-40 w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.09),transparent_70%)] blur-2xl transition-opacity duration-1000",
          rodar ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={raiz}
        className="relative mx-auto grid max-w-[74rem] grid-cols-2 gap-y-10 px-5 lg:grid-cols-4 lg:gap-y-0 lg:px-8"
      >
        {NUMEROS.map((n, i) => (
          <div
            key={n.rotulo}
            className="relative lg:after:absolute lg:after:inset-y-3 lg:after:right-0 lg:after:w-px lg:after:bg-gradient-to-b lg:after:from-transparent lg:after:via-white/12 lg:after:to-transparent lg:last:after:hidden"
          >
            <Item {...n} rodar={rodar} atraso={i * 130} />
          </div>
        ))}
      </div>
    </section>
  );
}
