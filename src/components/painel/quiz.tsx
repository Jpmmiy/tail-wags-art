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
  MessageCircle,
} from "lucide-react";
import { generateVideoPrompts } from "@/config/videoPrompts";
import { FLOW_CREDITS, getRemainingTime } from "@/config/credits";
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
import { SalaProducao, TelaConcluida } from "./sala-producao";
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
  const [propostaAberta, setPropostaAberta] = useState(false);
  const [projetoCarregado, setProjetoCarregado] = useState<any>(null);
  const [concluido, setConcluido] = useState(false);




  useEffect(() => {
    const resumeProject = async () => {
      const pid = getCurrentProjectId();
      if (pid) {
        try {
          const p = await loadProject(pid);
          if (p) {
            setPasso(p.current_step || 0);
            setModalidade(p.modalidade as Modalidade);
            setProjetoCarregado(p);
            if (p.status === 'concluido') setConcluido(true);
          }
        } catch (err) { console.error(err); }
      }
    };

    resumeProject();
  }, []);



  const autosave = async (step: number, status: any = 'rascunho') => {
    return await saveProjectStep(step, { modalidade, escolhido, publico, comodos, diaria, valorImobiliario, estilo, videoVertical }, status);
  };


  const avancar = async (s: any = 'rascunho') => {
    const proximo = passo + 1;
    setPasso(proximo);
    const pid = await autosave(proximo, s);
    if (pid) {
      const p = await loadProject(pid);
      setProjetoCarregado(p);
    }
  };


  const whatsMessage = useMemo(() => {
    if (!escolhido) return "";
    const dadoReal = escolhido.nota 
      ? `${escolhido.nota} com ${escolhido.avaliacoes} avaliações` 
      : escolhido.avaliacoes 
        ? `${escolhido.avaliacoes} avaliações`
        : "o potencial do anúncio";
    
    return `Oi! Vi o anúncio do ${escolhido.nome} — ${dadoReal} é resultado de gente que trabalha bem.\nReparei que as fotos não acompanham esse nível, e isso costuma segurar o clique antes da descrição.\nFiz um vídeo curto do imóvel pra te mostrar como ficaria. Sem compromisso.\nPosso te mandar aqui?`;
  }, [escolhido]);



  const precos = useMemo(() => {
    return calculatePricing(
      Number(modalidade === 'temporada' ? diaria : valorImobiliario), 
      modalidade || 'temporada',
      entregaveis
    );
  }, [modalidade, diaria, valorImobiliario, entregaveis]);



  return (
    <div className="space-y-8">
      {gerando && <TelaGeracao aoTerminar={() => { setGerando(false); setPasso(3); }} />}
      <header>
        <h1 className="font-display text-3xl font-semibold text-bone">{TITULOS[passo]}</h1>
      </header>
      <Progresso passo={passo} />




      
      {passo === 0 && (


        <div className="space-y-6 motion-safe:animate-rise">
            <div className="grid gap-4 sm:grid-cols-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Selecionando temporada');
                    setModalidade('temporada');
                  }} 

                  className={cn(
                    "glass p-6 rounded-2xl text-left transition-all hover:bg-white/5", 
                    modalidade === 'temporada' && "rim-lit border-chrome/50"
                  )}
                >
                    <div className="flex items-center gap-3 mb-2">
                      <Home className={cn("size-5", modalidade === 'temporada' ? "text-chrome" : "text-stone")} />
                      <h3 className="text-bone font-medium">Airbnb e temporada</h3>
                    </div>
                    <p className="text-xs text-stone">Pousadas, chalés e casas anunciadas por diária.</p>
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Selecionando imobiliario');
                    setModalidade('imobiliario');
                  }} 

                  className={cn(
                    "glass p-6 rounded-2xl text-left transition-all hover:bg-white/5", 
                    modalidade === 'imobiliario' && "rim-lit border-chrome/50"
                  )}
                >
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className={cn("size-5", modalidade === 'imobiliario' ? "text-chrome" : "text-stone")} />
                      <h3 className="text-bone font-medium">Mercado imobiliário</h3>
                    </div>
                    <p className="text-xs text-stone">Imobiliárias e imóveis para alugar ou vender.</p>
                </button>
            </div>


            {modalidade && (
                <div className="flex gap-4 p-4 bg-white/5 rounded-2xl rim-lit">
                    <input 
                      value={cidade} 
                      onChange={e => setCidade(e.target.value)} 
                      className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50" 
                      placeholder="Cidade..." 
                    />
                    <button onClick={async (e) => {
                        e.preventDefault();
                        console.log('Botão Buscar clicado!', { modalidade, cidade });
                        try {
                          const r = await fetch("/api/imoveis", { 
                            method: "POST", 
                            body: JSON.stringify({ modalidade, cidade, pais: 'BR' }), // Adicionado pais default
                            headers:{"Content-Type":"application/json"} 
                          });
                          const d = await r.json();
                          console.log('Resposta busca:', d);
                          setResultados(d.imoveis ?? []);
                        } catch (err) {
                          console.error('Erro na busca:', err);
                          toast.error("Erro ao buscar imóveis.");
                        }
                    }} className="metal-pill px-6 py-2 rounded-xl text-black font-bold hover:scale-105 active:scale-95 transition-all">Buscar</button>
                </div>
            )}

            <div className="grid gap-4">
                {resultados.map(im => (
                    <div key={im.id} onClick={(e) => { e.preventDefault(); setEscolhido(im); avancar(); }} className="glass p-5 rounded-2xl cursor-pointer">
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
        <div className="space-y-8 motion-safe:animate-rise pb-12">
            {/* BLOCO 1 — WHATSAPP */}
            <div className="glass p-6 rounded-2xl border-chrome/20">
                <h3 className="text-bone font-medium flex items-center gap-2 mb-4">
                    <MessageCircle className="size-4 text-chrome" /> Abordagem WhatsApp
                </h3>
                <div className="p-4 bg-white/[0.03] rounded-xl text-[0.9rem] text-bone italic border-l-2 border-chrome whitespace-pre-wrap">
                    {whatsMessage}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(whatsMessage);
                            toast.success("Mensagem copiada!");
                        }}
                        className="flex items-center justify-center gap-2 border border-white/10 hover:border-chrome/50 py-3 rounded-xl text-sm text-bone transition-all"
                    >
                        <Copy className="size-4" /> Copiar mensagem
                    </button>
                    <a 
                        href={`https://wa.me/?text=${encodeURIComponent(whatsMessage)}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-sm font-bold"
                    >
                        <Send className="size-4" /> Abrir WhatsApp
                    </a>
                </div>
            </div>

            {/* BLOCO 2 — PACOTES DE PREÇO */}
            <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                    {Object.entries(precos).filter(([_, p]) => p.visivel).map(([key, plano]) => (
                        <div key={key} className={cn("glass p-5 rounded-2xl border transition-all relative", key === 'completo' ? "border-chrome/40 rim-lit" : "border-white/5")}>
                            {key === 'completo' && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chrome text-black text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">mais escolhido</span>
                            )}
                            <div className="text-[10px] text-stone font-mono uppercase mb-1">{plano.titulo}</div>
                            <div className="text-2xl font-bold text-bone mb-4">R$ {plano.valor.toLocaleString('pt-BR')}</div>
                            <ul className="space-y-2">
                                {plano.inclui.map((item, i) => (
                                    <li key={i} className="text-[0.75rem] text-stone flex items-start gap-2">
                                        <Check className="size-3 text-chrome mt-0.5 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <p className="text-[11px] text-stone text-center">Valores sugeridos com base na diária informada. Ajuste conforme seu mercado.</p>
            </div>

            {/* BLOCO 3 — PROPOSTA COMPLETA */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <button 
                    onClick={() => setPropostaAberta(!propostaAberta)}
                    className="w-full flex items-center justify-between p-4 text-stone hover:text-bone transition-colors"
                >
                    <span className="text-sm font-medium">Ver proposta completa para enviar por e-mail</span>
                    <ChevronDown className={cn("size-4 transition-transform", propostaAberta && "rotate-180")} />
                </button>
                {propostaAberta && (
                    <div className="p-6 border-t border-white/5 space-y-4 motion-safe:animate-rise">
                        <div className="p-5 bg-white/[0.03] rounded-xl text-[0.85rem] text-stone whitespace-pre-wrap leading-relaxed">
                            {(() => {
                                const dadoReal = escolhido?.nota ? `${escolhido.nota}★ no Google` : "o potencial do anúncio";
                                const listaEntregaveis = PACOTE_CONFIG.filter(p => entregaveis.includes(p.id)).map(p => p.rotulo).join(", ");
                                return `Oi, vi que o ${escolhido?.nome} tem ${dadoReal}.\n\nO imóvel é excelente, mas o anúncio atual não reflete todo o seu potencial visual, o que pode estar afastando hóspedes qualificados.\n\nPara resolver isso, entrego:\n- ${listaEntregaveis}\n\nPrazo: 5 dias úteis após a captação.\n\nInvestimento: A partir de R$ ${precos.completo.valor.toLocaleString('pt-BR')}`;
                            })()}
                        </div>
                        <button 
                            onClick={() => {
                                const texto = `Oi, vi que o ${escolhido?.nome} tem ${escolhido?.nota ? `${escolhido.nota}★ no Google` : "o potencial do anúncio"}.\n\nPara resolver isso, entrego:\n- ${PACOTE_CONFIG.filter(p => entregaveis.includes(p.id)).map(p => p.rotulo).join(", ")}\n\nPrazo: 5 dias úteis.\n\nInvestimento: R$ ${precos.completo.valor.toLocaleString('pt-BR')}`;
                                navigator.clipboard.writeText(texto);
                                toast.success("Proposta copiada!");
                            }}
                            className="w-full flex items-center justify-center gap-2 border border-white/10 py-2 rounded-xl text-xs text-bone"
                        >
                            <Copy className="size-3" /> Copiar proposta completa
                        </button>
                    </div>
                )}
            </div>

            {/* RODAPÉ DA ETAPA */}
            <div className="flex flex-col gap-3 pt-4">
                <button onClick={() => avancar('em_producao')} className="metal-pill w-full py-4 rounded-2xl font-bold text-black text-lg">
                    Já fechei — ir para produção
                </button>
                <button 
                    onClick={() => { 
                        autosave(passo, 'aguardando_resposta'); 
                        window.location.href='/projetos'; 
                    }} 
                    className="w-full py-3 rounded-2xl border border-white/10 text-stone hover:text-bone transition-all text-sm"
                >
                    Salvar e voltar depois
                </button>
            </div>
        </div>
      )}

      {passo === 3 && projetoCarregado && !concluido && (
        <SalaProducao 
          projeto={projetoCarregado} 
          aoConcluir={() => setConcluido(true)} 
        />
      )}

      {concluido && (
        <TelaConcluida 
          aoVoltar={() => window.location.href = '/projetos'} 
          aoNovo={() => window.location.href = '/'} 
        />
      )}
    </div>
  );
}

