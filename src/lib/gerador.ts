/**
 * Monta os textos que a plataforma entrega, a partir das respostas do quiz.
 * Em produção estes templates seriam preenchidos por modelo; aqui a estrutura
 * é a mesma — o que muda é a origem do texto.
 */

export type Imovel = {
  id: string;
  nome: string;
  cidade: string;
  anfitriao: string;
  tipo: string;
  diaria: number;
  potencial: number;
  nota: number;
  avaliacoes: number;
  fotos: number;
  problemas: string[];
};

export const IMOVEIS: Imovel[] = [
  {
    id: "chale-vista-serra",
    nome: "Chalé Vista Serra",
    cidade: "Monte Verde, MG",
    anfitriao: "Marcelo",
    tipo: "Chalé",
    diaria: 280,
    potencial: 410,
    nota: 4.6,
    avaliacoes: 12,
    fotos: 6,
    problemas: ["Fotos escuras", "Sem vídeo", "Sem site", "Título genérico"],
  },
  {
    id: "loft-beira-mar",
    nome: "Loft Beira-Mar 302",
    cidade: "Ubatuba, SP",
    anfitriao: "Renata",
    tipo: "Loft",
    diaria: 340,
    potencial: 520,
    nota: 4.8,
    avaliacoes: 31,
    fotos: 9,
    problemas: ["Fotos tortas", "Sem vídeo", "Sem site"],
  },
  {
    id: "casa-do-lago",
    nome: "Casa do Lago",
    cidade: "Capitólio, MG",
    anfitriao: "Douglas",
    tipo: "Casa",
    diaria: 620,
    potencial: 890,
    nota: 4.9,
    avaliacoes: 47,
    fotos: 14,
    problemas: ["Sem vídeo", "Sem site", "Fotos sem padrão"],
  },
  {
    id: "studio-centro",
    nome: "Studio Centro",
    cidade: "Gramado, RS",
    anfitriao: "Ana",
    tipo: "Studio",
    diaria: 210,
    potencial: 305,
    nota: 4.3,
    avaliacoes: 8,
    fotos: 4,
    problemas: ["Poucas fotos", "Fotos com flash", "Sem site", "Sem vídeo"],
  },
];

export const ESTILOS = [
  {
    id: "aconchegante",
    rotulo: "Aconchegante",
    desc: "Madeira, luz quente, tecidos",
    luz: "sol baixo de fim de tarde entrando pela janela lateral, luz quente e direcional, sombras longas e suaves (golden hour)",
    materiais: "madeira aparente com textura visível, tecidos de lã e linho, cerâmica, paleta em âmbar e bege",
  },
  {
    id: "claro",
    rotulo: "Claro",
    desc: "Amplo, luz difusa, arejado",
    luz: "luz difusa de meio-dia, sombras curtas, ambiente muito iluminado e arejado",
    materiais: "superfícies brancas, madeira clara, tecidos leves, paleta neutra e alta exposição",
  },
  {
    id: "limpo",
    rotulo: "Limpo",
    desc: "Minimalista, funcional, neutro",
    luz: "luz neutra e uniforme, sem sombras marcadas, foco na funcionalidade e clareza",
    materiais: "metal, vidro, superfícies lisas, paleta de cinzas e brancos",
  },
  {
    id: "vibrante",
    rotulo: "Vibrante",
    desc: "Social, dinâmico, colorido",
    luz: "blue hour com pontos de luz artificiais quentes, contraste entre interior e exterior",
    materiais: "cores saturadas, texturas variadas, foco em áreas sociais e lazer",
  },
  {
    id: "sóbrio",
    rotulo: "Sóbrio",
    desc: "Elegante, alto contraste, luxo",
    luz: "golden hour lateral com alto contraste, luz dramática que destaca volumes e texturas",
    materiais: "pedras escuras, couro, metal nobre, paleta profunda e elegante",
  },
];

/** Arrumação específica de cada ambiente — o que muda de fato na foto. */
const CENA_POR_COMODO: Record<string, string> = {
  "Quarto principal":
    "cama arrumada com a roupa de cama esticada e sem vincos, travesseiros alinhados, manta dobrada no pé, criado-mudo sem objetos pessoais, cortina aberta",
  "Sala":
    "sofá com as almofadas alinhadas, manta dobrada sobre o braço, mesa de centro com no máximo dois objetos, tapete centralizado e esticado, nada de fio aparente",
  "Cozinha":
    "bancada completamente livre, louça guardada, uma tábua ou fruteira como único objeto, panos dobrados, geladeira sem ímãs, pia seca",
  "Banheiro":
    "toalhas brancas dobradas, bancada livre, box sem produtos à mostra, espelho sem marcas, tampa do vaso fechada",
  "Lazer":
    "mobiliário alinhado, almofadas limpas e secas, churrasqueira ou fogueira limpa, vegetação aparada, chão sem mangueira nem objeto solto",
  "Varanda/Vista": "enquadramento a partir da janela ou varanda mostrando exatamente o que se vê do imóvel, sem obstrução, linha do horizonte reta",
  "Fachada": "arquitetura externa limpa, sem carros na frente, luz de contorno destacando o volume do prédio ou casa",
};


