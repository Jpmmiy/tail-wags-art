import { Cta, CtaGhost } from "@/components/brand/cta";
import { LiquidBackdrop, MetalBlob } from "@/components/liquid/backdrop";
import { PointerLight } from "@/components/liquid/pointer";
import { ProducaoLive } from "./producao-live";
import { Wordmark } from "./wordmark";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-20 lg:pt-32">
      <LiquidBackdrop />
      <div aria-hidden className="blueprint absolute inset-0 opacity-25" />

      <MetalBlob
        className="absolute -right-[24%] top-[2%] size-[36rem] opacity-[0.12] blur-3xl lg:-right-[14%] lg:size-[48rem] lg:opacity-[0.16]"
        speed={26}
      />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-ink/70 to-ink"
      />

      <PointerLight className="relative mx-auto max-w-[80rem] px-5 lg:px-8">
        {/* items-center: a coluna de texto é bem mais curta que o painel;
            alinhada ao topo, deixava um vazio grande embaixo. */}
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div>
            <Wordmark />

            <p className="mt-7 max-w-md text-[1.02rem] leading-[1.65] text-stone motion-safe:animate-rise motion-safe:[animation-delay:480ms] sm:text-[1.1rem]">
              A plataforma que cuida do material que valoriza um anúncio de
              temporada. Você escolhe o imóvel e acompanha a entrega ficar
              pronta.
            </p>

            <div className="mt-8 flex flex-col gap-3 motion-safe:animate-rise motion-safe:[animation-delay:560ms] sm:flex-row sm:items-center">
              <Cta href="#planos" size="lg">
                Assinar agora
                <svg viewBox="0 0 20 20" className="size-4" fill="none">
                  <path
                    d="M4 10h11m0 0-4.2-4.2M15 10l-4.2 4.2"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Cta>
              <CtaGhost href="#processo" size="lg">
                Ver como funciona
              </CtaGhost>
            </div>
          </div>

          <div className="relative motion-safe:animate-rise motion-safe:[animation-delay:340ms]">
            <MetalBlob
              className="absolute -inset-10 -z-10 opacity-20 blur-3xl"
              speed={30}
            />
            <ProducaoLive />
          </div>
        </div>
      </PointerLight>
    </section>
  );
}
