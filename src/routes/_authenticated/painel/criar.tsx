import { createFileRoute, Link } from "@tanstack/react-router";
import { Quiz } from "@/components/painel/quiz";
import { Folder } from "lucide-react";

const TITULO = "Quiz · Nexofly";
const DESCRICAO = "Gere materiais de marketing para imóveis.";

export const Route = createFileRoute("/_authenticated/painel/criar")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
    ],
  }),
  component: CriarPage,
});

function CriarPage() {
  return (
    <main className="min-h-screen bg-ink">
      <nav className="fixed right-6 top-6 z-50 flex gap-3">
        <Link 
          to="/projetos" 
          className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-bone transition-all hover:rim-lit"
        >
          <Folder className="size-4" /> Meus Projetos
        </Link>
      </nav>
      <div className="mx-auto max-w-4xl p-6 sm:p-12">
        <Quiz />
      </div>
    </main>
  );
}
