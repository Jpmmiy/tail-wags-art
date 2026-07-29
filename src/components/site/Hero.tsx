import { motion } from "framer-motion";
import { ArrowRight, MapPin, PawPrint, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPets from "@/assets/hero-pets.jpg";
import { CountUp } from "./CountUp";
import { BUSINESS } from "./data";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stats = [
  { value: 4200, suffix: "+", label: "Pets atendidos" },
  { value: 12, suffix: " anos", label: "Cuidando de Areal" },
  { value: 98, suffix: "%", label: "Tutores que voltam" },
];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden gradient-soft grain">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 size-[420px] rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 size-[380px] rounded-full bg-sky-pet/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-32 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-44">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-6 xl:col-span-6"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground shadow-soft hairline"
          >
            <PawPrint className="size-3.5" strokeWidth={2.2} />
            {BUSINESS.slogan}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display font-semibold leading-[0.95] text-[clamp(2.9rem,7.5vw,6rem)]"
          >
            Nutrição de verdade
            <br />
            para quem <span className="text-gradient-warm">late, mia</span>
            <br />e ama sem medida.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Somos um pet shop de bairro em Areal com alma de clínica: rações selecionadas por
            nutricionista, banho &amp; tosa sem estresse e acompanhamento próximo de cada
            recomendação que fazemos. Você chega com dúvida, sai com um plano.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-14 rounded-full px-8 font-display text-base">
              <a href="#contato">
                Entrar em contato
                <ArrowRight className="ml-1 size-5" strokeWidth={2} />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-foreground/15 bg-card px-8 font-display text-base hover:bg-accent"
            >
              <a href="#agendamento">Agendar banho e tosa</a>
            </Button>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-foreground/10 pt-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="whitespace-nowrap font-display text-[clamp(1.35rem,3.6vw,2.4rem)] font-semibold leading-none tabular-nums">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dt>
                <dd className="mt-2 text-xs leading-snug text-muted-foreground sm:text-sm">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="relative lg:col-span-6 lg:col-start-7"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-lift hairline">
            <img
              src={heroPets}
              width={1200}
              height={1408}
              alt="Cachorro golden retriever e cachorrinho branco felizes no pet shop"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/5] lg:aspect-[4/5]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
            className="absolute -left-2 top-8 flex items-center gap-2.5 rounded-2xl bg-card/95 px-4 py-3 shadow-lift backdrop-blur hairline sm:left-6"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-leaf-pet/15 text-leaf-pet">
              <ShieldCheck className="size-5" strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold">Nutrição orientada</span>
              <span className="block text-xs text-muted-foreground">Indicação por porte e idade</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}
            className="absolute -right-2 bottom-10 flex items-center gap-2.5 rounded-2xl bg-card/95 px-4 py-3 shadow-lift backdrop-blur hairline sm:right-4"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-sun-pet/20 text-accent-foreground">
              <Star className="size-5" strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold">4,9 de avaliação</span>
              <span className="block text-xs text-muted-foreground">312 tutores da região</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
            className="absolute bottom-[-18px] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-secondary-foreground shadow-lift"
          >
            <MapPin className="size-4" strokeWidth={1.8} />
            <span className="whitespace-nowrap text-xs font-semibold">Areal · Rio de Janeiro</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
