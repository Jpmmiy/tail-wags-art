import { motion } from "framer-motion";
import {
  Bath,
  Bone,
  HeartPulse,
  Scissors,
  Sparkles,
  Stethoscope,
  Truck,
} from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const services = [
  {
    icon: Bath,
    tone: "bg-sky-pet/15 text-sky-pet",
    title: "Banho relaxante",
    desc: "Produtos hipoalergênicos, água na temperatura certa e secagem sem soprador barulhento. Pets idosos e filhotes têm horário exclusivo.",
    tag: "a partir de R$ 55",
  },
  {
    icon: Scissors,
    tone: "bg-rose-pet/15 text-rose-pet",
    title: "Tosa higiênica e da raça",
    desc: "Tosa feita à mão por profissionais que respeitam o padrão da raça — e o tempo de paciência do seu pet.",
    tag: "a partir de R$ 70",
  },
  {
    icon: Bone,
    tone: "bg-primary/15 text-primary",
    title: "Consultoria de nutrição",
    desc: "Avaliamos peso, idade, castração e rotina para montar a porção diária ideal. Sem empurrar marca, sem achismo.",
    tag: "avaliação gratuita",
  },
  {
    icon: Stethoscope,
    tone: "bg-leaf-pet/15 text-leaf-pet",
    title: "Vacinas e vermífugos",
    desc: "Calendário vacinal completo com carteirinha digital e lembrete por WhatsApp para você nunca perder a data.",
    tag: "com médico veterinário",
  },
  {
    icon: HeartPulse,
    tone: "bg-lavender-pet/15 text-lavender-pet",
    title: "Check-up preventivo",
    desc: "Pesagem, avaliação de pelagem, dentes, ouvidos e escore corporal. Um retrato honesto da saúde do seu companheiro.",
    tag: "30 minutos",
  },
  {
    icon: Truck,
    tone: "bg-sun-pet/20 text-accent-foreground",
    title: "Leva e traz + entrega",
    desc: "Buscamos seu pet em casa e entregamos ração no mesmo dia em Areal e distritos vizinhos, sem taxa acima de R$ 150.",
    tag: "Areal e região",
  },
];

export function Services() {
  return (
    <section id="servicos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
              <Sparkles className="size-3.5" strokeWidth={2.2} />
              Serviços
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02]">
              Cuidado completo, do focinho ao rabinho
            </h2>
          </div>
          <p className="text-muted-foreground lg:col-span-5 lg:pb-3">
            Cada serviço tem um responsável com nome e rosto. Você recebe fotos durante o
            atendimento e um resumo do que foi observado no seu pet naquele dia.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group rounded-[1.75rem] bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift hairline"
            >
              <span className={`grid size-12 place-items-center rounded-2xl ${s.tone}`}>
                <s.icon className="size-6" strokeWidth={1.6} />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <span className="mt-6 inline-block rounded-full bg-muted px-3 py-1 text-xs font-bold text-foreground/70">
                {s.tag}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
