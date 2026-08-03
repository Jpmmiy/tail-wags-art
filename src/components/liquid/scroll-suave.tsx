"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Altura do cabeçalho fixo — o alvo precisa parar abaixo dele. */
const CABECALHO = 72;

/**
 * Amortece a rolagem. O valor de `lerp` é o que dá o peso: mais baixo,
 * mais lento e mais pesado. Desliga sozinho em prefers-reduced-motion,
 * onde rolagem interpolada atrapalha em vez de ajudar.
 */
export function ScrollSuave() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const frame = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    /*
     * Com o Lenis no comando, o salto nativo de âncora não acontece: o
     * navegador move o scroll e o Lenis o traz de volta para a posição que
     * ele mesmo controla, no quadro seguinte. Então os links internos
     * precisam pedir a rolagem a ele.
     */
    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const alvo = document.querySelector(href);
      if (!alvo) return;

      e.preventDefault();
      lenis.scrollTo(alvo as HTMLElement, { offset: -CABECALHO });
      // Mantém o endereço compartilhável sem disparar o salto do navegador.
      history.replaceState(null, "", href);
    };

    document.addEventListener("click", aoClicar);

    return () => {
      document.removeEventListener("click", aoClicar);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
