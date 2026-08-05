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

const TITULOS = ["Imóvel", "Briefing", "Entrega"];

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
  {
    id: "fotos",
    icone: ImageIcon,
    rotulo: "Fotos tratadas",
    desc: "Uma direção por ambiente escolhido",
    detalhe: "Luz, arrumação e enquadramento refeitos sem inventar o que não existe.",
  },
  {
    id: "video",
    icone: Clapperboard,
    rotulo: "Vídeo do imóvel",
    desc: "Tour de 8 segundos",
    detalhe: "Movimento de câmera, hora do dia e foco definidos. Pronto para Stories.",
  },
  {
    id: "site",
    icone: LayoutTemplate,
    rotulo: "Site do anfitrião",
    desc: "Página com reserva direta",
    detalhe: "Galeria, disponibilidade e botão de WhatsApp. Sem taxa de plataforma.",
  },
  {
    id: "abordagem",
    icone: MessageSquare,
    rotulo: "Proposta",
    desc: "Mensagem pronta para enviar",
    detalhe: "Abre a conversa apontando o problema real do anúncio, no tom certo.",
  },
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

function Seletor({
  rotulo,
  valor,
  onChange,
  children,
  desabilitado,
}: {
  rotulo: string;
  valor: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  desabilitado?: boolean;
}) {
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

/** Campo de observação livre, disponível em toda seção do briefing. */
function Nota({
  valor,
  onChange,
  dica,
}: {
  valor: string;
  onChange: (v: string) => void;
  dica: string;
}) {
  const [aberto, setAberto] = useState(!!valor);

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-[0.8rem] text-stone transition-colors hover:text-bone"
      >
        <PenLine className="size-3.5" strokeWidth={1.8} />
        Escrever uma observação
      </button>
    );
  }

  return (
    <textarea
      autoFocus
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder={dica}
      rows={2}
      className="mt-3 w-full resize-y rounded-xl border border-white/12 bg-white/[0.03] p-3.5 text-[0.86rem] leading-relaxed text-bone outline-none transition-colors placeholder:text-stone/50 focus-visible:border-chrome"
    />
  );
}

function Copiar({ texto }: { texto: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(texto);
        setOk(true);
        setTimeout(() => setOk(false), 1800);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-stone transition-colors hover:border-chrome/40 hover:text-bone"
    >
      {ok ? (
        <Check className="size-3" strokeWidth={2.5} />
      ) : (
        <Copy className="size-3" />
      )}
      {ok ? "Copiado" : "Copiar"}
    </button>
  );
}

/**
 * O gerador escreve seções com o rótulo em caixa alta na própria linha
 * ("LUZ", "CÂMERA", "RESTRIÇÕES (obrigatórias)"). Aqui esse rótulo vira
 * cabeçalho de verdade, e o que vem antes do primeiro deles é a abertura.
 * Textos sem rótulo nenhum — a proposta, por exemplo — caem inteiros na
 * abertura e são lidos como mensagem comum.
 */
const ROTULO = /^([A-ZÀ-Ý][A-ZÀ-Ý0-9\s,./&-]{1,38}?)(\s*\([^)]*\))?$/;

type Bloco = { rotulo: string | null; corpo: string };

function emBlocos(texto: string): Bloco[] {
  const blocos: Bloco[] = [{ rotulo: null, corpo: "" }];

  for (const linha of texto.split("\n")) {
    const m = linha.trim().match(ROTULO);
    if (m && linha.trim().length > 2) {
      blocos.push({ rotulo: linha.trim(), corpo: "" });
    } else {
      const atual = blocos[blocos.length - 1];
      atual.corpo += (atual.corpo ? "\n" : "") + linha;
    }
  }

  return blocos
    .map((b) => ({ ...b, corpo: b.corpo.trim() }))
    .filter((b) => b.rotulo || b.corpo);
}