export const PUBLICOS = [
  { id: "casais", rotulo: "Casais", foco: "intimidade, banheira, vista e jantar a dois" },
  { id: "familias", rotulo: "Famílias", foco: "espaço, segurança para crianças, cozinha completa" },
  { id: "amigos", rotulo: "Grupos de amigos", foco: "área externa, churrasqueira, número de camas" },
  { id: "trabalho", rotulo: "Viagem a trabalho", foco: "internet rápida, mesa de trabalho, silêncio, check-in autônomo" },
  { id: "alto-padrao", rotulo: "Alto padrão", foco: "exclusividade, acabamentos, tecnologia e privacidade" },
  { id: "investidor", rotulo: "Investidor", foco: "rentabilidade, manutenção, localização e automação" },
];

export const COMODOS = [
  "Quarto principal",
  "Sala de estar",
  "Cozinha",
  "Banheiro",
  "Área externa",
  "Vista",
];

export const ENTREGAVEIS = [
  { id: "fotos", rotulo: "Fotos tratadas", desc: "Uma por ambiente" },
  { id: "video", rotulo: "Vídeo do imóvel", desc: "Tour de 8 segundos" },
  { id: "site", rotulo: "Site do anfitrião", desc: "Publicado e no ar" },
  { id: "abordagem", rotulo: "Proposta", desc: "Pronta para enviar" },
];

/** Imóvel escolhido na busca, já normalizado para o gerador. */
export type ImovelSelecionado = {
  id: string;
  nome: string;
  cidade: string;
  tipo: string;
  anfitriao: string;
  diaria: number;
  potencial: number;
  nota: number;
  avaliacoes: number;
  fotos: number;
  problemas: string[];
  mapa?: string | null;
  airbnb?: string | null;
  site?: string | null;
};

export type Respostas = {
  modalidade: "temporada" | "imobiliario";
  imovel: ImovelSelecionado;
  estilo: string;
  publico: string;
  comodos: string[];
  entregaveis: string[];
  /** Texto livre por seção do briefing. Vazio quando não preenchido. */
  notas: {
    estilo?: string;
    publico?: string;
    comodos?: string;
    pacote?: string;
  };
};

/** Bloco só aparece no material quando o usuário escreveu algo. */
function obs(texto?: string) {
  const t = texto?.trim();
  return t ? `\n\nOBSERVAÇÕES DO BRIEFING\n${t}` : "";
}

const acheEstilo = (id: string) => ESTILOS.find((e) => e.id === id) ?? ESTILOS[0];
const achePublico = (id: string) => PUBLICOS.find((p) => p.id === id) ?? PUBLICOS[0];

export function promptFoto(r: Respostas, comodo: string) {
  const e = acheEstilo(r.estilo);
  const p = achePublico(r.publico);

  return `Fotografia imobiliária realista — ${comodo.toUpperCase()}
${r.imovel.nome}, ${r.imovel.cidade} · ${r.imovel.tipo}

LUZ
${e.luz}. Sem flash direto, sem luz chapada de teto.

CENA
${CENA_POR_COMODO[comodo] ?? "ambiente arrumado, superfícies livres, nada fora do lugar"}.

MATERIAIS E PALETA
${e.materiais}.

O QUE PRECISA FICAR EVIDENTE
Público do imóvel: ${p.rotulo.toLowerCase()}. Destacar ${p.foco}.

CÂMERA
Lente 24mm, f/4.0, ISO base. Altura de 1,40m. Linhas verticais
corrigidas. Um ponto de fuga. Enquadramento na horizontal.

TRATAMENTO
Contraste suave, sem HDR agressivo. Brancos neutros. Verdes da
vegetação fiéis. Sem vinheta artificial.

RESTRIÇÕES (obrigatórias)
- Não inventar móveis, portas, janelas ou cômodos que não existam
  na foto original.
- Não alterar o tamanho nem a proporção do ambiente.
- Não adicionar vista que não é vista real do imóvel.
- O hóspede precisa reconhecer o lugar na chegada.${obs(r.notas.estilo)}`;
}

