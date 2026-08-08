import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/painel/membros")({
  component: MembrosPage,
});

function MembrosPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-bone">
          Área de Membros
        </h1>
        <p className="mt-1 text-sm text-stone">
          Acesse os treinamentos exclusivos da Nexofly.
        </p>
      </header>

      <div className="glass rounded-2xl p-8 text-center max-w-2xl">
        <div className="glass-deep mx-auto grid size-16 place-items-center rounded-2xl">
          <GraduationCap className="size-8 text-chrome" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-bone">
          Nexofly Academy
        </h2>
        <p className="mt-2 text-stone">
          Tudo o que você precisa saber para escalar sua operação de marketing imobiliário.
        </p>
        
        <a 
          href="https://nexofly.memberkit.com.br" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 metal-pill px-8 py-3 font-semibold text-[#08090B] hover:-translate-y-0.5 transition-transform"
        >
          Acessar Treinamentos
          <ExternalLink className="size-4" />
        </a>
      </div>
    </div>
  );
}
