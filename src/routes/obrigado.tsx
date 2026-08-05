import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/marketing/site-header";
import { Rodape } from "@/components/marketing/rodape";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TITULO = "Compra Confirmada | Nexofly";
const DESCRICAO = "Sua assinatura Nexofly foi liberada. Acesse agora sua conta.";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRICAO },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Obrigado,
});

function Obrigado() {
  const [copied, setCopied] = useState(false);

  const copyPassword = () => {
    navigator.clipboard.writeText("12345678");
    setCopied(true);
    toast.success("Senha copiada para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <SiteHeader />
      
      <main className="flex flex-1 items-center justify-center px-4 pt-24 pb-12">
        <div className="relative w-full max-w-[440px]">
          {/* Brilho de fundo */}
          <div className="absolute -inset-4 z-0 opacity-20 blur-3xl bg-chrome-mid rounded-full pointer-events-none" />
          
          <div className="glass relative z-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 text-center shadow-2xl md:p-10">
            {/* Ícone de Sucesso */}
            <div className="mx-auto mb-8 flex size-14 items-center justify-center rounded-full border border-chrome/30 bg-chrome/10 text-chrome shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Check className="size-7" />
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-bone md:text-4xl">
              Compra confirmada!
            </h1>
            
            <p className="mt-4 text-stone">
              Seu acesso à Nexofly foi liberado. Use os dados abaixo para entrar na plataforma.
            </p>

            <div className="mt-10 space-y-6 text-left">
              {/* E-mail de Compra */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.1em] text-stone/60 uppercase">
                  Seu e-mail de compra
                </label>
                <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 text-bone/80">
                  <div className="flex size-5 shrink-0 items-center justify-center opacity-40">
                    <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[0.93rem]">use o e-mail que você usou na compra</span>
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.1em] text-stone/60 uppercase">
                  Sua senha
                </label>
                <div className="group relative flex h-12 w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 text-bone">
                  <div className="flex size-5 shrink-0 items-center justify-center opacity-40">
                    <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-mono text-lg tracking-[0.2em]">12345678</span>
                  <button 
                    onClick={copyPassword}
                    className="ml-auto flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5 active:scale-95"
                    title="Copiar senha"
                  >
                    {copied ? <Check className="size-4 text-chrome" /> : <Copy className="size-4 opacity-40 group-hover:opacity-100" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[0.8rem] text-stone/60">
              Recomendamos trocar sua senha após o primeiro acesso, em <strong className="text-stone/80">Perfil → Segurança</strong>.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <a
                href="/painel"
                className={cn(
                  "metal-pill group flex h-[3.35rem] w-full items-center justify-center gap-2",
                  "rounded-full font-semibold text-[#08090B] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_16px_40px_-14px_rgba(255,255,255,0.3)]",
                  "transition-all hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_52px_-14px_rgba(255,255,255,0.38)]"
                )}
              >
                <span>Entrar na plataforma</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <p className="mt-6 text-[0.75rem] text-stone/40">
              O acesso é liberado somente para o <strong className="text-stone/60">e-mail da compra</strong>.
            </p>
          </div>
        </div>
      </main>

      <Rodape />
    </div>
  );
}
