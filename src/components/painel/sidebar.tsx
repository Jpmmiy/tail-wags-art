"use client";
import { Link } from "@/components/ui/link";
import { usePathname } from "@/components/ui/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Wand2,
  FolderKanban,
  Bot,
  GalleryVerticalEnd,
  Infinity as Infinito,
  Gift,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";


/** Agrupado por intenção: trabalhar, crescer, conta. */
const GRUPOS = [
  {
    titulo: "Trabalho",
    itens: [
      { href: "/painel", rotulo: "Painel", icone: LayoutDashboard },
      { href: "/painel/projetos", rotulo: "Meus Projetos", icone: FolderKanban },
      { href: "/painel/portfolio", rotulo: "Portfólio", icone: GalleryVerticalEnd },
    ],
  },
  {
    titulo: "Recursos",
    itens: [
      { href: "/painel/creditos", rotulo: "Créditos Nexofly", icone: Infinito },
      { href: "/painel/mentor", rotulo: "Mentor Nexofly", icone: Bot },
    ],
  },
  {
    titulo: "Conta",
    itens: [
      { href: "/painel/presente", rotulo: "Presente", icone: Gift },
      { href: "/painel/conta", rotulo: "Configurações", icone: Settings },
    ],
  },
];

function Conteudo({ aoNavegar }: { aoNavegar?: () => void }) {
  const caminho = usePathname();
  const { data: profile } = useQuery({
    queryKey: ['profile-sidebar'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      const { data } = await supabase.from("profiles").select("tier").eq("id", session.user.id).single();
      return data;
    }
  });

  const tier = profile?.tier || "gratuito";
  const labelPlano = tier === 'vitalicio' ? "Plano Vitalício" : tier === 'mensal' ? "Plano Mensal" : "Plano Gratuito";
  const labelCreditos = tier === 'vitalicio' ? "Créditos Infinitos" : "Créditos Limitados";
  const descPlano = tier === 'vitalicio' ? "Acesso liberado. Sem renovação." : tier === 'mensal' ? "Assinatura ativa." : "Acesso limitado.";

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link
        href="/"
        onClick={aoNavegar}
        aria-label="Nexofly, ir para o site"
        className="px-2 pt-2"
      >
        <Logo markClassName="size-6" className="[&>span:last-child]:text-lg" />
      </Link>

      <Link
        href="/painel/criar"
        onClick={aoNavegar}
        className="group relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl metal-pill text-[0.88rem] font-semibold text-[#08090B] shadow-[0_20px_40px_-12px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 active:scale-95"
      >
        <Wand2 className="size-4" strokeWidth={2.5} />
        Criar novo projeto
      </Link>


      <nav
        aria-label="Seções da plataforma"
        className="flex-1 space-y-5 overflow-y-auto"
      >
        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo}>
            <p className="px-3 pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-stone/55">
              {grupo.titulo}
            </p>
            <ul className="space-y-0.5">
              {grupo.itens.map((item) => {
                const Icone = item.icone;
                const rotulo = item.href === "/painel/creditos" ? labelCreditos : item.rotulo;
                const ativo =
                  item.href === "/painel"
                    ? caminho === "/painel"
                    : caminho.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={aoNavegar}
                      aria-current={ativo ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2 text-[0.86rem] transition-colors",
                        ativo
                          ? "bg-white/6 font-medium text-bone"
                          : "text-stone hover:bg-white/4 hover:text-bone",
                      )}
                    >
                      {ativo && (
                        <span
                          aria-hidden
                          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-chrome"
                        />
                      )}
                      <Icone
                        className={cn("size-4 shrink-0", ativo && "text-chrome")}
                        strokeWidth={1.8}
                      />
                      {rotulo}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="rounded-xl border border-chrome/20 bg-chrome/[0.06] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-chrome-hi">
          {labelPlano}
        </p>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-stone">
          {descPlano}
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      {/* desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/8 bg-sidebar lg:block">
        <Conteudo />
      </aside>

      {/* mobile */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/8 bg-ink/85 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" aria-label="Nexofly">
          <Logo markClassName="size-6" className="[&>span:last-child]:text-lg" />
        </Link>
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir menu"
          className="grid size-10 place-items-center rounded-lg border border-white/12 text-bone"
        >
          <Menu className="size-5" strokeWidth={1.8} />
        </button>
      </div>

      {aberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[280px] border-r border-white/8 bg-sidebar">
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg text-stone hover:text-bone"
            >
              <X className="size-5" strokeWidth={1.8} />
            </button>
            <Conteudo aoNavegar={() => setAberto(false)} />
          </div>
        </div>
      )}
    </>
  );
}
