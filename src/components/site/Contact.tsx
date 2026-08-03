import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { Clock3, Dog, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS, NAV, WHATSAPP_LINK } from "./data";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export function Contact() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Mensagem enviada!", {
      description: "Nossa equipe responde no mesmo dia, de segunda a sábado.",
    });
    e.currentTarget.reset();
  }

  return (
    <section id="contato" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-5"
          >
            <span className="inline-flex rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
              Contato
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,5vw,3.4rem)] font-semibold leading-[1.03]">
              Vamos conversar sobre o seu pet
            </h2>
            <p className="mt-5 text-muted-foreground">
              Dúvida sobre ração, horário de banho ou entrega em casa? Fale direto com quem atende
              na loja — nada de robô.
            </p>

            <div className="mt-10 space-y-3">
              {[
                { icon: MapPin, label: "Endereço", value: BUSINESS.address },
                { icon: Phone, label: "Telefone", value: BUSINESS.phone, href: `tel:${BUSINESS.phoneDigits}` },
                { icon: Mail, label: "E-mail", value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
                {
                  icon: Clock3,
                  label: "Horário",
                  value: "Consulte a disponibilidade da semana pelo WhatsApp",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-soft hairline"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                    <c.icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </p>
                    {c.href ? (
                      <a href={c.href} className="mt-1 block font-semibold hover:text-primary">
                        {c.value}
                      </a>
                    ) : (
                      <p className="mt-1 font-semibold leading-snug">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="mt-6 h-13 w-full rounded-full border-foreground/15 bg-card py-3.5 font-display hover:bg-accent"
            >
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-1 size-5" strokeWidth={1.8} />
                Chamar no WhatsApp
              </a>
            </Button>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-[2rem] bg-card p-6 shadow-lift hairline sm:p-9 lg:col-span-7"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-nome">Nome</Label>
                <Input id="c-nome" required placeholder="Como podemos te chamar?" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-tel">Telefone</Label>
                <Input id="c-tel" required placeholder="(24) 90000-0000" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="c-email">E-mail</Label>
                <Input id="c-email" type="email" required placeholder="voce@email.com" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="c-msg">Mensagem</Label>
                <Textarea
                  id="c-msg"
                  required
                  rows={5}
                  placeholder="Conte um pouco sobre o seu pet: porte, idade e o que você precisa."
                  className="rounded-2xl"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-8 h-14 w-full rounded-full font-display text-base">
              Enviar mensagem
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="gradient-ink grain text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-2xl gradient-warm text-primary-foreground">
                <Dog className="size-5" strokeWidth={1.8} />
              </span>
              <span className="font-display text-lg font-semibold">{BUSINESS.short}</span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-secondary-foreground/70">
              {BUSINESS.slogan}. Pet shop, nutrição e cuidado veterinário no coração de Areal, no
              Rio de Janeiro.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-secondary-foreground/60">
              Navegação
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-secondary-foreground/80 transition-colors hover:text-primary">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-secondary-foreground/60">
              Serviços
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-secondary-foreground/80">
              <li>Banho relaxante</li>
              <li>Tosa higiênica e da raça</li>
              <li>Consultoria de nutrição</li>
              <li>Vacinas e vermífugos</li>
              <li>Leva e traz + entrega</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-secondary-foreground/60">
              Onde estamos
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-secondary-foreground/80">
              {BUSINESS.address}
            </p>
            <a
              href={`tel:${BUSINESS.phoneDigits}`}
              className="mt-4 block font-display text-lg font-semibold transition-colors hover:text-primary"
            >
              {BUSINESS.phone}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-secondary-foreground/12 pt-7 text-xs text-secondary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BUSINESS.name}. Todos os direitos reservados.</p>
          <p>Feito com carinho para tutores de Areal e região.</p>
        </div>
      </div>
    </footer>
  );
}
