/**
 * Conteúdo de exemplo da Nexofly — usado na landing e como seed do app.
 * Os prompts aqui são o produto real: escritos para gerador de imagem,
 * gerador de vídeo e para o Lovable.
 */

export const IMOVEL_EXEMPLO = {
  nome: "Chalé Vista Serra",
  cidade: "Monte Verde, MG",
  anfitriao: "Marcelo",
  diaria: 280,
  diariaSugerida: 410,
  nota: 4.6,
  avaliacoes: 12,
  fotos: 6,
  temVideo: false,
  temSite: false,
  problemas: [
    "Fotos escuras e tortas",
    "Sem vídeo do imóvel",
    "Sem site próprio",
    "Título genérico",
  ],
};

export const PROMPT_FOTO = `Fotografia imobiliária realista do quarto principal de um chalé
de montanha em Monte Verde (MG), no fim da tarde.

LUZ: sol baixo das 17h entrando pela janela à esquerda, luz quente
e direcional, sombras longas e suaves. Abajur aceso ao lado da cama
para preencher o canto direito. Sem flash, sem luz chapada.

CENA: roupa de cama branca bem esticada, manta de lã cinza dobrada
no pé da cama, duas almofadas de linho. Madeira aparente da parede
com textura visível. Planta viva no canto.

CÂMERA: 24mm, f/4.0, altura 1,40m, linhas verticais corrigidas.

RESTRIÇÕES: não inventar móveis, portas ou janelas que não existem
na foto original. Não alterar o tamanho do cômodo. Manter a planta
e a disposição reais. Resultado deve poder ser conferido pelo hóspede
na chegada.`;

export const PROMPT_VIDEO = `Vídeo de 8 segundos, tour do quarto principal — Chalé Vista Serra.

MOVIMENTO: travelling lento entrando pela porta, câmera na altura do
peito (1,45m), deslocamento contínuo de 1,2m em linha reta. Sem tremor,
sem zoom brusco, sem drone dentro do cômodo.

LUZ: dourada de fim de tarde atravessando a cortina de linho,
partículas de poeira visíveis no feixe.

FOCO: começa na cama, abre lentamente para o conjunto do quarto.
Profundidade de campo rasa no primeiro segundo.

TRILHA: nenhuma. Som ambiente leve (vento, pássaros).

NÃO INCLUIR: pessoas, texto na tela, logotipo, transições chamativas.

ESTILO: tour imobiliário premium, referência Airbnb Luxe.`;

export const PROMPT_SITE = `Crie uma landing page de reservas para o "Chalé Vista Serra",
hospedagem por temporada em Monte Verde (MG).

STACK: React + Tailwind. Uma página, responsiva, mobile-first.

SEÇÕES, NESTA ORDEM:
1. Hero com foto em tela cheia, nome do chalé, cidade, nota e botão
   "Consultar disponibilidade" fixo no topo em mobile.
2. Galeria com 6 fotos em grade, abre em lightbox.
3. "O que tem no chalé": lareira, wi-fi 300MB, cozinha equipada,
   estacionamento, aceita pet, vista para a serra.
4. Calendário de disponibilidade (estático, marcar datas ocupadas).
5. Avaliações reais dos hóspedes, com nome e data.
6. Como chegar: mapa estático + tempo de carro saindo de Campinas
   e de São Paulo.
7. Rodapé com CNPJ, política de cancelamento e WhatsApp.

CONVERSÃO: botão flutuante de WhatsApp em todas as telas, com
mensagem pré-preenchida citando a data que o visitante selecionou.

TOM: acolhedor e direto. Nada de linguagem de corretor.`;

export const ABORDAGEM = `Oi, Marcelo, tudo bem?

Vi o anúncio do Chalé Vista Serra. O lugar é muito bom, só que as
fotos estão derrubando ele. Ficaram escuras e tortas, e é isso que
o hóspede vê antes de decidir.

Refiz três delas pra você comparar, sem compromisso nenhum: [link]

Se curtir, eu faço o pacote inteiro. 12 fotos tratadas, um vídeo de
8 segundos pro Instagram e um site só do chalé, com link direto pro
seu WhatsApp. Aí a reserva cai sem taxa de plataforma no meio.

Te mando os valores?`;

