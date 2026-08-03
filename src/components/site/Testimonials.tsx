import { motion } from "framer-motion";
import { PawPrint, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const depoimentos = [
  {
    text: "Meu buldogue tinha crise de alergia toda semana. Trocaram a ração com calma, explicando cada ingrediente, e há oito meses ele não coça mais.",
    name: "Renata Camargo",
    role: "tutora do Nino",
    initials: "RC",
    tone: "bg-rose-pet/15 text-rose-pet",
  },
  {
    text: "Levo minha gata idosa e é o único lugar onde ela não fica estressada. Mandam foto durante o banho e devolvem no horário combinado, sempre.",
    name: "Paulo Menezes",
    role: "tutor da Mel",
    initials: "PM",
    tone: "bg-sky-pet/15 text-sky-pet",
  },
  {
    text: "Pedi ração às dez da manhã e entregaram antes do almoço, em casa. Atendimento de gente que conhece você pelo nome — e o seu cachorro também.",
    name: "Juliana Prado",
    role: "tutora do Tobi",
    initials: "JP",
    tone: "bg-leaf-pet/15 text-leaf-pet",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02]"
        >
          Quem confia, volta e indica
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {depoimentos.map((d, i) => (
            <motion.figure
              key={d.name}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="flex flex-col rounded-[1.75rem] bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift hairline"
            >
              <Quote className="size-7 text-primary/40" strokeWidth={1.6} />
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground/85">
                {d.text}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-foreground/8 pt-5">
                <span className={`grid size-11 place-items-center rounded-2xl font-display font-semibold ${d.tone}`}>
                  {d.initials}
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-sm font-semibold">{d.name}</span>
                  <span className="block text-xs text-muted-foreground">{d.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="px-5 pb-24 sm:px-6 sm:pb-32">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] gradient-warm grain px-6 py-16 text-primary-foreground shadow-glow sm:px-14 sm:py-20"
      >
        {[
          { top: "12%", left: "6%", size: 46, delay: 0 },
          { top: "62%", left: "16%", size: 30, delay: 0.6 },
          { top: "22%", left: "82%", size: 38, delay: 1.1 },
          { top: "72%", left: "72%", size: 26, delay: 1.6 },
        ].map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            initial={{ opacity: 0.18, y: 0 }}
            animate={{ opacity: [0.14, 0.28, 0.14], y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            className="pointer-events-none absolute hidden sm:block"
            style={{ top: p.top, left: p.left }}
          >
            <PawPrint size={p.size} strokeWidth={1.4} />
          </motion.span>
        ))}

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.03]">
            Seu pet merece um lugar onde é reconhecido pelo nome
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-primary-foreground/90">
            Chame a gente agora e receba uma avaliação nutricional gratuita na primeira visita à
            loja em Areal.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-9 h-14 rounded-full bg-secondary px-9 font-display text-base text-secondary-foreground hover:bg-secondary/90"
          >
            <a href="#contato">Entrar em contato</a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