function Corpo({ texto }: { texto: string }) {
  // Item de lista pode ocupar duas linhas, então quem decide é a primeira
  // linha com conteúdo — não todas elas.
  const lista = texto.trimStart().startsWith("-");

  if (lista) {
    return (
      <ul className="space-y-1.5">
        {texto
          .split(/\n(?=\s*-\s)/)
          .map((item) => item.replace(/^\s*-\s*/, "").replace(/\s*\n\s*/g, " "))
          .filter(Boolean)
          .map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[0.85rem] leading-relaxed text-stone">
              <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-chrome/60" />
              {item}
            </li>
          ))}
      </ul>
    );
  }

  return (
    <div className="space-y-3">
      {texto.split(/\n\s*\n/).map((p, i) => (
        <p key={i} className="text-[0.85rem] leading-[1.75] text-stone">
          {p.replace(/\s*\n\s*/g, " ")}
        </p>
      ))}
    </div>
  );
}

function Peca({
  icone: Icone,
  titulo,
  legenda,
  texto,
  indice,
}: {
  icone: typeof ImageIcon;
  titulo: string;
  legenda: string;
  texto: string;
  indice: number;
}) {
  const blocos = emBlocos(texto);
  const abertura = blocos[0]?.rotulo ? null : blocos[0];
  const secoes = abertura ? blocos.slice(1) : blocos;

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
        <Copiar texto={texto} />
      </header>

      <div className="px-5 py-5 sm:px-6">
        {abertura && (
          <div className="rounded-xl bg-white/[0.03] px-4 py-3.5">
            <Corpo texto={abertura.corpo} />
          </div>
        )}

        {secoes.length > 0 && (
          <dl className={cn("grid gap-x-8 gap-y-5 sm:grid-cols-2", abertura && "mt-5")}>
            {secoes.map((b) => (
              <div
                key={b.rotulo}
                className="border-l border-white/12 pl-4 transition-colors hover:border-chrome/40"
              >
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-chrome/70">
                  {b.rotulo}
                </dt>
                <dd className="mt-2">
                  <Corpo texto={b.corpo} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}

export function Quiz() {
  const [passo, setPasso] = useState(0);
  const [modalidade, setModalidade] = useState<Modalidade | null>(null);

  const [pais, setPais] = useState("BR");
  const [regiao, setRegiao] = useState("MG");
  const [cidade, setCidade] = useState("");

  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [fonte, setFonte] = useState<"google" | "exemplo" | null>(null);
  const [resultados, setResultados] = useState<ImovelEncontrado[]>([]);
  const [escolhido, setEscolhido] = useState<ImovelEncontrado | null>(null);

  const [estilo, setEstilo] = useState("aconchegante");
  const [publico, setPublico] = useState("casais");
  const [comodos, setComodos] = useState<string[]>([
    "Quarto principal",
    "Sala de estar",
  ]);
  const [entregaveis, setEntregaveis] = useState<string[]>([
    "fotos",
    "video",
    "site",
    "abordagem",
  ]);
  const [notas, setNotas] = useState<Respostas["notas"]>({});
  const [diaria, setDiaria] = useState("280");

  const [gerando, setGerando] = useState(false);
  const [aba, setAba] = useState("fotos");

  const [filtroScore, setFiltroScore] = useState<"TODOS" | "ALTA" | "MEDIA">("TODOS");

  const resultadosFiltrados = useMemo(() => {
    if (filtroScore === "TODOS") return resultados;
    return resultados.filter((r) => r.score?.faixa === filtroScore);
  }, [resultados, filtroScore]);

  const contagemAlta = resultados.filter((r) => r.score?.faixa === "ALTA").length;

  // Região e cidade são derivadas, não sincronizadas por efeito
  const temRegioes = !!achaPais(pais)?.regioes;
  const regioes = regioesDe(pais);
  const regiaoValida = temRegioes
    ? regioes.some((r) => r.id === regiao)
      ? regiao
      : (regioes[0]?.id ?? "")
    : "";

  const cidades = cidadesDe(pais, regiaoValida);
  const cidadeValida = cidades.includes(cidade) ? cidade : (cidades[0] ?? "");

  const limparBusca = () => {
    setResultados([]);
    setEscolhido(null);
    setErro(null);
  };

  const alterna = (lista: string[], set: (v: string[]) => void, item: string) =>
    set(
      lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item],
    );

  const buscar = async () => {
    if (!cidadeValida || !modalidade) return;
    setBuscando(true);
    setErro(null);
    setEscolhido(null);
    try {
      const r = await fetch("/api/imoveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modalidade,
          pais,
          regiao: regiaoValida || undefined,
          cidade: cidadeValida,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.erro ?? "Busca falhou.");
      setResultados(d.imoveis ?? []);
      setFonte(d.fonte ?? null);
      if (!d.imoveis?.length) setErro("Nada encontrado nessa cidade.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Busca falhou.");
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  };

  const imovel: ImovelSelecionado | null = escolhido
    ? {
        id: escolhido.id,
        nome: escolhido.nome,
        cidade: escolhido.endereco,
        tipo: modalidade === "temporada" ? "Hospedagem" : "Imóvel",
        anfitriao: "anfitrião",
        diaria: Number(diaria) || 0,
        potencial: Math.round((Number(diaria) || 0) * 1.45),
        mapa: escolhido.mapa,
        airbnb: escolhido.airbnb,
        site: escolhido.site,
      }
    : null;

  const respostas: Respostas | null =
    imovel && modalidade
      ? { modalidade, imovel, estilo, publico, comodos, entregaveis, notas }
      : null;

  const reiniciar = () => {
    setPasso(0);
    setModalidade(null);
    limparBusca();
    setNotas({});
  };

  const podeAvancar =
passo === 0 ? !!escolhido : true;

  return (
    <div className="space-y-8">
      {gerando && (
        <TelaGeracao
          aoTerminar={() => {
            setGerando(false);
            setPasso(2);
          }}
        />
      )}

      <header>
        <p className="eyebrow">Nova entrega</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-[2.6rem]">
          {passo === 2 ? "Material pronto." : "Três passos."}
        </h1>
        <p className="mt-1.5 text-[0.95rem] text-stone">
          {passo === 2
            ? "A Nexofly produziu com as ferramentas conectadas."
            : "Escolha o imóvel e a direção. O resto é com a plataforma."}
        </p>
      </header>

      <Progresso passo={passo} />

      {/* 0 — Mercado, local e escolha do imóvel */}
      {passo === 0 && (
        <section className="space-y-5">
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
              Em que mercado você vai atuar
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {MODALIDADES.map((m, i) => {
                const Icone = m.icone;
                const on = modalidade === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setModalidade(m.id);
                      limparBusca();
                    }}
                    aria-pressed={on}
                    aria-label={`${m.titulo}. ${m.desc}`}
                    style={{ animationDelay: `${i * 90}ms` }}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 motion-safe:animate-rise",
                      on
                        ? "glass-deep rim-lit -translate-y-1"
                        : "glass hover:-translate-y-1",
                    )}
                  >
                    {/* halo que acende quando o cartão é escolhido */}
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-[radial-gradient(65%_120%_at_50%_0%,rgba(255,255,255,0.12),transparent_70%)] transition-opacity duration-700",
                        on ? "opacity-100" : "opacity-0",
                      )}
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "grid size-12 place-items-center rounded-xl transition-all duration-500",
                          on
                            ? "metal-pill scale-105 text-[#08090B]"
                            : "bg-white/6 text-stone group-hover:text-bone",
                        )}
                      >
                        <Icone className="size-5" strokeWidth={1.9} />
                      </span>
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full border transition-all duration-400",
                          on
                            ? "scale-110 border-chrome bg-chrome text-[#08090B]"
                            : "border-white/18",
                        )}
                      >
                        {on && <Check className="size-3.5" strokeWidth={3.2} />}
                      </span>
                    </div>

                    <h3 className="relative mt-5 font-display text-[1.2rem] font-semibold text-bone">
                      {m.titulo}
                    </h3>
                    <p className="relative mt-1.5 text-[0.88rem] leading-relaxed text-stone">
                      {m.desc}
                    </p>

                    <ul className="relative mt-4 flex flex-wrap gap-1.5">
                      {m.exemplos.map((e) => (
                        <li
                          key={e}
                          className="rounded-md bg-white/6 px-2 py-1 text-[0.72rem] text-stone"
                        >
                          {e}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          {modalidade && (
          <div className="glass rounded-2xl p-6 motion-safe:animate-rise sm:p-7">
            <h2 className="font-display text-lg font-semibold text-bone">
              Onde você quer atender?
            </h2>
            <p className="mt-1 text-[0.86rem] text-stone">
              Só escolher nas listas. Nada para digitar.
            </p>

            <div
              className={cn(
                "mt-5 grid gap-4",
                temRegioes ? "sm:grid-cols-3" : "sm:grid-cols-2",
              )}
            >
              <Seletor
                rotulo="País"
                valor={pais}
                onChange={(v) => {
                  setPais(v);
                  limparBusca();
                }}
              >
                {PAISES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-ink">
                    {p.bandeira} {p.nome}
                  </option>
                ))}
              </Seletor>

              {temRegioes && (
                <Seletor
                  rotulo="Estado"
                  valor={regiaoValida}
                  onChange={(v) => {
                    setRegiao(v);
                    limparBusca();
                  }}
                >
                  {regioes.map((r) => (
                    <option key={r.id} value={r.id} className="bg-ink">
                      {r.nome}
                    </option>
                  ))}
                </Seletor>
              )}

              <Seletor
                rotulo="Cidade"
                valor={cidadeValida}
                onChange={(v) => {
                  setCidade(v);
                  limparBusca();
                }}
                desabilitado={!cidades.length}
              >
                {cidades.map((c) => (
                  <option key={c} value={c} className="bg-ink">
                    {c}
                  </option>
                ))}
              </Seletor>
            </div>

            <button
              type="button"
              onClick={buscar}
              disabled={buscando || !cidadeValida}
              className="metal-pill mt-5 inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[0.88rem] font-semibold text-[#08090B] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
            >
              {buscando ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-black/25 border-t-black/70" />
                  Procurando
                </>
              ) : (
                <>
                  <Search className="size-4" strokeWidth={2} />
                  Buscar imóveis
                </>
              )}
            </button>
          </div>
          )}

          {erro && (
            <p className="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-[0.86rem] text-destructive">
              {erro}
            </p>
          )}

          {fonte === "exemplo" && resultados.length > 0 && (
            <p className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[0.82rem] text-stone">
              <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
              Estes são resultados de demonstração. Configure{" "}
              <code className="font-mono text-bone">GOOGLE_MAPS_API_KEY</code>{" "}
              no ambiente para a busca real entrar no ar.
            </p>
          )}

          {resultados.length > 0 && (
            <div className="motion-safe:animate-rise">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-[0.95rem] font-medium text-bone">
                    {resultados.length} imóveis encontrados
                  </h2>
                  <p className="mt-1 text-[0.82rem] text-stone">
                    {contagemAlta} com oportunidade alta em {cidadeValida}
                  </p>
                </div>
                
                <div className="flex rounded-xl bg-white/5 p-1">
                  {(["TODOS", "ALTA", "MEDIA"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFiltroScore(f)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-[0.75rem] font-medium transition-all",
                        filtroScore === f 
                          ? "bg-white/10 text-bone shadow-sm" 
                          : "text-stone hover:text-bone"
                      )}
                    >
                      {f.charAt(0) + f.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="grid gap-4 sm:grid-cols-2">
                {resultadosFiltrados.map((im) => {
                  const on = escolhido?.id === im.id;
                  const sc = im.score;
                  
                  return (
                    <li key={im.id}>
                      <div
                        className={cn(
                          "group relative flex h-full flex-col rounded-2xl p-5 transition-all duration-300",
                          on
                            ? "glass-deep shadow-[0_0_0_1px_var(--chrome)_inset]"
                            : "glass hover:-translate-y-0.5",
                        )}
                      >
                        {sc && (
                          <div className="mb-4 flex items-center justify-between">
                            <div className={cn(
                              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider",
                              sc.faixa === 'ALTA' ? "bg-orange-500/20 text-orange-400" :
                              sc.faixa === 'MEDIA' ? "bg-amber-500/20 text-amber-400" :
                              "bg-stone-500/20 text-stone-400"
                            )}>
                              {sc.faixa === 'ALTA' && <Flame className="size-3" />}
                              {sc.faixa === 'MEDIA' && <AlertCircle className="size-3" />}
                              {sc.total} pts · {sc.faixa}
                            </div>
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-display text-[1.05rem] font-semibold text-bone group-hover:text-chrome transition-colors">
                            {im.nome}
                          </h3>
                          <p className="mt-1 flex items-start gap-1.5 text-[0.78rem] text-stone">
                            <MapPin className="mt-0.5 size-3 shrink-0" strokeWidth={1.8} />
                            {im.endereco}
                          </p>
                          
                          {sc && (
                            <div className="mt-4 space-y-2">
                              {sc.signals.map((sig, i) => (
                                <p key={i} className="flex items-start gap-2 text-[0.82rem] leading-tight text-stone/90">
                                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-chrome/40" />
                                  {sig}
                                </p>
                              ))}
                              <p className="mt-3 text-[0.82rem] font-medium text-chrome/90 italic">
                                {sc.angulo}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                          <button
                            type="button"
                            onClick={() => setEscolhido(im)}
                            className={cn(
                              "w-full rounded-xl py-2.5 text-[0.85rem] font-semibold transition-all",
                              on 
                                ? "metal-pill text-black" 
                                : "bg-white/5 text-bone hover:bg-white/10"
                            )}
                          >
                            {on ? "Imóvel selecionado" : "Usar este imóvel"}
                          </button>
                          
                          <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                            {im.mapa && (
                              <a
                                href={im.mapa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[0.7rem] text-stone/60 hover:text-chrome"
                              >
                                <ExternalLink className="size-3" />
                                Maps
                              </a>
                            )}
                            {im.airbnb && (
                              <a
                                href={im.airbnb}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[0.7rem] text-stone/60 hover:text-chrome"
                              >
                                <ExternalLink className="size-3" />
                                Airbnb
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 2 — Briefing */}
      {passo === 1 && escolhido && (
        <section className="space-y-5">
          <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <span className="metal-pill grid size-10 place-items-center rounded-xl text-[#08090B]">
                <Sparkles className="size-4" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[0.95rem] font-medium text-bone">
                  {escolhido.nome}
                </p>
                <p className="text-[0.78rem] text-stone">{escolhido.endereco}</p>
              </div>
            </div>
            <label className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                Diária
              </span>
              <span className="flex items-center gap-1 rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2">
                <span className="text-[0.82rem] text-stone">R$</span>
                <input
                  value={diaria}
                  onChange={(e) =>
                    setDiaria(e.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                  inputMode="numeric"
                  className="w-16 bg-transparent text-[0.9rem] text-bone outline-none"
                />
              </span>
            </label>
          </div>

          {/* pacote em destaque */}
          <div className="glass rounded-2xl p-6 sm:p-7">
            <h2 className="font-display text-lg font-semibold text-bone">
              O que entra no pacote
            </h2>
            <p className="mt-1 text-[0.86rem] text-stone">
              Cada item vira uma peça pronta para entregar ao cliente.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PACOTE.map((p) => {
                const Icone = p.icone;
                const on = entregaveis.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => alterna(entregaveis, setEntregaveis, p.id)}
                    aria-pressed={on}
                    aria-label={`${p.rotulo}. ${p.detalhe}`}
                    className={cn(
                      "relative rounded-2xl p-5 text-left transition-all duration-400",
                      on
                        ? "glass-deep rim-lit -translate-y-0.5"
                        : "border border-white/10 bg-white/[0.02] hover:border-white/25",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-400",
                          on
                            ? "metal-pill text-[#08090B]"
                            : "bg-white/6 text-stone",
                        )}
                      >
                        <Icone className="size-[18px]" strokeWidth={1.9} />
                      </span>
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          on
                            ? "border-chrome bg-chrome text-[#08090B]"
                            : "border-white/20",
                        )}
                      >
                        {on && <Check className="size-3" strokeWidth={3.2} />}
                      </span>
                    </div>

                    <h3 className="mt-4 text-[0.98rem] font-medium text-bone">
                      {p.rotulo}
                    </h3>
                    <p className="mt-0.5 text-[0.78rem] text-stone">{p.desc}</p>
                    <p
                      className={cn(
                        "grid text-[0.8rem] leading-relaxed text-stone transition-all duration-400",
                        on
                          ? "mt-3 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">{p.detalhe}</span>
                    </p>
                  </button>
                );
              })}
            </div>

            <Nota
              valor={notas.pacote ?? ""}
              onChange={(v) => setNotas((n) => ({ ...n, pacote: v }))}
              dica="Algo específico para esta entrega? Ex: incluir a área da piscina no vídeo."
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-[1.05rem] font-semibold text-bone">
                Clima do imóvel
              </h2>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {ESTILOS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setEstilo(e.id)}
                    aria-pressed={estilo === e.id}
                    className={cn(
                      "rounded-xl border p-3.5 text-left transition-all duration-300",
                      estilo === e.id
                        ? "border-chrome/60 bg-white/[0.09]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25",
                    )}
                  >
                    <span className="block text-[0.88rem] font-medium text-bone">
                      {e.rotulo}
                    </span>
                    <span className="mt-0.5 block text-[0.74rem] text-stone">
                      {e.desc}
                    </span>
                  </button>
                ))}
              </div>
              <Nota
                valor={notas.estilo ?? ""}
                onChange={(v) => setNotas((n) => ({ ...n, estilo: v }))}
                dica="Ex: manter a lareira acesa nas fotos da sala."
              />
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-[1.05rem] font-semibold text-bone">
                Quem se hospeda
              </h2>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {PUBLICOS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPublico(p.id)}
                    aria-pressed={publico === p.id}
                    className={cn(
                      "rounded-xl border p-3.5 text-left transition-all duration-300",
                      publico === p.id
                        ? "border-chrome/60 bg-white/[0.09]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25",
                    )}
                  >
                    <span className="block text-[0.88rem] font-medium text-bone">
                      {p.rotulo}
                    </span>
                    <span className="mt-0.5 block text-[0.74rem] text-stone">
                      {p.foco.split(",")[0]}
                    </span>
                  </button>
                ))}
              </div>
              <Nota
                valor={notas.publico ?? ""}
                onChange={(v) => setNotas((n) => ({ ...n, publico: v }))}
                dica="Ex: o público principal vem de moto, destacar a garagem."
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-[1.05rem] font-semibold text-bone">
              Ambientes
            </h2>
            <p className="mt-1 text-[0.84rem] text-stone">
              Uma direção de foto é gerada para cada um.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {COMODOS.map((c) => {
                const on = comodos.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => alterna(comodos, setComodos, c)}
                    aria-pressed={on}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[0.84rem] transition-all duration-300",
                      on
                        ? "border-chrome/60 bg-white/10 text-bone"
                        : "border-white/12 text-stone hover:border-white/25 hover:text-bone",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <Nota
              valor={notas.comodos ?? ""}
              onChange={(v) => setNotas((n) => ({ ...n, comodos: v }))}
              dica="Ex: tem uma varanda com vista que não está na lista."
            />
          </div>
        </section>
      )}

      {/* 3 — Entrega */}
      {passo === 2 && respostas && (
        <section className="space-y-6">
          <Preco respostas={respostas} />

          <div className="flex flex-wrap gap-2">
            {PACOTE.filter((p) => entregaveis.includes(p.id)).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setAba(p.id)}
                aria-pressed={aba === p.id}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[0.86rem] font-medium transition-colors",
                  aba === p.id
                    ? "bg-white/10 text-bone"
                    : "text-stone hover:bg-white/5 hover:text-bone",
                )}
              >
                <p.icone className="size-3.5" strokeWidth={2} />
                {p.rotulo}
              </button>
            ))}
          </div>

          <div key={aba} className="space-y-4">
            {aba === "fotos" &&
              comodos.map((c, i) => (
                <Peca
                  key={c}
                  indice={i}
                  icone={ImageIcon}
                  titulo={c}
                  legenda="Direção de foto"
                  texto={promptFoto(respostas, c)}
                />
              ))}
            {aba === "video" && (
              <Peca
                indice={0}
                icone={Clapperboard}
                titulo="Vídeo do imóvel"
                legenda="Roteiro e direção"
                texto={promptVideo(respostas)}
              />
            )}
            {aba === "site" && (
              <Peca
                indice={0}
                icone={LayoutTemplate}
                titulo="Site do anfitrião"
                legenda="Briefing da página"
                texto={promptSite(respostas)}
              />
            )}
            {aba === "abordagem" && (
              <Peca
                indice={0}
                icone={MessageSquare}
                titulo="Proposta"
                legenda="Mensagem de abertura"
                texto={abordagem(respostas)}
              />
            )}
          </div>
        </section>
      )}

      {/* navegação */}
      <nav className="flex items-center justify-between gap-3 border-t border-white/8 pt-6">
        <button
          type="button"
          onClick={() =>
            passo === 2 ? reiniciar() : setPasso(Math.max(0, passo - 1))
          }
          disabled={passo === 0}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[0.88rem] text-stone transition-colors hover:border-white/25 hover:text-bone disabled:pointer-events-none disabled:opacity-30"
        >
          {passo === 2 ? (
            <>
              <RotateCcw className="size-4" strokeWidth={1.8} />
              Nova entrega
            </>
          ) : (
            <>
              <ArrowLeft className="size-4" strokeWidth={1.8} />
              Voltar
            </>
          )}
        </button>

        {passo === 2 ? (
          <Link
            href="/painel/projetos"
            className="metal-pill inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[0.88rem] font-semibold text-[#08090B] transition-transform hover:-translate-y-0.5"
          >
            Salvar em Projetos
          </Link>
        ) : (
          <button
            type="button"
            disabled={!podeAvancar}
            onClick={() => (passo === 1 ? setGerando(true) : setPasso(1))}
            className="metal-pill inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[0.88rem] font-semibold text-[#08090B] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {passo === 1 ? (
              <>
                <Sparkles className="size-4" strokeWidth={2} />
                Gerar material
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="size-4" strokeWidth={2} />
              </>
            )}
          </button>
        )}
      </nav>
    </div>
  );
}

function Preco({ respostas }: { respostas: Respostas }) {
  const { itens, total } = precificacao(respostas);
  const [oculto, setOculto] = useState(false);
  if (!itens.length) return null;

  return (
    <div className="glass-deep rim-lit rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
          Sugestão de preço
        </p>
        <button
          type="button"
          onClick={() => setOculto((o) => !o)}
          aria-pressed={oculto}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-stone transition-colors hover:border-chrome/40 hover:text-bone"
        >
          {oculto ? (
            <EyeOff className="size-3.5" strokeWidth={1.9} />
          ) : (
            <Eye className="size-3.5" strokeWidth={1.9} />
          )}
          {oculto ? "Mostrar" : "Ocultar"}
        </button>
      </div>

      {/* O valor some do olhar de quem estiver por perto, mas continua na tela. */}
      <div
        aria-hidden={oculto}
        className={cn(
          "mt-3 flex flex-wrap items-end justify-between gap-4 transition-all duration-500",
          oculto && "pointer-events-none select-none blur-md",
        )}
      >
        <div>
          <p className="metal-text font-display text-4xl font-semibold">
            R$ {total.toLocaleString("pt-BR")}
          </p>
          <p className="mt-1.5 text-[0.82rem] text-stone">
            Pacote fechado · valor integral seu
          </p>
        </div>
        <ul className="space-y-1 text-right">
          {itens.map((i) => (
            <li key={i.id} className="text-[0.82rem] text-stone">
              {i.rotulo}{" "}
              <span className="ml-2 font-display text-bone">R$ {i.valor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
