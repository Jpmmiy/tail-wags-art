import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/logo";
import { ArrowLeft, Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: AuthPage,
});


function AuthPage() {
  const isLogin = true;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { redirect: redirectUrl } = Route.useSearch();

  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito de brilho que segue o cursor (padrão Nexofly)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty("--mx", `${x}px`);
      containerRef.current.style.setProperty("--my", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    console.log("Iniciando processo de autenticação para:", email);

    try {
      if (isLogin) {
        console.log("Chamando signInWithPassword...");
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error("Erro no Supabase auth:", error);
          throw error;
        }

        console.log("Login realizado com sucesso. Dados retornados:", data);
        
        if (!data.session) {
          console.error("Sessão não retornada após login bem-sucedido");
          throw new Error("Sessão não iniciada. Verifique suas credenciais.");
        }

        toast.success("Bem-vindo de volta!");
        
        const targetUrl = redirectUrl || "/painel";
        console.log("Redirecionando para:", targetUrl);
        
        // Garante que o estado persistiu antes de mudar de página
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 100);

      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      }
    } catch (error: any) {
      console.error("Catch handleAuth:", error);
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="blueprint relative flex min-h-screen items-center justify-center bg-ink p-4 selection:bg-chrome/30"
    >
      {/* Luz ambiente Nexofly */}
      <div className="window-light -top-24 -left-24 size-[600px] opacity-40" />
      <div className="window-light -bottom-48 -right-48 size-[800px] opacity-20" />

      <div className="relative z-10 w-full max-w-[420px] animate-rise">
        <div className="mb-10 text-center">
          <Link to="/" className="group inline-flex flex-col items-center gap-4">
            <div className="glass flex size-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
              <Logo markClassName="size-8" className="gap-0" />
            </div>
          </Link>
          
          <h1 className="mt-8 font-display text-4xl font-bold tracking-tight text-bone">
            {isLogin ? "Bem-vindo de volta" : "Comece sua jornada"}
          </h1>
          <p className="mt-3 text-stone">
            {isLogin
              ? "Acesse sua conta para gerenciar seus projetos."
              : "Crie sua conta Nexofly em poucos segundos."}
          </p>
        </div>

        <div className="glass-deep group/card relative overflow-hidden rounded-[2.5rem] p-8 sm:p-10">
          {/* Brilho interativo na borda */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{
              background: `radial-gradient(400px circle at var(--mx) var(--my), rgba(255,255,255,0.08), transparent 80%)`
            }}
          />

          <form onSubmit={handleAuth} className="relative space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="eyebrow ml-1" htmlFor="name">
                  Nome completo
                </label>
                <div className="group relative">
                  <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/40 transition-colors group-focus-within:text-chrome" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Como devemos te chamar?"
                    className="w-full rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 pl-11 pr-4 text-bone placeholder:text-stone/30 outline-none transition-all focus:border-chrome/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-chrome/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="eyebrow ml-1" htmlFor="email">
                E-mail profissional
              </label>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/40 transition-colors group-focus-within:text-chrome" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@empresa.com"
                  className="w-full rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 pl-11 pr-4 text-bone placeholder:text-stone/30 outline-none transition-all focus:border-chrome/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-chrome/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="eyebrow" htmlFor="password">
                  Senha
                </label>
                {isLogin && (
                  <button type="button" className="text-[11px] font-medium text-stone hover:text-chrome transition-colors">
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone/40 transition-colors group-focus-within:text-chrome" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 pl-11 pr-12 text-bone placeholder:text-stone/30 outline-none transition-all focus:border-chrome/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-chrome/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone/40 hover:text-bone transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "metal-pill group relative mt-4 flex h-14 w-full items-center justify-center rounded-2xl font-bold text-[#08090B] transition-all active:scale-[0.98] disabled:opacity-50",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_12px_24px_-8px_rgba(255,255,255,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_20px_32px_-8px_rgba(255,255,255,0.3)]"
              )}
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Entrar na plataforma" : "Criar minha conta"}
                </span>
              )}
              {/* Varredura de brilho no botão */}
              <div className="absolute inset-y-0 -left-1/2 w-1/3 bg-white/40 blur-md transition-all duration-1000 group-hover:left-[150%]" />
            </button>

            <div className="pt-4 text-center">
            </div>
          </form>
        </div>

        <Link
          to="/"
          className="mt-10 flex items-center justify-center gap-2 text-sm font-medium text-stone transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-4" />
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}