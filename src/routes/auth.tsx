import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/logo";
import { ArrowLeft, Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/painel" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-6">
            <Logo />
          </Link>
          <h1 className="font-display text-3xl font-bold text-bone">
            {isLogin ? "Entrar na Nexofly" : "Criar sua conta"}
          </h1>
          <p className="mt-2 text-stone">
            {isLogin
              ? "Bem-back! Acesse seu painel agora."
              : "Comece a valorizar seus anúncios hoje."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="glass space-y-4 rounded-3xl p-6 sm:p-8">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone" htmlFor="name">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone/50" />
                <input
                  id="name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-white/12 bg-white/5 py-2.5 pl-10 pr-4 text-bone outline-none focus:border-chrome/50"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone" htmlFor="email">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone/50" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-white/12 bg-white/5 py-2.5 pl-10 pr-4 text-bone outline-none focus:border-chrome/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone/50" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/12 bg-white/5 py-2.5 pl-10 pr-4 text-bone outline-none focus:border-chrome/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="metal-pill mt-2 flex h-12 w-full items-center justify-center rounded-xl font-semibold text-[#08090B] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isLogin ? (
              "Entrar"
            ) : (
              "Criar Conta"
            )}
          </button>

          <div className="pt-2 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-stone hover:text-bone"
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Entre aqui"}
            </button>
          </div>
        </form>

        <Link
          to="/"
          className="mt-8 flex items-center justify-center gap-2 text-sm text-stone hover:text-bone"
        >
          <ArrowLeft className="size-4" />
          Voltar para o site
        </Link>
      </div>
    </div>
  );
}
