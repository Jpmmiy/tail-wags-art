import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Lock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/painel/premiacoes")({
  component: PremiacoesPage,
});

const NIVEIS = [
  { valor: "R$ 10k", premio: "Placa de Bronze", atingido: false },
  { valor: "R$ 50k", premio: "Placa de Prata", atingido: false },
  { valor: "R$ 100k", premio: "Placa de Ouro", atingido: false },
];

function PremiacoesPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-bone">
          Premiações
        </h1>
        <p className="mt-1 text-sm text-stone">
          Reconhecemos o seu crescimento na jornada Nexofly.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {NIVEIS.map((n) => (
          <div key={n.valor} className="glass group relative overflow-hidden rounded-2xl p-6 transition-all hover:bg-white/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-stone">Nível {n.valor}</span>
              <Lock className="size-4 text-stone/40" />
            </div>
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="glass-deep grid size-12 place-items-center rounded-xl opacity-50 group-hover:opacity-100 transition-opacity">
                <Trophy className="size-6 text-stone" />
              </div>
              <h3 className="mt-4 font-semibold text-bone">{n.premio}</h3>
              <p className="mt-1 text-xs text-stone">Faturamento acumulado</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl border-chrome/20 bg-chrome/[0.03] p-6 text-center">
        <p className="text-sm text-stone">
          O seu faturamento atual está sendo processado. As metas são baseadas nos projetos finalizados e pagos via plataforma.
        </p>
      </div>
    </div>
  );
}
