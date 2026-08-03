import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const horarios = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];

export function Booking() {
  const [horario, setHorario] = useState("09:30");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const tutor = new FormData(e.currentTarget).get("tutor");
    toast.success("Agendamento enviado!", {
      description: `Obrigado, ${tutor || "tutor"}. Confirmamos o horário das ${horario} pelo WhatsApp em poucos minutos.`,
    });
    e.currentTarget.reset();
  }

  return (
    <section id="agendamento" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-foreground">
              <CalendarCheck className="size-3.5" strokeWidth={2.2} />
              Agendamento on-line
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,5vw,3.4rem)] font-semibold leading-[1.03]">
              Escolha o dia. A gente cuida do resto.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Trabalhamos com agenda por horário marcado para que nenhum pet fique esperando em
              gaiola. Recebemos no máximo quatro animais por turno.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Clock, text: "Confirmação em até 15 minutos no WhatsApp" },
                { icon: PawPrint, text: "Lembrete um dia antes, com o nome do profissional" },
                { icon: CalendarCheck, text: "Remarcação livre até 3 horas antes do horário" },
              ].map((f) => (
                <li key={f.text} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                    <f.icon className="size-4" strokeWidth={1.9} />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/80">{f.text}</span>
                </li>
              ))}
            </ul>
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
                <Label htmlFor="tutor">Seu nome</Label>
                <Input id="tutor" name="tutor" required placeholder="Ana Beatriz" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pet">Nome do pet</Label>
                <Input id="pet" name="pet" required placeholder="Tobi" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">WhatsApp</Label>
                <Input id="tel" name="tel" required placeholder="(24) 90000-0000" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data desejada</Label>
                <Input id="data" name="data" type="date" required className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servico">Serviço</Label>
                <Select defaultValue="banho">
                  <SelectTrigger id="servico" className="h-12 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banho">Banho relaxante</SelectItem>
                    <SelectItem value="tosa">Tosa higiênica ou da raça</SelectItem>
                    <SelectItem value="nutricao">Consultoria de nutrição</SelectItem>
                    <SelectItem value="vacina">Vacinas e vermífugos</SelectItem>
                    <SelectItem value="checkup">Check-up preventivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <div className="flex flex-wrap gap-2">
                  {horarios.map((h) => (
                    <button
                      type="button"
                      key={h}
                      onClick={() => setHorario(h)}
                      className={`rounded-full px-3.5 py-2 text-sm font-bold transition-colors ${
                        horario === h
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-8 h-14 w-full rounded-full font-display text-base">
              Solicitar agendamento
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Sem cadastro e sem pagamento antecipado. Você confirma tudo pelo WhatsApp.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
