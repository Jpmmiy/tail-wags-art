export const BUSINESS = {
  name: "Ativa Saúde e Nutrição Animal",
  short: "Ativa Pet",
  slogan: "Amor em cada patinha",
  phone: "(02) 49884-2476",
  phoneDigits: "02498842476",
  whatsapp: "5502498842476",
  address: "Pr. Pres. Castelo Branco, 320 - Lot. Projetado, Areal - RJ, 25845-000",
  email: "contato@ativapet.com.br",
};

export const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Produtos", href: "#produtos" },
  { label: "Galeria", href: "#galeria" },
  { label: "Agendar", href: "#agendamento" },
  { label: "Contato", href: "#contato" },
];

export const WHATSAPP_LINK = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
  "Olá! Vim pelo site da Ativa Saúde e Nutrição Animal e gostaria de falar com a equipe.",
)}`;
