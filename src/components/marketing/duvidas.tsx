import { Reveal } from "@/components/reveal";
import { DUVIDAS } from "@/lib/conteudo";

export function Duvidas() {
  return (
    <section id="duvidas" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[76rem] gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Dúvidas</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] text-bone sm:text-[3rem]">
            O que perguntam antes de assinar.
          </h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-stone">
            Sobrou dúvida? O Mentor responde dentro da plataforma, a qualquer
            hora.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-3">
            {DUVIDAS.map((d) => (
              <details
                key={d.p}
                className="glass specular group rounded-2xl px-5 py-4 transition-all duration-400 open:bg-white/[0.07]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1.02rem] font-medium text-bone transition-colors hover:text-chrome-hi [&::-webkit-details-marker]:hidden">
                  {d.p}
                  <span
                    aria-hidden
                    className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-white/12 text-stone transition-transform duration-300 group-open:rotate-45 group-open:border-chrome/40 group-open:text-chrome"
                  >
                    <svg viewBox="0 0 16 16" className="size-3" fill="none">
                      <path
                        d="M8 3.5v9M3.5 8h9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-10 text-[0.94rem] leading-relaxed text-stone">
                  {d.r}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