export const ETAPAS = [
  {
    n: "01",
    titulo: "Encontrar",
    resumo: "Os imóveis da sua cidade, com o problema de cada um.",
    detalhe:
      "Você escolhe estado, cidade e bairro. Volta a lista dos anúncios de temporada com nome do anfitrião, contato e o que está travando as reservas dele.",
    artefato: "imovel" as const,
  },
  {
    n: "02",
    titulo: "Fotos",
    resumo: "O prompt pronto pro gerador de imagem.",
    detalhe:
      "Luz, lente, altura de câmera, o que manter e o que é proibido inventar. O imóvel fica bonito sendo o que ele é de verdade.",
    artefato: "prompt" as const,
    conteudo: PROMPT_FOTO,
    etiqueta: "prompt-foto.txt",
  },
  {
    n: "03",
    titulo: "Vídeo",
    resumo: "Roteiro com movimento, luz e duração fechados.",
    detalhe:
      "Anúncio com vídeo joga em outra liga. A plataforma define o movimento de câmera, a hora do dia, o foco e o que não pode entrar no quadro.",
    artefato: "prompt" as const,
    conteudo: PROMPT_VIDEO,
    etiqueta: "prompt-video.txt",
  },
  {
    n: "04",
    titulo: "Site",
    resumo: "Briefing de dev pronto pra colar no Lovable.",
    detalhe:
      "O anfitrião ganha um site só dele, com reserva caindo direto no WhatsApp. Você entrega isso sem escrever uma linha de código.",
    artefato: "prompt" as const,
    conteudo: PROMPT_SITE,
    etiqueta: "briefing-site.md",
  },
  {
    n: "05",
    titulo: "Abordagem",
    resumo: "A mensagem que começa a conversa.",
    detalhe:
      "Escrita no tom de quem está ajudando. Aponta o problema real do anúncio e oferece uma amostra antes de falar em preço.",
    artefato: "mensagem" as const,
    conteudo: ABORDAGEM,
  },
];

export const PLANOS = [
  {
    id: "mensal",
    nome: "Mensal",
    preco: "247,00",
    periodo: "/mês",
    chamada: "Para começar a atender agora.",
    destaque: false,
    inclui: [
      "Busca de imóveis ilimitada",
      "Fotos, vídeo, site e proposta",
      "Painel de clientes e faturamento",
      "Mentor Nexofly a qualquer hora",
      "Atualizações enquanto for assinante",
    ],
    fora: ["Acesso vitalício"],
    acao: "Assinar mensal",
    href: "https://checkout.applyfy.com.br/checkout/cms0w2pbd05j301n26c9xwryz?offer=NIYOXHU",
  },
  {
    id: "vitalicio",
    nome: "Vitalício",
    preco: "497,00",
    periodo: "pagamento único",
    chamada: "Paga uma vez. É seu para sempre.",
    destaque: true,
    inclui: [
      "Tudo do plano mensal",
      "Acesso vitalício, sem mensalidade",
      "Todas as atualizações futuras",
      "Portfólio e gerador de contrato",
      "Suporte prioritário",
    ],
    fora: [],
    acao: "Garantir vitalício",
    href: "https://checkout.applyfy.com.br/checkout/cms0w2pbd05j301n26c9xwryz?offer=NIYOXHU",
  },
];

export const DUVIDAS = [
  {
    p: "Preciso saber design, edição de vídeo ou programação?",
    r: "Não precisa de nenhum dos três. A Nexofly é conectada às ferramentas de geração e cuida da parte técnica sozinha. Você responde o briefing e recebe o material pronto.",
  },
  {
    p: "As imagens não enganam o hóspede?",
    r: "Isso é regra dura aqui dentro. A plataforma não inventa cômodo, móvel ou espaço que não existe. O que muda é luz, arrumação e enquadramento. O hóspede chega e reconhece o lugar.",
  },
  {
    p: "Quanto eu posso cobrar do anfitrião?",
    r: "A plataforma sugere o preço olhando o tipo de imóvel, a diária dele e o que entra no pacote. Costuma ficar entre duas e três diárias. O dinheiro é todo seu, a Nexofly não pega comissão.",
  },
  {
    p: "De onde vêm os imóveis da busca?",
    r: "De anúncios públicos de temporada e de bases de estabelecimentos, filtrados pela região que você escolher. Vem a lista com o diagnóstico de cada anúncio junto.",
  },
  {
    p: "Qual a diferença entre o mensal e o vitalício?",
    r: "Nas funcionalidades, nenhuma. O mensal é R$ 247,00 por mês enquanto você usar. O vitalício é R$ 497,00 uma vez só, nunca renova e já inclui o que for lançado depois.",
  },
  {
    p: "Funciona na minha cidade?",
    r: "Funciona em qualquer cidade que tenha imóvel anunciado pra temporada. Praia, serra e interior costumam ser os melhores: muito anfitrião com anúncio ruim e quase ninguém oferecendo esse serviço.",
  },
];
