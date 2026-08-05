"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
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
  Loader2,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { generateVideoPrompts } from "@/config/videoPrompts";
import { FLOW_CREDITS, getRemainingTime } from "@/config/credits";
import { calculatePricing } from "@/config/pricing";
import { CityAutocomplete } from "./city-autocomplete";

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
import { PAISES, cidadesDe, regioesDe } from "@/lib/locais";
import { TelaGeracao } from "./tela-geracao";

import { SalaProducao, TelaConcluida } from "./sala-producao";
import { cn } from "@/lib/utils";

import { saveProjectStep, loadProject, setCurrentProjectId, getCurrentProjectId } from "@/lib/persistence";
import { toast } from "sonner";

const TITULOS = ["Radar de Oportunidades", "Briefing", "Fechamento", "Produção"];

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
  const [manualNome, setManualNome] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [paisId, setPaisId] = useState("BR");
  const [regiaoId, setRegiaoId] = useState("");
  const [cidade, setCidade] = useState("");
  const [resultados, setResultados] = useState<ImovelEncontrado[]>([]);

  // Radar States
  const [buscando, setBuscando] = useState(false);
  const [progressoTexto, setProgressoTexto] = useState("");
  const [filtro, setFiltro] = useState<'todos' | 'alta' | 'media' | 'sem_site' | 'poucas_fotos'>('todos');
  const [ordenacao, setOrdenacao] = useState<'score' | 'avaliacoes' | 'sem_site'>('score');
  const [atualizadoHa, setAtualizadoHa] = useState<number | null>(null);
  const [totalVarridos, setTotalVarridos] = useState(0);

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

  const resultadosFiltrados = useMemo(() => {
    let base = [...resultados];
    
    if (filtro === 'alta') base = base.filter(r => r.score?.faixa === 'ALTA');
    if (filtro === 'media') base = base.filter(r => r.score?.faixa === 'MEDIA');
    if (filtro === 'sem_site') base = base.filter(r => !r.site);
    if (filtro === 'poucas_fotos') base = base.filter(r => r.fotos < 10);

    if (ordenacao === 'score') base.sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0));
    if (ordenacao === 'avaliacoes') base.sort((a, b) => (b.avaliacoes || 0) - (a.avaliacoes || 0));
    if (ordenacao === 'sem_site') base.sort((a, b) => (a.site ? 1 : 0) - (b.site ? 1 : 0));

    return base;
  }, [resultados, filtro, ordenacao]);

  const stats = useMemo(() => {
    return {
      varridos: totalVarridos,
      alta: resultados.filter(r => r.score?.faixa === 'ALTA').length,
      semSite: resultados.filter(r => !r.site).length
    };
  }, [resultados, totalVarridos]);

  const exportarCSV = useCallback(() => {
    if (resultados.length === 0) return;
    const headers = ["Nome", "Endereço", "Score", "Faixa", "Telefone", "Site", "Link Maps"];
    const rows = resultados.map(r => [
      r.nome,
      r.endereco,
      r.score?.total || 0,
      r.score?.faixa || "",
      r.telefone || "",
      r.site || "",
      r.mapa || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `radar_nexofly_${cidade.toLowerCase().replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exportado com sucesso!");
  }, [resultados, cidade]);

  const ativarRadar = async (force: boolean = false) => {
    if (!cidade) {
      toast.error("Selecione uma cidade primeiro.");
      return;
    }

    setBuscando(true);
    setProgressoTexto("Iniciando radar...");
    setResultados([]);
    setAtualizadoHa(null);

    const checkPoints = [
      "Localizando cidade...",
      "Acessando base do Google...",
      "Varrendo pousadas e chalés...",
      "Identificando casas de temporada...",
      "Deduplicando resultados...",
      "Calculando Score de Oportunidade..."
    ];

    let cpIdx = 0;
    const interval = setInterval(() => {
      if (cpIdx < checkPoints.length) {
        setProgressoTexto(checkPoints[cpIdx]);
        cpIdx++;
      }
    }, 1500);

    try {
      const r = await fetch("/api/imoveis", { 
        method: "POST", 
        body: JSON.stringify({ modalidade, cidade, pais: paisId, regiao: regiaoId, forceRefresh: force }),
        headers:{"Content-Type":"application/json"} 
      });
      const d = await r.json();
      
      if (d.erro) throw new Error(d.erro);
      
      setResultados(d.imoveis ?? []);
      setTotalVarridos(d.total || d.imoveis?.length || 0);
      if (d.fonte === 'cache') setAtualizadoHa(d.atualizado_ha);
      
      toast.success(d.fonte === 'cache' ? "Resultados carregados do cache." : "Radar concluído com sucesso!");
    } catch (err: any) {
      console.error('Erro no radar:', err);
      toast.error(err.message || "Falha na varredura. Tente novamente.");
    } finally {
      clearInterval(interval);
      setBuscando(false);
      setProgressoTexto("");
    }
  };




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
    return await saveProjectStep(step, { modalidade, escolhido, publico, comodos, diaria, valorImobiliario, estilo, videoVertical, paisId, regiaoId, cidade }, status);
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
        <div className="space-y-6 motion-safe:animate-rise pb-20">
            {/* Modalidade */}
            <div className="grid gap-4 sm:grid-cols-2">
                {MODALIDADES.map((m) => (
                  <button 
                    key={m.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setModalidade(m.id);
                    }} 
                    className={cn(
                      "glass p-6 rounded-2xl text-left transition-all hover:bg-white/5", 
                      modalidade === m.id && "rim-lit border-chrome/50"
                    )}
                  >
                      <div className="flex items-center gap-3 mb-2">
                        <m.icone className={cn("size-5", modalidade === m.id ? "text-chrome" : "text-stone")} />
                        <h3 className="text-bone font-medium">{m.titulo}</h3>
                      </div>
                      <p className="text-xs text-stone">{m.desc}</p>
                  </button>
                ))}
            </div>

            {/* Radar Header -> Fluxo Manual Sem API */}
            {modalidade && (
                <div className="space-y-6">
                  <div className="glass p-6 rounded-2xl border-white/5">
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-stone px-1">País</label>
                          <select 
                            value={paisId}
                            onChange={(e) => {
                              setPaisId(e.target.value);
                              setRegiaoId("");
                              setCidade("");
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 text-sm appearance-none"
                          >
                            {PAISES.map(p => (
                              <option key={p.id} value={p.id} className="bg-ink">{p.bandeira} {p.nome}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-stone px-1">Estado/Região</label>
                          <select 
                            value={regiaoId}
                            onChange={(e) => {
                              setRegiaoId(e.target.value);
                              setCidade("");
                            }}
                            disabled={!regioesDe(paisId).length}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 text-sm appearance-none disabled:opacity-50"
                          >
                            <option value="" className="bg-ink">Selecione...</option>
                            {regioesDe(paisId).map(r => (
                              <option key={r.id} value={r.id} className="bg-ink">{r.nome}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-stone px-1">Cidade</label>
                          <select 
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            disabled={!cidadesDe(paisId, regiaoId).length}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 text-sm appearance-none disabled:opacity-50"
                          >
                            <option value="" className="bg-ink">Selecione...</option>
                            {cidadesDe(paisId, regiaoId).map(c => (
                              <option key={c} value={c} className="bg-ink">{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {cidade && (
                        <div className="space-y-6 pt-4 border-t border-white/5 motion-safe:animate-rise">
                          <div className="text-center space-y-2">
                            <h4 className="text-bone font-medium">1. Encontre o imóvel</h4>
                            <p className="text-xs text-stone">Clique abaixo para buscar imóveis nesta região:</p>
                            
                            {modalidade === 'temporada' ? (
                              <a 
                                href={`https://www.airbnb.com.br/s/${cidade.replace(/ /g, '-')}/homes`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
                              >
                                <ExternalLink className="size-4" /> Buscar no Airbnb
                              </a>
                            ) : (
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cidade)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-chrome text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
                              >
                                <ExternalLink className="size-4" /> Buscar no Google Maps
                              </a>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div className="text-center">
                              <h4 className="text-bone font-medium">2. Identifique o imóvel</h4>
                              <p className="text-xs text-stone">Cole os dados do imóvel que você escolheu:</p>
                            </div>
                            
                            <div className="space-y-3">
                              <input 
                                type="text"
                                placeholder="Nome ou endereço do imóvel..."
                                value={manualNome}
                                onChange={(e) => setManualNome(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 text-sm"
                              />
                              <input 
                                type="text"
                                placeholder="Link do anúncio/local (opcional)..."
                                value={manualLink}
                                onChange={(e) => setManualLink(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bone focus:outline-none focus:ring-1 focus:ring-chrome/50 text-sm"
                              />
                            </div>

                            <button 
                              disabled={!manualNome}
                              onClick={() => {
                                const manualImovel: ImovelEncontrado = {
                                  id: `manual-${Date.now()}`,
                                  nome: manualNome,
                                  endereco: cidade,
                                  nota: null,
                                  avaliacoes: null,
                                  telefone: null,
                                  site: manualLink || null,
                                  mapa: modalidade === 'imobiliario' ? manualLink : null,
                                  airbnb: modalidade === 'temporada' ? manualLink : null,
                                  fotos: 0,
                                  score: { total: 0, faixa: 'MEDIA', signals: ["Inserção manual"], angulo: "Proposta personalizada" }
                                };
                                setEscolhido(manualImovel);
                                avancar();
                              }} 
                              className={cn(
                                "metal-pill w-full py-4 rounded-2xl text-black font-bold hover:scale-[1.02] active:scale-95 transition-all text-lg shadow-xl shadow-chrome/10 flex items-center justify-center gap-2",
                                !manualNome && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <ArrowRight className="size-5" /> Usar este imóvel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Imóvel de Exemplo */}
                  <div className="text-center py-4">
                    <button 
                      onClick={() => {
                        const exemplo: ImovelEncontrado = {
                          id: "exemplo-1",
                          nome: "Casa de Praia Luxo (Exemplo)",
                          endereco: "Bertioga, SP",
                          nota: 4.8,
                          avaliacoes: 120,
                          telefone: "(11) 99999-9999",
                          site: "https://exemplo.com",
                          mapa: "https://maps.google.com",
                          airbnb: "https://airbnb.com",
                          fotos: 15,
                          score: { total: 85, faixa: 'ALTA', signals: ["Alta demanda", "Fotos antigas"], angulo: "Maximização de Valor" }
                        };
                        setEscolhido(exemplo);
                        avancar();
                      }}
                      className="text-stone text-xs hover:text-chrome transition-colors underline decoration-stone/30 underline-offset-4"
                    >
                      Ou usar um imóvel de exemplo
                    </button>
                  </div>
                </div>
            )}

          </div>
        )
      }

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


