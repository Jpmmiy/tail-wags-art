"use client";

import { useState, useMemo } from "react";
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
  Eye,
  EyeOff,
  Flame,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import {
  ESTILOS,
  PUBLICOS,
  COMODOS,
  promptFoto,
  promptVideo,
  promptSite,
  abordagem,
  precificacao,
  type Respostas,
  type ImovelSelecionado,
} from "@/lib/gerador";
import {
  PAISES,
  achaPais,
  regioesDe,
  cidadesDe,
  nomeRegiao,
  nomePais,
} from "@/lib/locais";
import type { ImovelEncontrado, Modalidade } from "@/lib/imoveis-tipos";
import { TelaGeracao } from "./tela-geracao";
import { cn } from "@/lib/utils";

const TITULOS = ["Alvo", "Diagnóstico", "Briefing", "Plano"];

const MODALIDADES = [
  {
    id: "temporada" as const,
    icone: Home,
    titulo: "Airbnb e temporada",
    desc: "Pousadas, chalés e casas anunciadas por diária.",
    exemplos: ["Airbnb", "Booking", "Pousadas"],
  },
  {
    id: "imobiliario" as const,
    icone: Building2,
    titulo: "Mercado imobiliário",
    desc: "Imobiliárias e imóveis para alugar ou vender.",
    exemplos: ["Imobiliárias", "Corretores", "Construtoras"],
  },
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
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold transition-all duration-500",
                  feito && "metal-pill text-[#08090B]",
                  atual && "border border-chrome bg-chrome/10 text-chrome",
                  !feito && !atual && "border border-white/14 text-stone",
                )}
              >
                {feito ? <Check className="size-3" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate text-[0.85rem] transition-colors sm:block",
                  atual ? "font-medium text-bone" : "text-stone",
                )}
              >
                {t}
              </span>
            </div>
            {i < TITULOS.length - 1 && (
              <span
                aria-hidden
                className="h-px flex-1 overflow-hidden rounded-full bg-white/10"
              >
                <span
                  className={cn(
                    "block h-full origin-left bg-chrome transition-transform duration-700 ease-out",
                    feito ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Seletor({ rotulo, valor, onChange, children, desabilitado }: any) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
        {rotulo}
      </span>
      <select
        value={valor}
        disabled={desabilitado}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3.5 text-[0.9rem] text-bone outline-none transition-colors focus-visible:border-chrome disabled:opacity-40"
      >
        {children}
      </select>
    </label>
  );
}

function Peca({ icone: Icone, titulo, legenda, texto, indice }: any) {
  return (
    <article
      style={{ animationDelay: `${indice * 90}ms` }}
      className="glass overflow-hidden rounded-2xl motion-safe:animate-rise"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="metal-pill grid size-9 shrink-0 place-items-center rounded-lg text-[#08090B]">
            <Icone className="size-4" strokeWidth={2} />
          </span>
          <div>
            <h3 className="text-[0.95rem] font-medium text-bone">{titulo}</h3>
            <p className="text-[0.76rem] text-stone">{legenda}</p>
          </div>
        </div>
        <button className="text-[10px] uppercase tracking-wider text-stone border border-white/10 px-2 py-1 rounded">Copiar</button>
      </header>
      <div className="px-5 py-5 text-[0.85rem] text-stone whitespace-pre-wrap">{texto}</div>
    </article>
  );
}

export function Quiz() {
  const [passo, setPasso] = useState(0);
  const [modalidade, setModalidade] = useState<Modalidade | null>(null);
  const [escolhido, setEscolhido] = useState<ImovelEncontrado | null>(null);

  const [pais, setPais] = useState("BR");
  const [regiao, setRegiao] = useState("MG");
  const [cidade, setCidade] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<ImovelEncontrado[]>([]);
  const [filtroScore, setFiltroScore] = useState<"TODOS" | "ALTA" | "MEDIA">("TODOS");

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


  const inferirEstilo = (p: string) => {
    const mapa: Record<string, string> = {
      casais: "aconchegante",
      familias: "claro",
      trabalho: "limpo",
      amigos: "vibrante",
      "alto-padrao": "sóbrio",
      investidor: "sóbrio",
    };
    if (mapa[p]) setEstilo(mapa[p]);
  };

  const resultadosFiltrados = useMemo(() => {
    if (filtroScore === "TODOS") return resultados;
    return resultados.filter((r) => r.score?.faixa === filtroScore);
  }, [resultados, filtroScore]);

  const buscar = async () => {
    if (!cidade || !modalidade) return;
    setBuscando(true);
    try {
      const r = await fetch("/api/imoveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modalidade, pais, regiao, cidade }),
      });
      const d = await r.json();
      setResultados(d.imoveis ?? []);
    } finally {
      setBuscando(false);
    }
  };

  const avancar = () => {
    if (passo === 0 && escolhido) {
      const novos = ["video", "abordagem"];
      if (!escolhido.site) novos.push("site");
      if (escolhido.fotos < 10) novos.push("fotos");
      setEntregaveis(novos);
    }
    setPasso(prev => prev + 1);
  };

  const imovel: ImovelSelecionado | null = escolhido ? {
    id: escolhido.id,
    nome: escolhido.nome,
    cidade: escolhido.endereco,
    tipo: modalidade === "temporada" ? "Hospedagem" : "Imóvel",
    anfitriao: "anfitrião",
    diaria: modalidade === "temporada" ? Number(diaria) : Number(valorImobiliario),
    potencial: modalidade === "temporada" ? Number(diaria) * 1.5 : Number(valorImobiliario) * 1.1,
    nota: escolhido.nota || 0,
    avaliacoes: escolhido.avaliacoes || 0,
    fotos: escolhido.fotos || 0,
    problemas: escolhido.score?.signals || [],
  } : null;

  const respostas: Respostas | null = imovel && modalidade ? {
    modalidade, imovel, estilo, publico, comodos, entregaveis,
    notas: {}
  } : null;

  return (
    <div className="space-y-8">
      {gerando && <TelaGeracao aoTerminar={() => { setGerando(false); setPasso(3); }} />}

      <header>
        <p className="eyebrow">Nova entrega</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-bone">{TITULOS[passo]}</h1>
      </header>

      <Progresso passo={passo} />

      {passo === 0 && (
        <section className="space-y-6">
           <div className="grid gap-4 sm:grid-cols-2">
             {MODALIDADES.map(m => (
               <button key={m.id} onClick={() => setModalidade(m.id)} className={cn("glass p-6 text-left rounded-2xl", modalidade === m.id && "rim-lit")}>
                 <h3 className="text-bone font-medium">{m.titulo}</h3>
                 <p className="text-stone text-sm">{m.desc}</p>
               </button>
             ))}
           </div>
           {modalidade && (
             <div className="glass p-6 rounded-2xl flex gap-4">
                <input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Qual cidade?" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-bone" />
                <button onClick={buscar} className="metal-pill px-6 py-2 rounded-xl font-bold text-black">Buscar</button>
             </div>
           )}
           {resultados.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {resultadosFiltrados.map(im => (
                  <li key={im.id} onClick={() => { setEscolhido(im); avancar(); }} className="glass p-5 rounded-2xl cursor-pointer hover:rim-lit transition-all">
                     <div className="flex justify-between">
                       <h4 className="text-bone font-medium">{im.nome}</h4>
                       <span className="text-orange-400 font-bold">{im.score?.total} pts</span>
                     </div>
                     <p className="text-stone text-[0.8rem] mt-1">{im.endereco}</p>
                  </li>
                ))}
              </ul>
           )}
        </section>
      )}

      {passo === 1 && escolhido && (
        <section className="space-y-6 motion-safe:animate-rise">
           <div className="glass p-6 rounded-2xl flex items-center gap-6">
              <div className="size-24 bg-white/5 rounded-xl flex items-center justify-center"><ImageIcon className="text-stone" /></div>
              <div>
                <h2 className="text-xl font-semibold text-bone">{escolhido.nome}</h2>
                <p className="text-stone text-sm">{escolhido.endereco}</p>
              </div>
           </div>
           <div className="glass p-6 rounded-2xl">
              <h3 className="text-bone font-medium mb-4">Diagnóstico do imóvel</h3>
              <div className="space-y-3">
                 {escolhido.score?.signals.map((s, i) => (
                   <p key={i} className="text-stone text-sm flex gap-2">
                     <ChevronRight className="size-4 text-chrome" />
                     {s.split(' — ')[0]} → {s.split(' — ')[1] || "afeta conversão"}
                   </p>
                 ))}
              </div>
           </div>
           <div className="glass p-6 rounded-2xl">
              <h3 className="text-bone font-medium mb-4">O que a Nexofly vai resolver</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                 {PACOTE_CONFIG.map(p => (
                   <div key={p.id} className={cn("p-4 rounded-xl border flex items-center justify-between", entregaveis.includes(p.id) ? "border-chrome/40 bg-chrome/5" : "border-white/5 opacity-50")}>
                      <div className="flex items-center gap-3">
                         <p.icone className="size-4 text-bone" />
                         <span className="text-sm text-bone">{p.rotulo}</span>
                      </div>
                      {entregaveis.includes(p.id) && <Check className="size-4 text-chrome" />}
                   </div>
                 ))}
              </div>
              <button onClick={() => {}} className="text-xs text-stone mt-4 hover:text-bone underline underline-offset-4">ajustar entregáveis</button>
           </div>
           <button onClick={avancar} className="metal-pill w-full py-4 rounded-2xl font-bold text-black text-lg">Confirmar e continuar</button>
        </section>
      )}

      {passo === 2 && (
        <section className="space-y-8 motion-safe:animate-rise">
           <div className="glass p-6 rounded-2xl">
              <h3 className="text-bone font-medium mb-4">1. Público alvo</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                 {(modalidade === 'temporada' ? ['Casais', 'Famílias', 'Trabalho', 'Amigos'] : ['Família', 'Investidor', 'Alto padrão', 'Primeiro imóvel']).map(p => (
                   <button key={p} onClick={() => { setPublico(p.toLowerCase()); inferirEstilo(p.toLowerCase()); }} className={cn("p-3 rounded-xl border text-sm transition-all", publico === p.toLowerCase() ? "border-chrome bg-chrome/10 text-bone" : "border-white/10 text-stone hover:border-white/20")}>
                     {p}
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass p-6 rounded-2xl">
              <h3 className="text-bone font-medium mb-4">2. Ambientes de destaque (máx 4)</h3>
              <div className="flex flex-wrap gap-2">
                 {['Sala', 'Quarto principal', 'Cozinha', 'Varanda/Vista', 'Lazer', 'Banheiro', 'Fachada'].map(c => (
                   <button key={c} onClick={() => {
                      if (comodos.includes(c)) setComodos(comodos.filter(x => x !== c));
                      else if (comodos.length < 4) setComodos([...comodos, c]);
                   }} className={cn("px-4 py-2 rounded-full border text-xs transition-all", comodos.includes(c) ? "border-chrome bg-chrome text-black font-bold" : "border-white/10 text-stone")}>
                     {c}
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass p-6 rounded-2xl">
              <h3 className="text-bone font-medium mb-2">3. {modalidade === 'temporada' ? 'Diária de referência' : 'Valor do imóvel'}</h3>
              <input 
                type="range" 
                min={modalidade === 'temporada' ? 80 : 150000} 
                max={modalidade === 'temporada' ? 1500 : 3000000} 
                step={modalidade === 'temporada' ? 10 : 10000} 
                value={modalidade === 'temporada' ? diaria : valorImobiliario}
                onChange={e => modalidade === 'temporada' ? setDiaria(e.target.value) : setValorImobiliario(e.target.value)}
                className="w-full accent-chrome my-4"
              />
              <div className="flex justify-between text-stone text-xs font-mono">
                 <span>{modalidade === 'temporada' ? 'R$ 80' : 'R$ 150k'}</span>
                 <span className="text-bone text-lg font-bold">R$ {Number(modalidade === 'temporada' ? diaria : valorImobiliario).toLocaleString('pt-BR')}</span>
                 <span>{modalidade === 'temporada' ? 'R$ 1.500' : 'R$ 3M'}</span>
              </div>
           </div>

           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone text-xs">
                <span>Estilo: <b className="text-bone">{estilo}</b></span>
                <button className="text-chrome hover:underline">trocar</button>
              </div>
              <button onClick={() => setGerando(true)} className="metal-pill px-8 py-3 rounded-xl font-bold text-black flex items-center gap-2">
                 Gerar material <Sparkles className="size-4" />
              </button>
           </div>
        </section>
      )}

      {passo === 3 && respostas && (
        <section className="space-y-6 motion-safe:animate-rise">
           <div className="flex flex-wrap gap-2">
            {PACOTE_CONFIG.filter((p) => entregaveis.includes(p.id)).map((p) => (
              <button key={p.id} onClick={() => setAba(p.id)} className={cn("px-4 py-2 rounded-lg text-sm transition-all", aba === p.id ? "bg-white/10 text-bone" : "text-stone hover:bg-white/5")}>
                {p.rotulo}
              </button>
            ))}
          </div>

          <div key={aba} className="space-y-4">
            {aba === "fotos" && comodos.map((c, i) => (
                <Peca key={c} indice={i} icone={ImageIcon} titulo={c} legenda="Direção de foto" texto={promptFoto(respostas, c)} />
            ))}
            {aba === "video" && <Peca indice={0} icone={Clapperboard} titulo="Vídeo do imóvel" legenda="Roteiro e direção" texto={promptVideo(respostas)} />}
            {aba === "site" && <Peca indice={0} icone={LayoutTemplate} titulo="Site do anfitrião" legenda="Briefing da página" texto={promptSite(respostas)} />}
            {aba === "abordagem" && <Peca indice={0} icone={MessageSquare} titulo="Proposta" legenda="Mensagem de abertura" texto={abordagem(respostas)} />}
          </div>
          
          <button onClick={() => setPasso(0)} className="text-stone hover:text-bone text-sm flex items-center gap-2">
             <RotateCcw className="size-4" /> Novo projeto
          </button>
        </section>
      )}
    </div>
  );
}
