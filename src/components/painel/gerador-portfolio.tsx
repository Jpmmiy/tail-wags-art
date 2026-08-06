"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";

const PERGUNTAS = [
  {
    id: "tipo",
    pergunta: "Qual o seu foco principal?",
    opcoes: ["Vídeos (Reels/TikTok) para Airbnb", "Criação de Sites para Imóveis", "Gestão e Consultoria de Anfitrião"],
  },
  {
    id: "nome",
    pergunta: "Como você quer ser chamado?",
    placeholder: "Ex: João Silva ou Agência Nexo",
  },
  {
    id: "experiencia",
    pergunta: "Qual sua experiência atual?",
    opcoes: ["Estou começando agora", "Já fiz alguns trabalhos", "Sou especialista no nicho"],
  },
  {
    id: "estilo",
    pergunta: "Qual o estilo do seu trabalho?",
    opcoes: ["Minimalista e Luxuoso", "Dinâmico e Viral", "Prático e Informativo"],
  },
];

export function GeradorPortfolio() {
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const aoMudar = (id: string, valor: string) => {
    setRespostas(prev => ({ ...prev, [id]: valor }));
    if (erro) setErro(null);
  };

  const validarERodar = () => {
    const pendentes = PERGUNTAS.filter(p => !respostas[p.id]);
    if (pendentes.length > 0) {
      setErro("Por favor, preencha todos os campos antes de gerar.");
      return;
    }
    gerarPrompt(respostas);
  };

  const gerarPrompt = (dados: Record<string, string>) => {
    setGerando(true);
    
    const prompt = `Crie um portfólio profissional de alto impacto para ${dados.nome}.
Foco: ${dados.tipo}.
Experiência: ${dados.experiencia}.
Estilo Visual: ${dados.estilo}.

O portfólio deve ser focado no ecossistema Nexofly (ajudando anfitriões a aumentarem o valor da diária através de conteúdo visual e sites). 
Inclua seções de:
1. Headline matadora para Airbnb
2. Proposta de valor baseada em dados
3. Como meu trabalho gera lucro direto
4. Seção de depoimentos e CTAs.

Crie o layout moderno em React/Tailwind seguindo a estética Dark/Apple da Nexofly.`;

    const url = `https://lovable.dev/new?message=${encodeURIComponent(prompt)}`;
    
    setTimeout(() => {
      window.open(url, "_blank");
      setGerando(false);
    }, 1500);
  };

  return (
    <section className="glass-deep relative overflow-hidden rounded-3xl p-8 sm:p-12 mt-12">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="metal-pill grid size-10 place-items-center rounded-xl text-[#08090B]">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-bone">Arquiteto de Portfólio</h2>
            <p className="text-stone text-sm">Preencha o formulário e gere seu site no Lovable em segundos</p>
          </div>
        </div>

        {!gerando ? (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {PERGUNTAS.map((pergunta) => (
                <div key={pergunta.id} className="space-y-3">
                  <label className="text-bone font-medium text-[0.9rem] flex items-center gap-2">
                    {pergunta.pergunta}
                  </label>
                  
                  {pergunta.opcoes ? (
                    <select
                      value={respostas[pergunta.id] || ""}
                      onChange={(e) => aoMudar(pergunta.id, e.target.value)}
                      className="w-full glass bg-white/5 border-none rounded-xl px-4 py-3 text-bone outline-none ring-1 ring-white/10 focus:ring-chrome/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#08090B]">Selecione uma opção...</option>
                      {pergunta.opcoes.map(opcao => (
                        <option key={opcao} value={opcao} className="bg-[#08090B]">{opcao}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={pergunta.placeholder}
                      value={respostas[pergunta.id] || ""}
                      onChange={(e) => aoMudar(pergunta.id, e.target.value)}
                      className="w-full glass bg-white/5 border-none rounded-xl px-4 py-3 text-bone outline-none ring-1 ring-white/10 focus:ring-chrome/40 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>

            {erro && (
              <div className="flex items-center gap-2 text-rose-400 bg-rose-400/10 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="size-4" />
                {erro}
              </div>
            )}

            <button 
              onClick={validarERodar}
              className="w-full metal-pill py-4 rounded-xl text-[#08090B] font-semibold flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Criar meu Portfólio no Lovable
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full border-2 border-chrome/20 border-t-chrome animate-spin mb-6" />
            <h3 className="text-bone font-display text-xl font-medium">Desenhando seu Portfólio...</h3>
            <p className="text-stone mt-2">Estamos preparando o prompt ideal para o Lovable.</p>
          </div>
        )}
      </div>
      
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-96 bg-chrome/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
