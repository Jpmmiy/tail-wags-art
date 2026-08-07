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

const TITULOS = ["Radar de Oportunidades", "Personalização", "Fechamento"];

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
  const [passo, setPasso] = useState(-1);
  const [objetivoVideoTipo, setObjetivoVideoTipo] = useState<"institucional" | "dinamico" | "cinematografico">("dinamico");
  const [possuiDrone, setPossuiDrone] = useState<boolean>(false);
  const [objetivo, setObjetivo] = useState<"site" | "video" | "completo" | null>(null);
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

  // Novos estados de usabilidade
  const [salvando, setSalvando] = useState(false);
  const [ultimoSalvo, setUltimoSalvo] = useState<Date | null>(null);
  const [erroSalvamento, setErroSalvamento] = useState(false);
  const [revisando, setRevisando] = useState(false);
  const [editandoConcluido, setEditandoConcluido] = useState(false);
  const [errosValidacao, setErrosValidacao] = useState<string[]>([]);


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

    const requestId = crypto.randomUUID();


    try {
      const r = await fetch("/api/imoveis", { 
        method: "POST", 
        body: JSON.stringify({ modalidade, cidade, pais: paisId, regiao: regiaoId, forceRefresh: force }),
        headers:{
          "Content-Type":"application/json",
          "x-request-id": requestId
        } 

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
            setPasso(p.current_step ?? 0);
            const props = p.properties?.[0] || {};
            setModalidade(props.modalidade || p.modalidade);
            setEscolhido(props.escolhido);
            setPublico(props.publico || "casais");
            setEntregaveis(props.entregaveis || ["video", "abordagem"]);
            setDiaria(props.diaria || "250");
            setEstilo(props.estilo || "aconchegante");
            setCidade(props.cidade || "");
            setPaisId(props.paisId || "BR");
            setRegiaoId(props.regiaoId || "");
            setObjetivo(props.objetivo);
            setObjetivoVideoTipo(props.objetivoVideoTipo || "dinamico");
            setPossuiDrone(props.possuiDrone || false);
            setVideoVertical(props.videoVertical !== undefined ? props.videoVertical : true);
            
            setProjetoCarregado(p);
            if (p.status === 'concluido' || p.status === 'em_producao') {
              setConcluido(true);
            }
          }
        } catch (err) { 
          console.error("Error loading project in useEffect:", err); 
        }
      }
    };


    resumeProject();
  }, []);



  const autosave = async (step: number, status: any = 'rascunho') => {
    setSalvando(true);
    setErroSalvamento(false);
    console.log("Saving project step:", step, "Status:", status);
    
    // Se for o passo de geração (agora passo 2, indo para fechamento)
    const finalStatus = step === 2 ? 'em_producao' : status;
    
    try {
      const pid = await saveProjectStep(step, { 
        modalidade, escolhido, publico, comodos, diaria, valorImobiliario, estilo, videoVertical, paisId, regiaoId, cidade, entregaveis, objetivo, objetivoVideoTipo, possuiDrone 
      }, finalStatus);
      
      if (pid) {
        setCurrentProjectId(pid);
        setUltimoSalvo(new Date());
      } else {
        throw new Error("Falha ao obter ID do projeto");
      }
      return pid;
    } catch (err) {
      console.error("Erro no autosave:", err);
      setErroSalvamento(true);
      toast.error("Erro ao salvar rascunho. Verifique sua conexão.");
      return null;
    } finally {
      setSalvando(false);
    }
  };

  const validarPasso = (p: number) => {
    const erros: string[] = [];
    if (p === 0) {
      if (!modalidade) erros.push("Selecione a modalidade do imóvel");
      if (!cidade) erros.push("Selecione a cidade");
      if (!escolhido && !manualNome) erros.push("Selecione ou insira um imóvel");
    }
    if (p === 1) {
      if (entregaveis.length === 0) erros.push("Selecione pelo menos um entregável");
      if (!publico) erros.push("Selecione o público-alvo");
    }
    setErrosValidacao(erros);
    return erros.length === 0;
  };

  const avancar = async (s: any = 'rascunho') => {
    if (!validarPasso(passo)) {
      errosValidacao.forEach(e => toast.error(e));
      return;
    }

    const proximo = passo + 1;
    
    // Antes da geração final (indo para o passo 2), forçamos a revisão
    if (proximo === 2 && !revisando && !editandoConcluido) {
      setRevisando(true);
      return;
    }

    // Mostra feedback visual se estiver indo para a geração
    if (proximo === 2 && !editandoConcluido) {
      setGerando(true);
      return; 
    }

    try {
      const pid = await autosave(proximo, s);
      
      if (pid) {
        const p = await loadProject(pid);
        if (p) setProjetoCarregado(p);
        setPasso(proximo);
        setRevisando(false);
      }
    } catch (err) {
      console.error("Erro ao avançar:", err);
    }
  };

  const voltar = () => {
    if (passo > -1) {
      setPasso(passo - 1);
      setRevisando(false);
    }
  };

  const finalizarGeracao = async () => {
    setGerando(false);
    const proximoPasso = 2;
    
    try {
      // Forçamos o salvamento como 'em_producao' para liberar os cards
      const pid = await autosave(proximoPasso, 'em_producao');
      
      if (pid) {
        const p = await loadProject(pid);
        if (p) {
          setProjetoCarregado(p);
          setPasso(proximoPasso);
          return;
        }
      }
    } catch (err) {
      console.error("Erro ao finalizar geração:", err);
    }

    // Fallback absoluto
    setProjetoCarregado({
      id: getCurrentProjectId() || 'temp-' + Date.now(),
      status: 'em_producao',
      current_step: proximoPasso,
      properties: [{ modalidade, escolhido, publico, comodos, diaria, valorImobiliario, estilo, videoVertical, cidade, entregaveis, objetivo }]
    });
    setPasso(proximoPasso);
  };



  const nomeExibicao = useMemo(() => {
    const n = escolhido?.nome?.trim() || "";
    // Se o nome for muito curto ou genérico, usamos um fallback
    if (n.length <= 3) return modalidade === 'temporada' ? "este anúncio" : "este imóvel";
    return n;
  }, [escolhido, modalidade]);

  const whatsMessage = useMemo(() => {
    if (!escolhido) return "";
    const dadoReal = escolhido.nota 
      ? `${escolhido.nota} com ${escolhido.avaliacoes} avaliações` 
      : escolhido.avaliacoes 
        ? `${escolhido.avaliacoes} avaliações`
        : "o potencial de mercado";
    
    return `Oi! Vi o anúncio do ${nomeExibicao} — ${dadoReal} mostra que é um excelente produto.\nReparei que o material visual ainda não acompanha esse nível, o que acaba segurando o clique de muitos interessados.\nMontei uma estratégia de renovação visual e um roteiro de vídeo curto para valorizar o imóvel. Sem compromisso.\nPosso te mandar os detalhes aqui?`;
  }, [escolhido, nomeExibicao]);



  const precos = useMemo(() => {
    return calculatePricing(
      Number(modalidade === 'temporada' ? diaria : valorImobiliario), 
      modalidade || 'temporada',
      entregaveis
    );
  }, [modalidade, diaria, valorImobiliario, entregaveis]);



  return (
    <div className="space-y-8">
      {gerando && <TelaGeracao aoTerminar={finalizarGeracao} />}
      {/* A Sala de Produção foi removida como tela independente e integrada ao Fechamento */}

      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {passo > -1 && !concluido && (
            <button onClick={voltar} className="size-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-stone hover:text-bone transition-colors">
              <ArrowLeft className="size-5" />
            </button>
          )}
          <h1 className="font-display text-3xl font-semibold text-bone">{TITULOS[passo]}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {salvando && (
            <div className="flex items-center gap-2 text-stone text-[0.8rem]">
              <Loader2 className="size-3 animate-spin" />
              <span>Salvando...</span>
            </div>
          )}
          {!salvando && ultimoSalvo && (
            <div className="text-stone/60 text-[0.7rem] flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-chrome/50" />
              Salvo às {ultimoSalvo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          {erroSalvamento && (
            <button onClick={() => autosave(passo)} className="text-red-400 text-[0.8rem] flex items-center gap-1.5 hover:underline">
              <RotateCcw className="size-3" />
              Falha ao salvar. Tentar novamente?
            </button>
          )}
        </div>
      </header>
      {passo >= 0 && <Progresso passo={passo} />}





      
      {passo === -1 && (
        <div className="space-y-8 motion-safe:animate-rise py-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-display font-semibold text-bone">O que vamos criar hoje?</h2>
            <p className="text-stone">Selecione seu objetivo para personalizarmos o fluxo.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
            <button 
              onClick={() => {
                setObjetivo("video");
                setEntregaveis(["video", "abordagem"]);
                setPasso(0);
              }}
              className="glass p-8 rounded-3xl text-left transition-all hover:bg-white/5 rim-lit group"
            >
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-chrome/10 grid place-items-center text-chrome group-hover:scale-110 transition-transform">
                  <Clapperboard className="size-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-semibold text-bone">Fluxo de Vídeos</h3>
                  <p className="text-sm text-stone mt-1">Roteiros profissionais para Airbnb e handoff direto para Google Flow.</p>
                </div>
                <ChevronRight className="size-6 text-stone group-hover:text-chrome transition-colors" />
              </div>
            </button>

            <button 
              onClick={() => {
                setObjetivo("site");
                setEntregaveis(["site", "abordagem"]);
                setPasso(0);
              }}
              className="glass p-8 rounded-3xl text-left transition-all hover:bg-white/5 rim-lit group"
            >
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-chrome/10 grid place-items-center text-chrome group-hover:scale-110 transition-transform">
                  <LayoutTemplate className="size-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-semibold text-bone">Fluxo de Site</h3>
                  <p className="text-sm text-stone mt-1">Estrutura de alta conversão com envio automático para o Lovable.</p>
                </div>
                <ChevronRight className="size-6 text-stone group-hover:text-chrome transition-colors" />
              </div>
            </button>
          </div>
        </div>
      )}

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
        <div className="space-y-8 motion-safe:animate-rise pb-10">
          <div className="glass p-6 rounded-2xl flex gap-6 rim-lit">
            {escolhido.primeiraFoto && <img src={`https://places.googleapis.com/v1/${escolhido.primeiraFoto}/media?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&maxWidthPx=200`} className="size-24 rounded-lg object-cover" />}
            <div>
                <h2 className="text-xl font-semibold text-bone">{nomeExibicao}</h2>
                <div className="space-y-1 mt-2">
                    {escolhido.score?.signals.map((s,i) => <p key={i} className="text-sm text-stone">{s}</p>)}
                </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-bone">O que vamos entregar para o cliente?</label>
              <div className="grid grid-cols-2 gap-4">
                {PACOTE_CONFIG.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => entregaveis.includes(p.id) ? setEntregaveis(entregaveis.filter(x => x !== p.id)) : setEntregaveis([...entregaveis, p.id])} 
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all flex items-center gap-3", 
                        entregaveis.includes(p.id) ? "border-chrome bg-chrome/10 text-chrome" : "border-white/5 text-stone hover:bg-white/5"
                      )}
                    >
                        <p.icone className="size-4" />
                        <span className="text-sm font-medium">{p.rotulo}</span>
                    </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-bone">Estilo visual do vídeo</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dinamico', label: 'Dinâmico' },
                  { id: 'cinematografico', label: 'Cinematográfico' },
                  { id: 'institucional', label: 'Institucional' }
                ].map(o => (
                    <button 
                      key={o.id} 
                      onClick={() => setObjetivoVideoTipo(o.id as any)} 
                      className={cn(
                        "p-3 rounded-xl border text-xs font-medium transition-all", 
                        objetivoVideoTipo === o.id ? "border-chrome bg-chrome/10 text-chrome" : "border-white/10 text-stone hover:bg-white/5"
                      )}
                    >
                      {o.label}
                    </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-bone">Recursos disponíveis</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setPossuiDrone(!possuiDrone)}
                  className={cn(
                    "flex-1 p-4 rounded-xl border text-left transition-all flex items-center justify-between",
                    possuiDrone ? "border-chrome bg-chrome/10 text-chrome" : "border-white/10 text-stone hover:bg-white/5"
                  )}
                >
                  <span className="text-sm">Possui Drone?</span>
                  <div className={cn("size-5 rounded-md border flex items-center justify-center", possuiDrone ? "bg-chrome border-chrome text-black" : "border-white/20")}>
                    {possuiDrone && <Check className="size-3" />}
                  </div>
                </button>
                
                <button 
                  onClick={() => setVideoVertical(!videoVertical)}
                  className={cn(
                    "flex-1 p-4 rounded-xl border text-left transition-all flex items-center justify-between",
                    videoVertical ? "border-chrome bg-chrome/10 text-chrome" : "border-white/10 text-stone hover:bg-white/5"
                  )}
                >
                  <span className="text-sm">Formato Vertical?</span>
                  <div className={cn("size-5 rounded-md border flex items-center justify-center", videoVertical ? "bg-chrome border-chrome text-black" : "border-white/20")}>
                    {videoVertical && <Check className="size-3" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-bone">Público-alvo principal</label>
              <div className="grid grid-cols-3 gap-3">
                {['Casais', 'Famílias', 'Trabalho'].map(p => (
                    <button 
                      key={p} 
                      onClick={() => setPublico(p.toLowerCase())} 
                      className={cn(
                        "p-3 rounded-xl border text-xs font-medium transition-all", 
                        publico === p.toLowerCase() ? "border-chrome bg-chrome/10 text-chrome" : "border-white/10 text-stone hover:bg-white/5"
                      )}
                    >
                      {p}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => avancar()} className="metal-pill w-full py-5 rounded-2xl text-black font-bold text-xl hover:scale-[1.02] transition-all shadow-2xl shadow-chrome/20">
            Gerar minha estratégia
          </button>
        </div>
      )}

      {passo === 2 && (
        <div className="space-y-8 motion-safe:animate-rise pb-12">
            {/* BLOCO 1 — WHATSAPP */}
            <div className="glass p-6 rounded-2xl border-chrome/20 rim-lit">
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

            {/* BLOCO 2 — PRODUÇÃO DE VÍDEO (INTEGRADO) */}
            {entregaveis.includes('video') && (
              <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-chrome/10 grid place-items-center text-chrome">
                    <Clapperboard className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-bone font-medium text-lg">Handoff para Produção</h3>
                    <p className="text-[10px] text-stone uppercase font-bold tracking-wider">Técnica Frames-to-Video no Google Flow</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-xs text-stone font-mono leading-relaxed line-clamp-3 italic">
                      {promptVideo({ 
                        modalidade: modalidade || 'temporada', 
                        imovel: escolhido || {}, 
                        estilo, 
                        publico, 
                        comodos, 
                        entregaveis,
                        notas: { objetivoVideoTipo, possuiDrone }
                      } as any)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={async () => {
                        const prompt = promptVideo({ 
                          modalidade: modalidade || 'temporada', 
                          imovel: escolhido || {}, 
                          estilo, 
                          publico, 
                          comodos, 
                          entregaveis,
                          notas: { objetivoVideoTipo, possuiDrone }
                        } as any);
                        await navigator.clipboard.writeText(prompt);
                        toast.success("Roteiro copiado! Abrindo Google Flow...");
                        setTimeout(() => {
                  window.open('https://labs.google/flow/chat', '_blank');
                        }, 800);
                      }}
                      className="metal-pill w-full py-5 rounded-2xl font-bold text-black text-xl hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-1 shadow-2xl shadow-chrome/20"
                    >
                      <span>Finalizar meu vídeo profissional</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-70">Abrir Google Flow com prompt copiado</span>
                    </button>
                    
                    <p className="text-[10px] text-stone text-center px-4">
                      O prompt estruturado em 6 camadas será copiado automaticamente para você colar no campo de entrada do Google Flow.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* RODAPÉ DA ETAPA */}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setConcluido(true)} 
                  className="w-full py-4 rounded-2xl border border-chrome/30 text-chrome hover:bg-chrome/5 transition-all text-sm font-semibold"
                >
                    Marcar como concluído
                </button>
                <button 
                    onClick={() => { 
                        autosave(passo, 'aguardando_resposta'); 
                        window.location.href='/painel/projetos'; 
                    }} 
                    className="w-full py-3 rounded-2xl text-stone hover:text-bone transition-all text-xs"
                >
                    Salvar e voltar aos projetos
                </button>
            </div>
        </div>
      )}

      {/* A SalaProducao não é mais renderizada aqui, foi integrada à etapa 2 (passo final) */}


      {concluido && (
        <TelaConcluida 
          aoVoltar={() => window.location.href = '/painel/projetos'} 
          aoNovo={() => {
            setCurrentProjectId(null);
            window.location.href = '/painel/criar';
          }} 

        />
      )}
    </div>
  );
}