export function promptVideo(r: Respostas) {
  const e = acheEstilo(r.estilo);
  const p = achePublico(r.publico);

  return `### PLANO DE PRODUÇÃO VÍDEO AIRBNB — ${r.imovel.nome.toUpperCase()}

OBJETIVO COMERCIAL
Transformar visualizadores em hóspedes destacando ${p.foco}.

ESTRUTURA DE 6 CAMADAS (GOOGLE FLOW)

1. CENA (MOVIMENTO)
Travelling lento entrando pelo ambiente principal. Câmera na altura do peito (1,45m), deslocamento contínuo de 1.2 metros em linha reta. Estabilização total, sem tremores.

2. ILUMINAÇÃO (STYLING)
${e.luz}. Partículas de poeira visíveis nos feixes de luz se possível. Sombras suaves.

3. TEXTURAS E MATERIAIS
Foco em: ${e.materiais}.

4. PONTO DE INTERESSE (HOOK)
Primeiro segundo com profundidade de campo rasa focando em um detalhe que represente ${p.rotulo.toLowerCase()}. Depois, abertura suave para o ambiente completo.

5. AMBIENTAÇÃO SONORA
Som ambiente natural (diegetico). Silêncio de fundo com sons sutis de natureza local. Sem música.

6. REGRAS DE OURO (NEGATIVE PROMPT)
- Zero pessoas ou animais.
- Zero texto, logotipos ou marcas d'água.
- Zero transições digitais ou efeitos de flash.
- Zero cortes bruscos.

ESPECIFICAÇÕES TÉCNICAS
- Duração: 8 a 10 segundos.
- Formato: 9:16 (Vertical) para Reels/Stories.
- Estilo Visual: Cinematic Real Estate.${obs(r.notas?.pacote)}`;
}

export function promptSite(r: Respostas) {
  const p = achePublico(r.publico);

  return `Crie uma landing page de reservas para "${r.imovel.nome}",
${r.imovel.tipo.toLowerCase()} por temporada em ${r.imovel.cidade}.

STACK
React + Tailwind. Página única, responsiva, mobile-first.
Carregamento rápido: imagens otimizadas e sem biblioteca pesada.

PÚBLICO
${p.rotulo}. A página inteira deve responder a: ${p.foco}.

SEÇÕES, NESTA ORDEM
1. Hero com foto em tela cheia, nome do imóvel, cidade e botão
   "Consultar disponibilidade".
2. Galeria com as fotos em grade, abrindo em lightbox.
3. "O que tem aqui": lista de comodidades com ícone e rótulo curto.
4. Calendário de disponibilidade com as datas ocupadas marcadas.
5. Avaliações reais dos hóspedes, com nome e data.
6. Como chegar: mapa e tempo de carro das capitais mais próximas.
7. Rodapé com política de cancelamento, regras da casa e contato.

CONVERSÃO
Botão de WhatsApp fixo em todas as telas. Ao clicar, abrir conversa
com mensagem pré-preenchida citando a data selecionada no calendário.

TOM
Acolhedor e direto. Frases curtas. Nada de linguagem de corretor,
nada de "aconchegante refúgio". Descrever o que existe.${obs(r.notas.publico)}`;
}

export function abordagem(r: Respostas) {
  const ganho = Math.max(0, (r.imovel.potencial || 0) - (r.imovel.diaria || 0));
  const nomeImovel = r.imovel.nome || "seu imóvel";
  const dadoReal = r.imovel.nota 
    ? `${r.imovel.nota} estrelas` 
    : r.imovel.avaliacoes 
      ? `${r.imovel.avaliacoes} avaliações`
      : "o potencial de mercado";

  return `*1. Abertura (Conexão)*
Oi, ${r.imovel.anfitriao || "tudo bem"}? Vi o anúncio do ${nomeImovel} — ${dadoReal} mostra que é um produto com excelente potencial.

*2. Diagnóstico (O Problema)*
Reparei que o material visual ainda não acompanha esse nível. Fotos amadoras e a falta de um vídeo profissional acabam "escondendo" o valor real do imóvel e segurando o clique de muitos interessados.

*3. Proposta de Valor (A Solução)*
Montei uma estratégia de renovação visual e um roteiro de vídeo cinematográfico pensado especificamente para valorizar o ${nomeImovel}. O objetivo é aumentar o desejo imediato e justificar um ticket maior.

*4. Prova de Conceito (Comparativo)*
Imóveis com esse padrão visual na região chegam a performar com diárias de R$ ${r.imovel.potencial}. Hoje você está em R$ ${r.imovel.diaria}. Estamos falando de uma diferença de R$ ${ganho} por noite ocupada.

*5. Fechamento (Chamada para Ação)*
Preparei um modelo de como ficaria essa nova apresentação, sem compromisso nenhum. Posso te mandar os detalhes aqui?`;
}

export function precificacao(r: Respostas) {
  const base: Record<string, number> = {
    fotos: 480,
    video: 390,
    site: 690,
    abordagem: 0,
  };
  const itens = r.entregaveis
    .filter((id) => base[id] > 0)
    .map((id) => ({
      id,
      rotulo: ENTREGAVEIS.find((e) => e.id === id)!.rotulo,
      valor: base[id],
    }));
  const total = itens.reduce((s, i) => s + i.valor, 0);
  return { itens, total };
}
