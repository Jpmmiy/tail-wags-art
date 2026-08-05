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

const PACOTE = [
  { id: "fotos", rotulo: "Fotos tratadas" },
  { id: "video", rotulo: "Vídeo curto" },
  { id: "site", rotulo: "Site com reserva direta" },
  { id: "abordagem", rotulo: "Proposta" },
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

function Diagnostico({ imovel }: { imovel: ImovelEncontrado }) {
  const diagnos = useMemo(() => {
    const d = [];
    if (imovel.fotos < 5) d.push("Poucas fotos publicadas → anúncio perde clique antes da descrição");
    if (!imovel.site) d.push("Sem site próprio → depende 100% da plataforma");
    if (imovel.nota && imovel.nota < 4.2) d.push("Avaliação abaixo de 4.2 → ocupação em risco");
    return d.length ? d : ["Presença digital OK."];
  }, [imovel]);

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h3 className="text-[1.1rem] font-medium text-bone">Diagnóstico: {imovel.nome}</h3>
        <p className="mt-4 text-[0.88rem] text-stone space-y-2">
          {diagnos.map((d, i) => <p key={i}>• {d}</p>)}
        </p>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="text-[1.1rem] font-medium text-bone">O que a Nexofly vai resolver</h3>
        <ul className="mt-4 space-y-2 text-[0.88rem] text-stone">
           {PACOTE.map(p => <li key={p.id}>✅ {p.rotulo}</li>)}
        </ul>
      </div>
    </div>
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
  const [comodos, setComodos] = useState<string[]>(["Quarto principal", "Sala de estar"]);
  const [entregaveis, setEntregaveis] = useState<string[]>(["fotos", "video", "site", "abordagem"]);
  const [diaria, setDiaria] = useState("250");
  const [diariaSlider, setDiariaSlider] = useState(250);

  const resultadosFiltrados = useMemo(() => {
    if (filtroScore === "TODOS") return resultados;
    return resultados.filter((r) => r.score?.faixa === filtroScore);
  }, [resultados, filtroScore]);

  const contagemAlta = resultados.filter((r) => r.score?.faixa === "ALTA").length;

  const avancar = () => setPasso((p) => p + 1);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Nova entrega</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-bone">Quiz de {TITULOS[passo]}</h1>
      </header>

      <Progresso passo={passo} />

      {passo === 0 && (
         <div className="glass p-6">
           {/* ... busca ... */}
           {resultados.length > 0 && (
             <ul className="grid gap-4 sm:grid-cols-2">
                {resultadosFiltrados.map(im => (
                  <li key={im.id} className="glass p-4 rounded-xl cursor-pointer" onClick={() => { setEscolhido(im); }}>
                     {im.nome} <button onClick={avancar}>Usar</button>
                  </li>
                ))}
             </ul>
           )}
         </div>
      )}

      {passo === 1 && escolhido && (
        <Diagnostico imovel={escolhido} />
      )}

      {passo === 2 && (
        <div className="space-y-6 glass p-6">
          <label>Público
            <div className="flex gap-2">
              {['Casais', 'Famílias', 'Trabalho', 'Grupos'].map(p => (
                <button key={p} onClick={() => {
                  setPublico(p.toLowerCase());
                  const mapa: any = { Casais: "aconchegante", Famílias: "claro", Trabalho: "limpo", Grupos: "vibrante" };
                  setEstilo(mapa[p]);
                }} className="px-4 py-2 bg-white/10 rounded">{p}</button>
              ))}
            </div>
          </label>
          <label>Diária (R$)
            <input type="range" min="80" max="1500" step="10" value={diariaSlider} onChange={(e) => setDiariaSlider(Number(e.target.value))} />
            {diariaSlider}
          </label>
        </div>
      )}

      <button onClick={avancar}>Continuar</button>
    </div>
  );
}
