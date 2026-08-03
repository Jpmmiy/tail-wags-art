import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Cta } from "@/components/brand/cta";
import { Logo } from "@/components/brand/logo";

export function ChamadaFinal() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div
        aria-hidden
        className="window-light left-1/2 top-1/2 h-[30rem] w-[54rem] -translate-x-1/2 -translate-y-1/2"
      />
      <div aria-hidden className="blueprint absolute inset-0 opacity-30" />

      <Reveal className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <h2 className="font-display text-[2.8rem] font-semibold leading-[0.98] text-bone sm:text-[4.2rem]">
          Comece pela{" "}
          <span className="metal-text motion-safe:animate-metal-sweep">
            sua cidade.
          </span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-[1.05rem] leading-relaxed text-stone">
          Escolha um imóvel, responda o briefing e veja a primeira entrega ficar
          pronta.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Cta href="#planos" size="lg">
            Assinar a Nexofly
          </Cta>
          <span className="text-[0.85rem] text-stone">
            Acesso liberado na hora
          </span>
        </div>
      </Reveal>
    </section>
  );
}

const COLUNAS = [
  {
    titulo: "Plataforma",
    itens: [
      { rotulo: "Painel", href: "/painel" },
      { rotulo: "Nova entrega", href: "/painel/criar" },
      { rotulo: "Buscar imóveis", href: "/painel/imoveis" },
      { rotulo: "Mentor Nexofly", href: "/painel/mentor" },
    ],
  },
  {
    titulo: "Site",
    itens: [
      { rotulo: "Como funciona", href: "/#processo" },
      { rotulo: "Planos", href: "/#planos" },
      { rotulo: "Dúvidas", href: "/#duvidas" },
    ],
  },
  {
    titulo: "Legal",
    itens: [
      { rotulo: "Termos de uso", href: "#" },
      { rotulo: "Privacidade", href: "#" },
      { rotulo: "Reembolso", href: "#" },
    ],
  },
];

export function Rodape() {
  return (
    <footer className="border-t border-white/8 bg-ink-sunk">
      <div className="mx-auto max-w-[76rem] px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo markClassName="size-7" />
            <p className="mt-4 max-w-xs text-[0.88rem] leading-relaxed text-stone">
              A plataforma que transforma anúncio de temporada em serviço
              vendável.
            </p>
          </div>

          {COLUNAS.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo}>
              <p className="eyebrow">{col.titulo}</p>
              <ul className="mt-4 space-y-2.5">
                {col.itens.map((item) => (
                  <li key={item.rotulo}>
                    <Link
                      href={item.href}
                      className="text-[0.88rem] text-stone transition-colors hover:text-bone"
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/8 pt-6 text-[0.8rem] text-stone/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nexofly. Todos os direitos reservados.</p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em]">
            Feito para quem entrega
          </p>
        </div>
      </div>
    </footer>
  );
}
