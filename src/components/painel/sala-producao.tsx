import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Monitor,
  Smartphone,
  Info,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Image as ImageIcon
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { generateVideoPrompts } from "@/config/videoPrompts";
import { FLOW_CREDITS, getRemainingTime } from "@/config/credits";
import { saveDeliverable, saveProjectStep } from "@/lib/persistence";

interface SalaProducaoProps {
  projeto: any;
  aoConcluir: () => void;
}

export function SalaProducao({ projeto, aoConcluir }: SalaProducaoProps) {
  const [shotAtual, setShotAtual] = useState(0);
  const [idioma, setIdioma] = useState<'pt' | 'en'>('en');
  const [shotsGerados, setShotsGerados] = useState<number[]>([]);
  const [creditosUsados, setCreditosUsados] = useState(0);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);

  const prompts = useMemo(() => {
    const respostas = {
      estilo: projeto.briefings?.[0]?.estilo_inferido || 'aconchegante',
      publico: projeto.briefings?.[0]?.publico || 'casais',
      comodos: projeto.briefings?.[0]?.comodos || [],
    };
    const vertical = projeto.briefings?.[0]?.formato_video === '9:16';
    return generateVideoPrompts(respostas as any, vertical);
  }, [projeto]);

  useEffect(() => {
    if (projeto.deliverables) {
      const gerados = projeto.deliverables
        .filter((d: any) => d.gerado)
        .map((d: any) => d.shot_number);
      setShotsGerados(gerados);
      
      const totalCreditos = projeto.deliverables
        .filter((d: any) => d.gerado)
        .reduce((acc: number, d: any) => acc + (d.creditos || 0), 0);
      setCreditosUsados(totalCreditos);

      const last = projeto.deliverables
        .filter((d: any) => d.gerado_em)
        .sort((a: any, b: any) => new Date(b.gerado_em).getTime() - new Date(a.gerado_em).getTime())[0];
      
      if (last) setLastGeneratedAt(new Date(last.gerado_em));
    }
  }, [projeto.deliverables]);

  const shot = prompts[shotAtual];
  const isGerado = shotsGerados.includes(shotAtual);
  const limiteAtingido = creditosUsados >= FLOW_CREDITS.DAILY_LIMIT;
  const tempoReset = lastGeneratedAt ? getRemainingTime(lastGeneratedAt) : null;

  const copiarEAbrir = async () => {
    const promptText = idioma === 'en' ? shot.prompt_en : shot.prompt_pt;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(promptText);
        toast.success("Prompt copiado!");
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (err) {
      // Fallback handled by the UI showing a textarea or instructions
      toast.error("Erro ao copiar automaticamente. Use o campo de texto.");
    }

    window.open("https://flow.google.com", "_blank", "noopener,noreferrer");
  };

  const confirmarGeracao = async () => {
    const novoStatus = [...shotsGerados, shotAtual];
    setShotsGerados(novoStatus);
    setCreditosUsados(prev => prev + FLOW_CREDITS.COST_PER_SHOT);
    const now = new Date();
    setLastGeneratedAt(now);

    await saveDeliverable(projeto.id, {
      shot_number: shotAtual,
      prompt_pt: shot.prompt_pt,
      prompt_en: shot.prompt_en,
      idioma_escolhido: idioma,
      modo: 'FAST',
      creditos: FLOW_CREDITS.COST_PER_SHOT,
      gerado: true,
      gerado_em: now.toISOString()
    });

    if (shotAtual < prompts.length - 1) {
      setShotAtual(prev => prev + 1);
    } else {
      await saveProjectStep(4, {}, 'concluido');
      aoConcluir();
    }
  };

  return (
    <div className="space-y-8 motion-safe:animate-rise pb-20">
      {/* TOPO */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-stone text-xs font-mono uppercase tracking-widest">Sala de Produção</h2>
            <h1 className="text-bone text-xl font-semibold">{projeto.properties?.[0]?.nome}</h1>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone uppercase font-bold">Shot {shotAtual + 1} de {prompts.length}</span>
            <div className="flex gap-1 mt-1">
              {prompts.map((_, i) => (
                <div key={i} className={cn("h-1 w-8 rounded-full transition-all", i <= shotAtual ? "bg-chrome" : "bg-white/10")} />
              ))}
            </div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-stone">Créditos Google Flow</span>
            <span className={cn(limiteAtingido ? "text-amber-400" : "text-chrome")}>
              {creditosUsados} de {FLOW_CREDITS.DAILY_LIMIT} usados hoje
            </span>
          </div>
          <Progress value={(creditosUsados / FLOW_CREDITS.DAILY_LIMIT) * 100} className={cn("h-1.5", limiteAtingido ? "bg-amber-400/20" : "bg-chrome/20")} />
          {limiteAtingido && (
            <p className="text-[10px] text-amber-400 flex items-center gap-1">
              <Info className="size-3" /> Você atingiu o limite gratuito diário. Os créditos renovam em {tempoReset}. Os próximos shots já estão salvos aqui.
            </p>
          )}
        </div>
      </div>

      {/* CARD CENTRAL */}
      <div className="glass rounded-3xl border-white/10 overflow-hidden relative rim-lit">
        {/* Toggle Idioma */}
        <div className="absolute top-6 right-6 z-10">
          <div className="flex flex-col items-end gap-2">
            <div className="bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 flex">
              <button 
                onClick={() => setIdioma('en')}
                className={cn("px-3 py-1 rounded-full text-[10px] font-bold transition-all", idioma === 'en' ? "bg-chrome text-black" : "text-stone")}
              >
                English
              </button>
              <button 
                onClick={() => setIdioma('pt')}
                className={cn("px-3 py-1 rounded-full text-[10px] font-bold transition-all", idioma === 'pt' ? "bg-chrome text-black" : "text-stone")}
              >
                Português
              </button>
            </div>
            <p className="text-[9px] text-stone max-w-[120px] text-right">Recomendado: inglês. O modelo entende melhor os termos de câmera.</p>
          </div>
        </div>

        <div className="p-8 pt-10 space-y-8">
          <div className="flex items-center gap-2">
            <span className="bg-white/5 text-stone text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Shot {shotAtual + 1} · {idioma === 'en' ? shot.name_en : shot.name_pt}
            </span>
            <span className="bg-chrome/10 text-chrome text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
              FAST · {FLOW_CREDITS.COST_PER_SHOT} créditos
            </span>
          </div>

          <div className="space-y-6">
            {/* Passo 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-bone font-medium">
                <span className="size-5 rounded-full bg-white/10 text-[10px] grid place-items-center">1</span>
                <span>Separe a foto deste ambiente</span>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="size-16 rounded-lg bg-white/10 overflow-hidden flex items-center justify-center">
                   {projeto.properties?.[0]?.place_id ? (
                      <img 
                        src={`https://places.googleapis.com/v1/${projeto.properties[0].place_id}/media?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&maxWidthPx=200`} 
                        className="w-full h-full object-cover opacity-50"
                        alt="Sugestão de ambiente"
                      />
                   ) : <ImageIcon className="size-6 text-stone" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-stone leading-tight">Use a foto correspondente à fachada como referência visual no Flow.</p>
                </div>
                <button className="p-3 rounded-xl bg-white/5 text-bone hover:bg-white/10 transition-all">
                  <Download className="size-4" />
                </button>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-bone font-medium">
                <span className="size-5 rounded-full bg-white/10 text-[10px] grid place-items-center">2</span>
                <span>O prompt de animação</span>
              </div>
              <div className="relative group">
                <textarea 
                  readOnly
                  value={idioma === 'en' ? shot.prompt_en : shot.prompt_pt}
                  className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-xs text-stone leading-relaxed resize-none focus:outline-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Passo 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-bone font-medium">
                <span className="size-5 rounded-full bg-white/10 text-[10px] grid place-items-center">3</span>
                <span>Gere no Google Flow</span>
              </div>
              
              <button 
                onClick={copiarEAbrir}
                disabled={limiteAtingido && !isGerado}
                className={cn(
                  "metal-pill w-full py-5 rounded-2xl font-bold text-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all",
                  limiteAtingido && !isGerado ? "opacity-50 grayscale" : "hover:scale-[1.02]"
                )}
              >
                <Copy className="size-5" /> Copiar prompt e abrir o Flow
              </button>

              <div className="grid grid-cols-3 gap-2">
                {[
                  "No Flow, escolha 'Frames to Video'",
                  "Suba a foto que você baixou",
                  "Cole o prompt (Ctrl+V) e gere"
                ].map((text, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-[10px] font-bold text-chrome uppercase tracking-tighter">Passo {i+1}</div>
                    <p className="text-[9px] text-stone leading-tight">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER DO CARD */}
        <div className="bg-white/[0.03] border-t border-white/5 p-6">
           <div className="flex items-center justify-between">
              <p className="text-sm text-bone font-medium">Gerou o vídeo?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => toast.info("Continue tentando no Flow. Se precisar de ajuda, veja o FAQ.")}
                  className="px-6 py-2 rounded-xl border border-white/10 text-stone text-sm hover:text-bone transition-all"
                >
                  Ainda não
                </button>
                <button 
                  onClick={confirmarGeracao}
                  className="px-6 py-2 rounded-xl bg-chrome text-black font-bold text-sm hover:scale-105 transition-all shadow-lg"
                >
                  Sim, próximo shot
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* NAVEGAÇÃO E MINIATURAS */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => setShotAtual(prev => Math.max(0, prev - 1))}
          disabled={shotAtual === 0}
          className="p-3 rounded-full bg-white/5 text-stone hover:text-bone disabled:opacity-20"
        >
          <ChevronLeft className="size-6" />
        </button>

        <div className="flex gap-3">
          {prompts.map((p, i) => (
            <button 
              key={i} 
              onClick={() => setShotAtual(i)}
              className={cn(
                "size-12 rounded-xl border transition-all overflow-hidden relative",
                shotAtual === i ? "border-chrome ring-2 ring-chrome/20" : "border-white/10 opacity-40 hover:opacity-100"
              )}
            >
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                {shotsGerados.includes(i) ? <CheckCircle2 className="size-4 text-chrome" /> : <span className="text-[10px] font-bold text-bone">{i+1}</span>}
              </div>
              {projeto.properties?.[0]?.place_id && (
                <img 
                  src={`https://places.googleapis.com/v1/${projeto.properties[0].place_id}/media?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&maxWidthPx=100`} 
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShotAtual(prev => Math.min(prompts.length - 1, prev + 1))}
          disabled={shotAtual === prompts.length - 1}
          className="p-3 rounded-full bg-white/5 text-stone hover:text-bone disabled:opacity-20"
        >
          <ChevronRight className="size-6" />
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
        <h1 className="text-3xl font-display font-semibold text-bone">Produção concluída</h1>
        <p className="text-stone">Seus vídeos foram planejados e os prompts estão salvos.</p>
      </div>

      <div className="glass p-6 rounded-3xl border-white/5 text-left space-y-4">
        <h3 className="text-xs font-mono uppercase text-stone tracking-widest">O que você tem agora:</h3>
        <ul className="space-y-3">
          {[
            "4 shots sequenciados para o Reels/TikTok",
            "Prompts otimizados para o modelo Veo (Google)",
            "Plano de produção pronto para fechar mais vendas"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-bone">
              <CheckCircle2 className="size-4 text-chrome shrink-0 mt-0.5" /> {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={aoVoltar} className="metal-pill w-full py-4 rounded-2xl font-bold text-black text-lg">
          Ver meus projetos
        </button>
        <button onClick={aoNovo} className="w-full py-3 rounded-2xl border border-white/10 text-stone hover:text-bone transition-all text-sm">
          Nova entrega
        </button>
      </div>
    </div>
  );
}
