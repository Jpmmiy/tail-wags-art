# Paws & Polish

Construa em UMA ÚNICA passada uma landing page de nível AGÊNCIA PREMIUM — visualmente impressionante, extremamente profissional, digna de portfólio internacional (referências: Awwwards, Godly, Land-book, Refokus, Active Theory). Não faça perguntas, não deixe placeholders, não explique nada — apenas entregue o site pronto, polido e finalizado. Use shadcn/tailwind já existentes + framer-motion; NÃO instale libs pesadas novas.

═══════════════════════════════════════════════
🎯 IDENTIDADE DO PROJETO
═══════════════════════════════════════════════
Negócio: Ativa Saúde e Nutrição Animal - Pet Shop
Nicho:  Pet Shop
Slogan: Amor em cada patinha
Objetivo: gerar-pedidos
Tom de voz: amigavel

═══════════════════════════════════════════════
🎨 DIREÇÃO VISUAL (obrigatória — capriche)
═══════════════════════════════════════════════
Estilo: lifestyle
Tipografia: Fredoka + Nunito — headings GRANDES (clamp 48–96px no hero), tracking negativo, hierarquia dramática entre display e body.
Paleta: Primária Laranja Queimado (#EA580C) · Secundária Preto Elegante (#0F172A) — use variáveis semânticas no index.css (HSL), com tokens de gradiente e sombra elegante. NADA de bg-white/text-black hardcoded nos componentes. Contraste WCAG AA garantido.
Composição: layouts assimétricos quando fizer sentido, generoso espaço em branco, grids reais (12 colunas), alinhamento óptico impecável, sem clichê de "gradiente roxo em fundo branco" ou visual genérico de IA.
Profundidade: gradientes sutis, ruído/grain leve opcional, sombras suaves em camadas, bordas 1px hairline em cards, glassmorphism apenas se combinar com o nicho.
Micro-detalhes: badges, pill labels, chips de categoria, ícones lucide-react finos e consistentes, divisores discretos, números grandes em métricas/stats.

═══════════════════════════════════════════════
✨ ANIMAÇÕES (framer-motion — sofisticadas, nunca cafonas)
═══════════════════════════════════════════════
- Hero: fade + slide-up escalonado (stagger 0.08s) no headline, subheadline e CTA.
- Scroll reveals suaves (whileInView, once:true, ease "easeOut", duração 0.6–0.8s).
- Hover states em cards: leve translate-y + sombra crescendo, sem exageros.
- Números animados em stats (count-up).
- Transições entre seções fluidas. NADA de bounces exagerados, glitter ou emojis piscando.

═══════════════════════════════════════════════
🧩 ESTRUTURA DA PÁGINA
═══════════════════════════════════════════════
Seções obrigatórias (nesta ordem, todas ricas em conteúdo real, sem "lorem ipsum"): inicio → servicos → produtos → contato.
Cada seção com título forte, subtítulo esclarecedor e conteúdo específico do nicho — copy de alta conversão em PT-BR, sem clichês, sem repetição, sem palavras traduzidas ou embaralhadas.

═══════════════════════════════════════════════
📱 REGRAS TÉCNICAS
═══════════════════════════════════════════════
- Mobile-first real: teste mental em 375px antes de desktop. Menus mobile com sheet/drawer shadcn.
- Todo CTA principal executa: "Entrar em contato".
- Botão WhatsApp flutuante fixo bottom-right ligado ao telefone ((02) 49884-2476), com pulse discreto.
- Imagens: use placeholders de alta qualidade (unsplash source ou similar) coerentes com o nicho — nunca imagens quebradas.
- SEO: title, meta description, og tags no index.html — coerentes com o negócio.
- Zero banners de "promoção/oferta relâmpago". Zero pop-ups intrusivos. Zero design de "template genérico".

═══════════════════════════════════════════════
📞 DADOS DE CONTATO PARA USAR NO SITE
═══════════════════════════════════════════════
Endereço: Pr. Pres. Castelo Branco, 320 - Lot. Projetado, Areal - RJ, 25845-000
Telefone: (02) 49884-2476
Horário: Não informado
Funcionalidades extras solicitadas: Galeria de Fotos, Agendamento Online

═══════════════════════════════════════════════
🎯 BRIEFING ESPECÍFICO DO NICHO
═══════════════════════════════════════════════
Crie um site de pet shop chamado "Ativa Saúde e Nutrição Animal - Pet Shop" com estética vibrante, acolhedora e playful. Paleta de cores quentes baseada em Laranja Queimado (#EA580C) como cor primária e Preto Elegante (#0F172A) como secundária, com acentos em rosa, azul, verde, amarelo e lavanda sobre fundo creme claro. Tipografia Fredoka (display/headings — arredondada e divertida) + Nunito (body — limpa e legível). Bordas bem arredondadas. Animações com Framer Motion. Estrutura: Navbar fixa com blur, logo com ícone de cachorro, carrinho com badge. Hero full-height com grid 2 colunas (texto + imagem com badges flutuantes). Seção Serviços com 6 cards. Seção Produtos com 4 cards. Seção Depoimentos com 3 cards. CTA com gradiente e patinhas flutuantes. Footer escuro com 4 colunas. Design responsivo. Funcionalidades extras: Galeria de Fotos, Agendamento Online.

═══════════════════════════════════════════════
✅ CRITÉRIO DE ACEITAÇÃO
═══════════════════════════════════════════════
O site final deve parecer feito por um estúdio de design premium cobrando R$ 15k+. Se parecer template gratuito, refaça mentalmente antes de entregar. Entregue TUDO de uma vez, sem perguntas, com polish de produção.

⚡ MODO RÁPIDO ATIVADO: Remova qualquer lógica de autenticação, banco de dados ou sistemas complexos de persistência. Foque 100% na experiência visual, design premium, animações fluidas e navegação rápida entre as telas principais. O site/app deve estar funcional instantaneamente, sem barreiras técnicas.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tail-wags-art.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/63c156bd-a92a-40c4-acf4-cc79a2e9e43d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
