/* eslint-disable @next/next/no-img-element */

/**
 * Patrocinadores. As marcas ficam em /public/logos como SVG branco
 * sobre transparente — trocar o arquivo troca a logo, sem mexer aqui.
 */
const MARCAS = [
  { nome: "Airbnb", arquivo: "/logos/airbnb.svg" },
  { nome: "Nano Banana Pro", arquivo: "/logos/nano-banana.svg" },
  { nome: "Sora", arquivo: "/logos/sora.svg" },
  { nome: "Lovable", arquivo: "/logos/lovable.svg" },
];

const REPETICOES = 4;

export function Ferramentas() {
  const fila = Array.from({ length: REPETICOES }, () => MARCAS).flat();

  return (
    <section
      aria-label="Parceiros oficiais"
      className="relative border-y border-white/8 bg-ink-sunk/50 py-8"
    >
      <div className="mx-auto flex max-w-[76rem] flex-col gap-6 px-5 sm:flex-row sm:items-center sm:gap-12 lg:px-8">
        <p className="eyebrow shrink-0">Parceiros oficiais</p>

        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
          <ul className="flex w-max items-center gap-16 motion-safe:animate-drift">
            {fila.map((m, i) => (
              <li
                key={`${m.nome}-${i}`}
                aria-hidden={i >= MARCAS.length}
                className="flex shrink-0 items-center gap-3 text-bone/70 transition-colors duration-300 hover:text-bone"
              >
                <img
                  src={m.arquivo}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 shrink-0 opacity-90"
                />
                <span className="whitespace-nowrap text-[1.02rem] font-medium tracking-[-0.01em]">
                  {m.nome}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
