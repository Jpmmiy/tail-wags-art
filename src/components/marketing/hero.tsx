"use client";

import { useState } from "react";
import { Search, MapPin, Sparkles, Building2, Flame, ArrowRight, User, Check, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidBackdrop, MetalBlob } from "@/components/liquid/backdrop";
import { PointerLight } from "@/components/liquid/pointer";
import { Wordmark } from "./wordmark";
import { Reveal } from "@/components/reveal";
import { Cta, CtaGhost } from "@/components/brand/cta";
import { PAISES, cidadesDe, regioesDe } from "@/lib/locais";
import type { ImovelEncontrado } from "@/lib/imoveis-tipos";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { ProducaoLive } from "./producao-live";

export function Hero() {
  const [paisId, setPaisId] = useState("BR");
  const [regiaoId, setRegiaoId] = useState("");
  const [cidade, setCidade] = useState("");

  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<ImovelEncontrado[]>([]);
  const [emailGateOpen, setEmailGateOpen] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState<ImovelEncontrado | null>(null);
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const navigate = useNavigate();

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cidade) return;
    setBuscando(true);
    try {
      const r = await fetch("/api/imoveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modalidade: "temporada", pais: paisId, regiao: regiaoId, cidade }),
      });
      const d = await r.json();
      if (!r.ok) {
        toast.error(d.erro || "Erro ao buscar imóveis.");
        return;
      }
      setResultados(d.imoveis ?? []);
      if (d.imoveis?.length > 0) {
        setTimeout(() => {
          document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        toast.error("Nenhum imóvel encontrado nesta cidade.");
      }
    } catch (err) {
      toast.error("Erro inesperado ao buscar imóveis.");
    } finally {
      setBuscando(false);
    }
  };

  const handleUseImovel = (imovel: ImovelEncontrado) => {
    setSelectedImovel(imovel);
    setEmailGateOpen(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoadingEmail(true);
    try {
      localStorage.setItem("nexofly_temp_email", email);
      localStorage.setItem("nexofly_temp_imovel", JSON.stringify({ ...selectedImovel, paisId, regiaoId, cidade }));
      navigate({ to: "/painel/criar" });
    } catch (err) {
      toast.error("Erro ao processar e-mail.");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-32 lg:pt-40">
      <LiquidBackdrop />
      <div aria-hidden className="blueprint absolute inset-0 opacity-25" />

      <MetalBlob
        className="absolute -right-[24%] top-[2%] size-[36rem] opacity-[0.12] blur-3xl lg:-right-[14%] lg:size-[48rem] lg:opacity-[0.16]"
        speed={26}
      />

      <div className="relative mx-auto max-w-[80rem] px-5 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Wordmark />
            <h1 className="mt-8 max-w-4xl font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-bone sm:text-6xl lg:text-7xl">
              Venda marketing para imóveis <br className="hidden sm:block" />
              <span className="metal-text">com inteligência real.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-stone sm:text-lg">
              Encontre oportunidades com Score de Oportunidade e receba todo o material de abordagem pronto em segundos.
            </p>
          </Reveal>

          <Reveal delay={200} className="mt-10 w-full max-w-2xl">
            <div className="glass group relative flex flex-col gap-4 rounded-3xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* País */}
                <div className="space-y-1.5 text-left">
                  <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-stone px-1">
                    <Globe className="size-3" /> País
                  </label>
                  <select 
                    value={paisId}
                    onChange={(e) => {
                      setPaisId(e.target.value);
                      setRegiaoId("");
                      setCidade("");
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 appearance-none cursor-pointer"
                  >
                    {PAISES.map(p => (
                      <option key={p.id} value={p.id} className="bg-ink">{p.bandeira} {p.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                {regioesDe(paisId).length > 0 && (
                  <div className="space-y-1.5 text-left">
                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-stone px-1">
                      <MapPin className="size-3" /> Estado
                    </label>
                    <select 
                      value={regiaoId}
                      onChange={(e) => {
                        setRegiaoId(e.target.value);
                        setCidade("");
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-ink">Selecione...</option>
                      {regioesDe(paisId).map(r => (
                        <option key={r.id} value={r.id} className="bg-ink">{r.nome}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Cidade */}
                <div className="space-y-1.5 text-left">
                  <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-stone px-1">
                    <Building2 className="size-3" /> Cidade
                  </label>
                  {cidadesDe(paisId, regiaoId).length > 0 ? (
                    <select 
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-ink">Selecione...</option>
                      {cidadesDe(paisId, regiaoId).map(c => (
                        <option key={c} value={c} className="bg-ink">{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      value={cidade} 
                      onChange={e => setCidade(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50" 
                      placeholder="Nome da cidade..." 
                    />
                  )}
                </div>
              </div>

              <button
                onClick={buscar}
                disabled={buscando || !cidade}
                className="metal-pill flex h-14 items-center justify-center gap-2 rounded-2xl px-8 font-bold text-black transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-chrome/10"
              >
                {buscando ? (
                  <Sparkles className="size-4 animate-spin" />
                ) : (
                  <>
                    Buscar imóveis em {cidade || '...'} <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Cta href="#planos" size="lg">
                Assinar agora
                <ArrowRight className="size-4" />
              </Cta>
              <CtaGhost href="#processo" size="lg">
                Ver como funciona
              </CtaGhost>
            </div>
          </Reveal>
        </div>

        {resultados.length > 0 && (
          <div id="resultados" className="mt-24 space-y-10 scroll-mt-24">
            <div className="flex flex-col items-center text-center">
              <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">
                Oportunidades em {cidade}
              </h2>
              <p className="mt-2 text-stone">
                {resultados.length} imóveis encontrados · {resultados.filter(r => r.score?.faixa === 'ALTA').length} com oportunidade alta
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((im, i) => (
                <Reveal key={im.id} delay={i * 50}>
                  <div className="glass group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] p-6 transition-all hover:rim-lit">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="line-clamp-1 text-[1.05rem] font-medium text-bone">{im.nome}</h3>
                          <p className="mt-1 line-clamp-1 text-[0.82rem] text-stone">{im.endereco}</p>
                        </div>
                        <div className={cn(
                          "flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-bold",
                          im.score?.faixa === 'ALTA' ? "bg-orange-500/10 text-orange-400" :
                          im.score?.faixa === 'MEDIA' ? "bg-amber-500/10 text-amber-400" :
                          "bg-white/5 text-stone"
                        )}>
                          {im.score?.faixa === 'ALTA' && <Flame className="size-3.5 fill-current" />}
                          {im.score?.total}
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        {im.score?.signals.slice(0, 2).map((s, idx) => (
                          <div key={idx} className="flex gap-2.5 text-[0.84rem] text-stone">
                            <span className="mt-1 size-1 shrink-0 rounded-full bg-chrome/40" />
                            {s.split(' — ')[0]}
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 border-t border-white/8 pt-4">
                        <p className="text-[0.78rem] uppercase tracking-wider text-stone/60">Ângulo sugerido</p>
                        <p className="mt-1 text-[0.88rem] font-medium text-bone">{im.score?.angulo}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUseImovel(im)}
                      className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-[0.92rem] font-bold text-bone transition-all hover:bg-chrome hover:text-black"
                    >
                      Usar este imóvel <ArrowRight className="size-4" />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Email Gate Modal */}
      {emailGateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={() => setEmailGateOpen(false)} />
          <Reveal className="glass-deep relative w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <button 
              onClick={() => setEmailGateOpen(false)}
              className="absolute right-6 top-6 text-stone hover:text-bone"
            >
              <X className="size-5" />
            </button>
            <div className="text-center">
              <div className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl bg-chrome/10 text-chrome">
                <User className="size-6" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-bone">Salve seu progresso</h3>
              <p className="mt-2 text-stone">
                Seu diagnóstico está pronto. Digite seu e-mail para salvar e gerar os materiais deste imóvel.
              </p>
              
              <form onSubmit={handleEmailSubmit} className="mt-8 space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 text-bone outline-none focus:border-chrome/50"
                />
                <button
                  type="submit"
                  disabled={loadingEmail}
                  className="metal-pill h-12 w-full rounded-xl font-bold text-black"
                >
                  {loadingEmail ? "Processando..." : "Continuar para os materiais"}
                </button>
              </form>
              <p className="mt-4 text-[0.75rem] text-stone/50">
                Ao continuar, você concorda com nossos termos.
              </p>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}
