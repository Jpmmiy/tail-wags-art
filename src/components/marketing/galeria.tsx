import CardFanCarousel, { type CardItem } from "@/components/ui/card-fan-carousel";
import { Reveal } from "@/components/reveal";

/**
 * Padrão visual em que a plataforma trabalha.
 * Substituir por fotos reais de entregas assim que existirem.
 */
const REFERENCIAS: CardItem[] = [
  {
    imgUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=560&h=980&fit=crop",
    alt: "Sala clara com sofá e luz natural entrando pela lateral",
    legenda: "Sala · luz natural",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=560&h=980&fit=crop",
    alt: "Sala de estar com poltrona e quadros na parede",
    legenda: "Estar · composição",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=560&h=980&fit=crop",
    alt: "Sala com poltronas e janela ampla para a varanda",
    legenda: "Sala · vista",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=560&h=980&fit=crop",
    alt: "Loft industrial com pé-direito alto e cozinha integrada",
    legenda: "Loft · pé-direito alto",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=560&h=980&fit=crop",
    alt: "Canto de leitura com poltrona branca e plantas",
    legenda: "Canto · leitura",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=560&h=980&fit=crop",
    alt: "Quarto claro com cabeceira estofada",
    legenda: "Quarto · enquadramento",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=560&h=980&fit=crop",
    alt: "Fachada de casa iluminada ao entardecer",
    legenda: "Fachada · entardecer",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=560&h=980&fit=crop",
    alt: "Ambiente interno com iluminação suave",
    legenda: "Interior · luz suave",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=560&h=980&fit=crop",
    alt: "Quarto minimalista com cama arrumada",
    legenda: "Quarto · minimalista",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=560&h=980&fit=crop",
    alt: "Área externa ao entardecer",
    legenda: "Externa · entardecer",
  },
];

export function Galeria() {
  return (
    <section id="padrao" className="relative scroll-mt-24 overflow-hidden py-24 lg:py-28">
      <div className="mx-auto max-w-[76rem] px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="glass inline-flex rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
            Padrão de imagem
          </span>
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] text-bone sm:text-[3.3rem]">
            O nível que a plataforma{" "}
            <span className="metal-text">persegue.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[1.02rem] leading-relaxed text-stone">
            É essa a referência de luz, arrumação e enquadramento em que a
            Nexofly trabalha. Passe o cursor para abrir o conjunto.
          </p>
        </Reveal>
      </div>

      <Reveal delay={120} className="mt-12">
        <CardFanCarousel cards={REFERENCIAS} />
      </Reveal>
    </section>
  );
}
