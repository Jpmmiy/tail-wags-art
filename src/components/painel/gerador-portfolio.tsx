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
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [gerando, setGerando] = useState(false);

  const perguntaAtual = PERGUNTAS[etapa];

  const aoResponder = (valor: string) => {
    if (!valor) return;
    const novasRespostas = { ...respostas, [perguntaAtual.id]: valor };
    setRespostas(novasRespostas);
    
    if (etapa < PERGUNTAS.length - 1) {
      setEtapa(etapa + 1);
    } else {
      gerarPrompt(novasRespostas);
    }
  };

  const gerarPrompt = (dados: Record<string, string>) => {
    setGerando(true);
    
    const prompt = `Crie um portfólio profissional de alto impacto para ${dados.nome || "um profissional"}.
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
        <div className="flex items-center gap-3 mb-6">
          <span className="metal-pill grid size-10 place-items-center rounded-xl text-[#08090B]">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-bone">Arquiteto de Portfólio</h2>
            <p className="text-stone text-sm">Responda e gere seu site no Lovable em segundos</p>
          </div>
        </div>

        {!gerando ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-stone text-[0.8rem] uppercase tracking-wider font-mono">
                Pergunta {etapa + 1} de {PERGUNTAS.length}
              </p>
              <h3 className="text-bone font-display text-lg sm:text-xl font-medium">
                {perguntaAtual.pergunta}
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {perguntaAtual.opcoes ? (
                perguntaAtual.opcoes.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => aoResponder(opcao)}
                    className="glass text-left p-4 rounded-xl text-[0.9rem] text-stone hover:text-bone hover:border-chrome/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      {opcao}
                      <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="sm:col-span-2 flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder={perguntaAtual.placeholder}
                    className="flex-1 glass bg-white/5 border-none rounded-xl px-4 py-3 text-bone outline-none ring-1 ring-white/10 focus:ring-chrome/40 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        aoResponder((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <button 
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement);
                      aoResponder(input.value);
                    }}
                    className="metal-pill px-6 rounded-xl text-[#08090B] font-medium"
                  >
                    Próximo
                  </button>
                </div>
              )}
            </div>
            
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-chrome transition-all duration-500" 
                style={{ width: `${((etapa) / PERGUNTAS.length) * 100}%` }}
              />
            </div>
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
