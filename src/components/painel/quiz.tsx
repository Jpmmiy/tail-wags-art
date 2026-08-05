"use client";

import { useState, useMemo, useEffect } from "react";
import { Link } from "@/components/ui/link";
import {
  Check,
  Copy,
  Search,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Star,
  RotateCcw,
  Home,
  Building2,
  MapPin,
  ExternalLink,
  Image as ImageIcon,
  Clapperboard,
  LayoutTemplate,
  MessageSquare,
  PenLine,
  Info,
  ChevronRight,
  ChevronDown,
  Send,
} from "lucide-react";
import { generateVideoPrompts } from "@/config/videoPrompts";
import { VIDEO_PLAN, CREDIT_COSTS } from "@/config/credits";
import { calculatePricing } from "@/config/pricing";
import {
  ESTILOS,
  PUBLICOS,
  COMODOS,
  promptFoto,
  promptVideo,
  promptSite,
  abordagem,
  type Respostas,
  type ImovelSelecionado,
} from "@/lib/gerador";
import type { ImovelEncontrado, Modalidade } from "@/lib/imoveis-tipos";
import { TelaGeracao } from "./tela-geracao";
import { cn } from "@/lib/utils";
import { saveProjectStep, loadProject, setCurrentProjectId, getCurrentProjectId } from "@/lib/persistence";
import { toast } from "sonner";

const TITULOS = ["Alvo", "Briefing", "Fechamento", "Produção"];

const MODALIDADES = [
  { id: "temporada" as const, icone: Home, titulo: "Airbnb e temporada", desc: "Pousadas, chalés e casas anunciadas por diária." },
  { id: "imobiliario" as const, icone: Building2, titulo: "Mercado imobiliário", desc: "Imobiliárias e imóveis para alugar ou vender." },
];

const PACOTE_CONFIG = [
  { id: "fotos", rotulo: "Fotos tratadas", icone: ImageIcon },
  { id: "video", rotulo: "Vídeo curto", icone: Clapperboard },
  { id: "site", rotulo: "Site com reserva direta", icone: LayoutTemplate },
  { id: "abordagem", rotulo: "Proposta", icone: MessageSquare },
];

