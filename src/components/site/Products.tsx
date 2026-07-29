import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import racao from "@/assets/prod-racao.jpg";
import petisco from "@/assets/prod-petisco.jpg";
import higiene from "@/assets/prod-higiene.jpg";
import brinquedo from "@/assets/prod-brinquedo.jpg";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const products = [
  {
    img: racao,
    chip: "Ração",
    name: "Super premium adulto 15kg",
    desc: "Proteína de frango como primeiro ingrediente, sem corantes. Rende cerca de 60 dias para cães de médio porte.",
    price: "R$ 289,90",
  },
  {
    img: petisco,
    chip: "Petiscos",
    name: "Biscoitos naturais de batata-doce",
    desc: "Assados sem açúcar nem conservantes. Perfeitos para treino de comando e reforço positivo.",
    price: "R$ 24,90",
  },
  {
    img: higiene,
    chip: "Higiene",
    name: "Kit shampoo neutro + escova",
    desc: "pH balanceado para pele sensível, com escova de cerdas macias que não repuxa o subpelo.",
    price: "R$ 79,90",
  },
  {
    img: brinquedo,
    chip: "Brinquedos",
    name: "Trio de cordas e mordedores",
    desc: "Algodão trançado resistente que ajuda na limpeza dos dentes enquanto gasta energia.",
    price: "R$ 49,90",
  },
];

export function Products() {
  return (
    <section id="produtos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl"
        >
          <span className="inline-flex rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
            Produtos
          </span>
          <h2 className="mt-5 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02]">
            O que a gente vende, a gente daria ao próprio pet
          </h2>
          <p className="mt-5 text-muted-foreground">
            Curadoria enxuta e honesta: poucas marcas, todas testadas na loja. Se algo não cair bem
            para o seu animal, trocamos o produto sem burocracia em até 15 dias.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <motion.article
              key={p.name}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-card shadow-soft transition-shadow duration-300 hover:shadow-lift hairline"
            >
              <div className="relative overflow-hidden bg-muted">
                <img
                  src={p.img}
                  loading="lazy"
                  width={800}
                  height={800}
                  alt={p.name}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground backdrop-blur">
                  {p.chip}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold leading-snug">{p.name}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="font-display text-xl font-semibold">{p.price}</span>
                  <Button
                    asChild
                    size="icon"
                    className="size-10 shrink-0 rounded-full"
                    aria-label={`Pedir ${p.name}`}
                  >
                    <a href="#contato">
                      <Plus className="size-5" strokeWidth={2} />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
