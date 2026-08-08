import { createFileRoute } from "@tanstack/react-router";
import { Check, Mail, Lock, Copy, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    title: "Compra Confirmada · Nexofly",
    meta: [
      { name: "description", content: "Seu acesso à Nexofly foi liberado. Use os dados abaixo para entrar na plataforma." },
      { property: "og:title", content: "Compra Confirmada · Nexofly" },
      { property: "og:description", content: "Seu acesso à Nexofly foi liberado. Use os dados abaixo para entrar na plataforma." },
      { property: "og:image", content: "https://www.nexoflyia.com/og-image.png" },
      { property: "og:url", content: "https://www.nexoflyia.com/obrigado" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Obrigado,
});

function Obrigado() {
  const [copied, setCopied] = useState(false);
  const password = "12345678";

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Senha copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#08090B] min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-[480px] bg-[#0F1115] border border-white/5 rounded-[32px] p-8 md:p-10 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping opacity-20" />
            <Check className="w-8 h-8 text-blue-500" />
          </div>

          <h1 className="text-bone text-4xl font-bold tracking-tight mb-3">
            Compra confirmada!
          </h1>
          
          <p className="text-stone/60 text-lg leading-relaxed mb-10">
            Seu acesso à Nexofly foi liberado. Use os dados abaixo para entrar na plataforma.
          </p>

          <div className="w-full space-y-6 text-left">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone/40 uppercase tracking-[2px] ml-1">
                Seu e-mail de compra
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-stone/30 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <div className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl flex items-center px-12 text-stone/80 text-[15px] font-medium italic">
                  use o e-mail que você usou na compra
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone/40 uppercase tracking-[2px] ml-1">
                Sua senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-stone/30 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <div className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl flex items-center px-12 text-bone text-lg font-mono tracking-widest">
                  {password}
                </div>
                <button 
                  onClick={handleCopy}
                  className="absolute inset-y-0 right-4 flex items-center text-stone/30 hover:text-bone transition-colors"
                  title="Copiar senha"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[13px] text-stone/40 leading-snug">
            Recomendamos trocar sua senha após o primeiro acesso, em <span className="text-bone/60 font-medium">Perfil → Segurança</span>.
          </p>

          <div className="w-full mt-10">
            <a
              href="/painel"
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              Entrar na plataforma
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="mt-8 text-[11px] font-medium text-stone/30 uppercase tracking-wider">
            O acesso é liberado <span className="text-stone/60">somente para o e-mail da compra</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