function Progresso({ passo }: { passo: number }) {
  return (
    <ol className="flex items-center gap-3">
      {TITULOS.map((t, i) => {
        const feito = i < passo;
        const atual = i === passo;
        return (
          <li key={t} className="flex flex-1 items-center gap-3">
            <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold transition-all", feito ? "bg-chrome text-black" : atual ? "border border-chrome text-chrome" : "border border-white/10 text-stone")}>
              {feito ? <Check className="size-3" /> : i + 1}
            </span>
            <span className={cn("hidden sm:block text-[0.8rem]", atual ? "text-bone" : "text-stone")}>{t}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Quiz() {
  const [passo, setPasso] = useState(0);
  const [modalidade, setModalidade] = useState<Modalidade | null>(null);
  const [escolhido, setEscolhido] = useState<ImovelEncontrado | null>(null);
  const [cidade, setCidade] = useState("");
  const [resultados, setResultados] = useState<ImovelEncontrado[]>([]);
  const [estilo, setEstilo] = useState("aconchegante");
  const [publico, setPublico] = useState("casais");
  const [comodos, setComodos] = useState<string[]>(["Sala", "Quarto principal"]);
  const [entregaveis, setEntregaveis] = useState<string[]>(["video", "abordagem"]);
  const [diaria, setDiaria] = useState("250");
  const [valorImobiliario, setValorImobiliario] = useState("450000");
  const [gerando, setGerando] = useState(false);
  const [aba, setAba] = useState("video");
  const [videoVertical, setVideoVertical] = useState(true);
  const [gerados, setGerados] = useState<string[]>([]);

  useEffect(() => {
    const resumeProject = async () => {
      const pid = getCurrentProjectId();
      if (pid) {
        try {
          const p = await loadProject(pid);
          if (p) {
            setPasso(p.current_step || 0);
            setModalidade(p.modalidade as Modalidade);
          }
        } catch (err) { console.error(err); }
      }
    };
    resumeProject();
  }, []);

  const autosave = async (step: number, status: any = 'rascunho') => {
    await saveProjectStep(step, { modalidade, escolhido, publico, comodos, diaria, valorImobiliario, estilo, videoVertical }, status);
  };

  const avancar = async (s: any = 'rascunho') => {
    const proximo = passo + 1;
    setPasso(proximo);
    await autosave(proximo, s);
  };

  return (
    <div className="space-y-8">
      {gerando && <TelaGeracao aoTerminar={() => { setGerando(false); setPasso(3); }} />}
      <header>
        <h1 className="font-display text-3xl font-semibold text-bone">{TITULOS[passo]}</h1>
      </header>
      <Progresso passo={passo} />

      {passo === 0 && (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                {MODALIDADES.map(m => (
                    <button key={m.id} onClick={() => setModalidade(m.id)} className={cn("glass p-6 rounded-2xl", modalidade === m.id && "rim-lit")}>
                        <h3 className="text-bone font-medium">{m.titulo}</h3>
                    </button>
                ))}
            </div>
            {modalidade && (
                <div className="flex gap-4">
                    <input value={cidade} onChange={e => setCidade(e.target.value)} className="flex-1 bg-white/5 rounded-xl px-4 py-3" placeholder="Cidade..." />
                    <button onClick={async () => {
                        const r = await fetch("/api/imoveis", { method: "POST", body: JSON.stringify({ modalidade, cidade }), headers:{"Content-Type":"application/json"} });
                        const d = await r.json();
                        setResultados(d.imoveis ?? []);
                    }} className="metal-pill px-6 py-2 rounded-xl text-black font-bold">Buscar</button>
                </div>
            )}
            <div className="grid gap-4">
                {resultados.map(im => (
                    <div key={im.id} onClick={() => { setEscolhido(im); avancar(); }} className="glass p-5 rounded-2xl cursor-pointer">
                        <h4>{im.nome}</h4>
                    </div>
                ))}
            </div>
        </div>
      )}

      {passo === 1 && escolhido && (
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl flex gap-6">
            {escolhido.primeiraFoto && <img src={`https://places.googleapis.com/v1/${escolhido.primeiraFoto}/media?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&maxWidthPx=200`} className="size-24 rounded-lg object-cover" />}
            <div>
                <h2 className="text-xl font-semibold text-bone">{escolhido.nome}</h2>
                <div className="space-y-1 mt-2">
                    {escolhido.score?.signals.map((s,i) => <p key={i} className="text-sm text-stone">{s}</p>)}
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {PACOTE_CONFIG.map(p => (
                <div key={p.id} onClick={() => entregaveis.includes(p.id) ? setEntregaveis(entregaveis.filter(x => x !== p.id)) : setEntregaveis([...entregaveis, p.id])} className={cn("p-4 rounded-xl border cursor-pointer", entregaveis.includes(p.id) ? "border-chrome bg-chrome/10" : "border-white/5")}>
                    {p.rotulo}
                </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['Casais', 'Famílias', 'Trabalho'].map(p => (
                <button key={p} onClick={() => setPublico(p.toLowerCase())} className={cn("p-3 rounded-xl border", publico === p.toLowerCase() ? "border-chrome" : "border-white/10")}>{p}</button>
            ))}
          </div>

          <button onClick={() => avancar()} className="metal-pill w-full py-4 rounded-2xl text-black font-bold">Gerar proposta</button>
        </div>
      )}

      {passo === 2 && (
        <div className="space-y-6">
            <h3 className="text-bone">Proposta pronta</h3>
            <button onClick={() => avancar('em_producao')} className="metal-pill px-8 py-3 rounded-xl font-bold text-black">Já fechei — ir para produção</button>
            <button onClick={() => { autosave(passo, 'aguardando_resposta'); window.location.href='/projetos'; }} className="border border-white/10 px-8 py-3 rounded-xl">Salvar e voltar depois</button>
        </div>
      )}

      {passo === 3 && (
        <div className="space-y-6">
            <h3 className="text-bone">Sala de produção</h3>
            <p className="text-stone">Use os prompts abaixo no Google Flow.</p>
        </div>
      )}
    </div>
  );
}
