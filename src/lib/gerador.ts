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
  objetivo: string | null;
  objetivoVideoTipo: "institucional" | "dinamico" | "cinematografico";
  possuiDrone: boolean;
  videoVertical: boolean;
  cidade: string;
  paisId: string;
  regiaoId: string;
  /** Texto livre por seção do briefing. Vazio quando não preenchido. */
  notas: {
    estilo?: string;
    publico?: string;
    comodos?: string;
    pacote?: string;
    objetivoVideoTipo?: string;
    possuiDrone?: string;
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
  
  // ESTRATÉGIA BASEADA EM SINAIS DO RADAR
  const sinais = r.imovel.score?.signals || [];
  const focoRadar = sinais.some(s => s.toLowerCase().includes("foto")) 
    ? "PRIORIDADE: Volume e variedade. O imóvel possui poucas fotos ou fotos ruins no radar. Capture ângulos inéditos."
    : "FOCO: Qualidade e refinamento. O imóvel já tem base, foque em elevar o padrão visual.";

  return `### PROMPT DE FOTOGRAFIA IMOBILIÁRIA (AI GENERATION)
  
[CONTEXTO DO IMÓVEL]
Tipo: ${r.imovel.tipo}
Nome: ${r.imovel.nome}
Local: ${r.imovel.cidade}, ${r.paisId}
Sinais do Radar: ${sinais.join(", ")}
${focoRadar}

[AMBIENTE ATUAL]
Cômodo: ${comodo.toUpperCase()}
Ação de Arrumação: ${CENA_POR_COMODO[comodo] ?? "Ambiente limpo, superfícies livres, enquadramento amplo."}

[DIRETRIZES DE ESTILO]
Conceito: ${e.rotulo}
Iluminação: ${e.luz}
Materiais/Paleta: ${e.materiais}

[DIRECIONAMENTO POR PÚBLICO]
Público-alvo: ${p.rotulo}
Valor Percebido: Destacar ${p.foco}

[CONFIGURAÇÃO TÉCNICA]
Câmera: 24mm wide-angle, f/8.0 para profundidade total, ISO 100.
Enquadramento: Linhas verticais 100% corrigidas. Altura da lente: 1.20m.
Saída: Alta fidelidade, sem artefatos, realista.

[RESTRIÇÕES]
- Não adicionar móveis ou cômodos inexistentes.
- Manter a volumetria original do espaço.
- Fidelidade total às janelas e aberturas de luz.${obs(r.notas.estilo)}`;
}

export function promptVideo(r: Respostas) {
  const e = acheEstilo(r.estilo);
  const p = achePublico(r.publico);
  
  // LÓGICA DE DRONE E MOVIMENTO
  const movDestaque = r.possuiDrone 
    ? "DRONE SHOT: Revelação aérea começando do entorno (cidade/natureza) e aproximando da janela do imóvel em movimento circular (orbit)."
    : "DOLLY SHOT: Movimento interno suave de aproximação (push-in) focando nos detalhes de acabamento.";

  const direcaoTecnica = r.objetivoVideoTipo === 'cinematografico' 
    ? "Slow motion (60fps), profundidade de campo rasa, foco seletivo (rack focus)."
    : r.objetivoVideoTipo === 'dinamico'
    ? "Movimentos rápidos, cortes rítmicos, transições de luz naturais."
    : "Movimentos estáveis, pan horizontal lento, clareza total informativa.";

  return `### PLANO DE PRODUÇÃO VÍDEO — ${r.imovel.nome.toUpperCase()}

[ESTRATÉGIA COMERCIAL]
Objetivo: ${r.objetivo === 'video' ? 'Venda de pacotes de vídeo' : 'Conversão direta de hóspedes/compradores'}
Público: ${p.rotulo} (${p.foco})
Ângulo de Venda: ${r.imovel.score?.angulo || "Valorização visual"}

[DIREÇÃO DE FOTOGRAFIA]
Estilo Visual: ${e.rotulo} (${e.luz})
Formato de Saída: ${r.videoVertical ? "9:16 Vertical (Mobile/Reels)" : "16:9 Horizontal (Desktop/YouTube)"}
Direção Técnica: ${direcaoTecnica}

[CAMADAS DE MOVIMENTO (SHOT LIST)]
1. ABERTURA: ${movDestaque}
2. AMBIENTE: Travelling lateral mostrando a fluidez entre ${r.comodos.slice(0, 2).join(" e ")}.
3. DETALHE: Macro shot revelando ${e.materiais}.
4. FECHAMENTO: Frame estático com espaço para CTA no lado ${r.videoVertical ? "inferior" : "direito"}.

[ILUMINAÇÃO E TEXTURA]
Configuração: ${e.luz}
Materiais em Destaque: ${e.materiais}

[AMBIENTAÇÃO E ÁUDIO]
Atmosfera: ${e.desc}
Som: Natural do ambiente, foco em silêncio e brisa local.

[RESTRIÇÕES TÉCNICAS]
- Sem pessoas ou animais.
- Geometria de linhas retas preservada.
- Sem distorção de lente olho de peixe.${obs(r.notas?.pacote)}`;
}

