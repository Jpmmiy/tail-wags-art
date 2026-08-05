import { LogoMark } from "@/components/brand/logo";

/**
 * Assinatura da marca no hero.
 *
 * Duas armadilhas já resolvidas aqui, não reintroduza:
 *
 * 1. O wipe de entrada mora no wrapper, não no <h1>: aplicar clip-path no
 *    mesmo elemento que tem background-clip:text faz o navegador desenhar
 *    a caixa do elemento em vez de recortar nas letras.
 * 2. O rabo do "y" desce abaixo da caixa de conteúdo do <h1>, e com
 *    background-clip:text o gradiente só existe dentro dessa caixa — fora
 *    dela a letra fica sem pintura. Daí o padding-bottom (que estica a
 *    caixa do gradiente) anulado por margin-bottom negativa, para o
 *    descendente aparecer inteiro sem afrouxar o espaçamento. Pelo mesmo
 *    motivo o wrapper não pode ter overflow-hidden; quem mascara o wipe é
 *    o próprio clip-path, que já sangra 20% para baixo.
 */
export function Wordmark() {
  return (
    <div className="flex items-center gap-3.5 sm:gap-4">
      <span className="motion-safe:animate-rise">
        <LogoMark className="size-11 sm:size-[3.25rem]" />
      </span>

      <span className="inline-flex items-start motion-safe:animate-wipe-in">
        <h1 className="metal-text -mb-[0.2em] pb-[0.2em] font-display text-[3.2rem] font-semibold leading-[0.92] tracking-[-0.05em] sm:text-[4.1rem] lg:text-[4.9rem]">
          Nexofly
        </h1>
        <span
          aria-hidden
          className="ml-1.5 mt-1.5 text-[0.72rem] font-medium leading-none text-stone sm:text-[0.82rem]"
        >
          ®
        </span>
      </span>
    </div>
  );
}
