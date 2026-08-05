import { 
  Download, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  Image as ImageIcon,
  Clapperboard,
  LayoutTemplate,
  MessageSquare,
  Mail,
  Check,
  ArrowRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  promptFoto, 
  promptVideo, 
  promptSite, 
  abordagem,
  type Respostas 
} from "@/lib/gerador";
import { saveProjectStep } from "@/lib/persistence";

interface SalaProducaoProps {
  projeto: any;
  aoConcluir: () => void;
}

export function SalaProducao({ projeto, aoConcluir }: SalaProducaoProps) {
  const [concluindo, setConcluindo] = useState(false);

  const dados = projeto.properties?.[0] || {};
  const entregaveisAtivos = dados.entregaveis || [];

  const respostas = useMemo((): Respostas => ({
    modalidade: dados.modalidade || 'temporada',
    imovel: dados.escolhido || {},
    estilo: dados.estilo || 'aconchegante',
    publico: dados.publico || 'casais',
    comodos: dados.comodos || [],
    entregaveis: entregaveisAtivos,
    notas: {}
  }), [dados, entregaveisAtivos]);

  const concluirProjeto = async () => {
    setConcluindo(true);
    try {
      await saveProjectStep(3, {}, 'concluido');
      aoConcluir();
      toast.success("Projeto finalizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar finalização.");
    } finally {
      setConcluindo(false);
    }
  };

  const copiar = (texto: string, label: string) => {
    navigator.clipboard.writeText(texto);
    toast.success(`${label} copiado!`);
  };

  return (
    <div className="space-y-8 motion-safe:animate-rise pb-20">
      <div className="grid gap-6">
        {/* 1. FOTOS TRATADAS */}
        {entregaveisAtivos.includes('fotos') && (
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4 rim-lit">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-chrome/10 grid place-items-center text-chrome">
                <ImageIcon className="size-5" />
              </div>
              <div>
                <h3 className="text-bone font-medium">Fotos tratadas</h3>
                <p className="text-[10px] text-stone uppercase font-bold tracking-wider">Prompt para gerador de imagem</p>
              </div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <p className="text-xs text-stone font-mono leading-relaxed line-clamp-4">
                {promptFoto(respostas, respostas.comodos[0] || "Sala")}
              </p>
            </div>
            <button 
              onClick={() => copiar(promptFoto(respostas, respostas.comodos[0] || "Sala"), "Prompt de foto")}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm text-bone transition-all"
            >
              <Copy className="size-4" /> Copiar prompt
            </button>
          </div>
        )}

        {/* 2. VÍDEO CURTO */}
        {entregaveisAtivos.includes('video') && (
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-chrome/10 grid place-items-center text-chrome">
                <Clapperboard className="size-5" />
              </div>
              <div>
                <h3 className="text-bone font-medium">Vídeo curto</h3>
                <p className="text-[10px] text-stone uppercase font-bold tracking-wider">Roteiro para Google Flow</p>
              </div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <p className="text-xs text-stone font-mono leading-relaxed line-clamp-4">
                {promptVideo(respostas)}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => copiar(promptVideo(respostas), "Prompt de vídeo")}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm text-bone transition-all"
              >
                <Copy className="size-4" /> Copiar prompt
              </button>
              <a 
                href="https://labs.google/flow" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-chrome text-black py-3 rounded-xl text-sm font-bold hover:scale-[1.02] transition-all"
              >
                <ExternalLink className="size-4" /> Abrir Google Flow
              </a>
            </div>
          </div>
        )}

        {/* 3. SITE COM RESERVA */}
        {entregaveisAtivos.includes('site') && (
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-chrome/10 grid place-items-center text-chrome">
                <LayoutTemplate className="size-5" />
              </div>
              <div>
                <h3 className="text-bone font-medium">Site com reserva direta</h3>
                <p className="text-[10px] text-stone uppercase font-bold tracking-wider">Headline e Copy do site</p>
              </div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] text-chrome font-bold uppercase">Headline</span>
                  <p className="text-xs text-bone font-medium leading-snug">
                    {respostas.imovel.nome} — Sua melhor experiência em {respostas.imovel.cidade}
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-chrome font-bold uppercase">Descrição</span>
                  <p className="text-xs text-stone leading-relaxed">
                    {promptSite(respostas).split('\n')[0]}...
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => copiar(promptSite(respostas), "Conteúdo do site")}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm text-bone transition-all"
            >
              <Copy className="size-4" /> Copiar conteúdo
            </button>
          </div>
        )}

        {/* 4. PROPOSTA COMERCIAL */}
        {entregaveisAtivos.includes('abordagem') && (
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-chrome/10 grid place-items-center text-chrome">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <h3 className="text-bone font-medium">Proposta comercial</h3>
                <p className="text-[10px] text-stone uppercase font-bold tracking-wider">Abordagem de fechamento</p>
              </div>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/10 border-l-2 border-l-chrome">
              <p className="text-xs text-stone leading-relaxed italic whitespace-pre-wrap">
                {abordagem(respostas)}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => copiar(abordagem(respostas), "Proposta")}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm text-bone transition-all"
              >
                <Copy className="size-4" /> Copiar proposta
              </button>
              <a 
                href={`mailto:?subject=Proposta comercial - ${respostas.imovel.nome}&body=${encodeURIComponent(abordagem(respostas))}`}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm text-bone transition-all"
              >
                <Mail className="size-4" /> Enviar por e-mail
              </a>
            </div>
          </div>
        )}
      </div>

      {/* BOTÃO FINAL */}
      <div className="pt-8">
        <button 
          onClick={concluirProjeto}
          disabled={concluindo}
          className="metal-pill w-full py-5 rounded-3xl font-bold text-black text-xl shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
        >
          {concluindo ? "Salvando..." : <>Concluir projeto <CheckCircle2 className="size-6" /></>}
        </button>
      </div>
    </div>
  );
}

export function TelaConcluida({ aoVoltar, aoNovo }: { aoVoltar: () => void, aoNovo: () => void }) {
  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-8 motion-safe:animate-rise">
      <div className="size-24 bg-chrome/10 rounded-full grid place-items-center mx-auto rim-lit">
        <CheckCircle2 className="size-12 text-chrome" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-semibold text-bone">Projeto Concluído</h1>
        <p className="text-stone">Todos os materiais foram gerados e estão salvos na sua conta.</p>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={aoVoltar} className="metal-pill w-full py-4 rounded-2xl font-bold text-black text-lg">
          Ver meus projetos
        </button>
        <button onClick={aoNovo} className="w-full py-3 rounded-2xl border border-white/10 text-stone hover:text-bone transition-all text-sm">
          Novo projeto
        </button>
      </div>
    </div>
  );
}
