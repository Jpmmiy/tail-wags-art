import { motion } from "framer-motion";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const photos = [
  { img: g1, alt: "Cachorro sendo escovado no banho e tosa", caption: "Tosa do Nino, shih tzu", span: "sm:col-span-7" },
  { img: g2, alt: "Gato laranja descansando em cobertor", caption: "Mel depois do banho", span: "sm:col-span-5" },
  { img: g3, alt: "Veterinária examinando filhote sorridente", caption: "Check-up da Fifi", span: "sm:col-span-5" },
  { img: g4, alt: "Filhote de beagle brincando com corda", caption: "Primeira visita do Tobi", span: "sm:col-span-7" },
];

export function Gallery() {
  return (
    <section id="galeria" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
              Galeria
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02]">
              Nossos clientes de quatro patas
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Registros reais do dia a dia da loja — sem filtro pesado, sem cenário montado.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-12">
          {photos.map((p, i) => (
            <motion.figure
              key={p.caption}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 2) * 0.1 }}
              className={`group relative overflow-hidden rounded-[1.75rem] shadow-soft transition-shadow duration-300 hover:shadow-lift hairline ${p.span}`}
            >
              <img
                src={p.img}
                loading="lazy"
                width={900}
                height={900}
                alt={p.alt}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-card/90 px-4 py-1.5 text-xs font-bold text-foreground backdrop-blur">
                {p.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