export function promptSite(r: Respostas) {
  const p = achePublico(r.publico);
  
  // APROVEITAMENTO DE DADOS DO IMÓVEL (VALORES)
  const precoSugerido = r.modalidade === 'temporada' ? `R$ ${r.imovel.potencial}/noite` : `R$ ${r.imovel.potencial.toLocaleString('pt-BR')}`;
  const precoAtual = r.modalidade === 'temporada' ? `R$ ${r.imovel.diaria}/noite` : `R$ ${r.imovel.diaria.toLocaleString('pt-BR')}`;

  return `### BRIEFING DE LANDING PAGE DE ALTA CONVERSÃO

[DADOS DO PRODUTO]
Nome: ${r.imovel.nome}
Tipo: ${r.imovel.tipo}
Localização: ${r.imovel.cidade}
Preço de Mercado (Meta): ${precoSugerido}
Preço Atual: ${precoAtual}

[PÚBLICO E LINGUAGEM]
Persona: ${p.rotulo}
Promessa Principal: Como o imóvel atende a ${p.foco}
Tom de Voz: ${r.estilo === 'aconchegante' ? 'Acolhedor e emocional' : 'Profissional e direto'}

[ARQUITETURA DA PÁGINA (COMPONENTES)]
1. HERO: Destaque para ${r.imovel.nome} com headline focada em ${p.foco}.
2. GALERIA: Grid dinâmico priorizando ${r.comodos.join(", ")}.
3. PROVA SOCIAL: Destaque para ${r.imovel.avaliacoes} avaliações e nota ${r.imovel.nota}.
4. CONVERSÃO: Widget de reserva direta via WhatsApp.

[DIRETRIZES VISUAIS]
Paleta sugerida: Baseada em ${acheEstilo(r.estilo).materiais}
Stack: React + Tailwind + Lucide Icons

[DADOS ESTRUTURADOS]
- Cidade: ${r.imovel.cidade}
- Região: ${r.regiaoId}
- Link Mapa: ${r.imovel.mapa || "Indisponível"}
- Link OTA: ${r.imovel.airbnb || "Indisponível"}

[NOTAS E ESPECIFICAÇÕES]
${obs(r.notas.publico)}`;
}


export function abordagem(r: Respostas) {
  const ganho = Math.max(0, r.imovel.potencial - r.imovel.diaria);

  return `Oi, ${r.imovel.anfitriao}, tudo bem?

Vi o anúncio do ${r.imovel.nome}. O lugar é muito bom, só que o
anúncio não está mostrando isso. As fotos são a primeira coisa que
o hóspede vê antes de decidir.

Refiz três fotos pra você comparar, sem compromisso nenhum: [link]

Se curtir, eu faço o pacote inteiro. Fotos tratadas de todos os
cômodos, um vídeo curto pro Instagram e um site só do ${r.imovel.tipo.toLowerCase()},
com reserva caindo direto no seu WhatsApp. Sem taxa de plataforma
no meio.

Imóvel parecido na sua região, com o anúncio ajustado, está saindo
a R$ ${r.imovel.potencial} a diária. Você está em R$ ${r.imovel.diaria}.
Dá R$ ${ganho} a mais por noite ocupada.

Te mando os valores?`;
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
