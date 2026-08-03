/**
 * Locais para o seletor do quiz.
 *
 * Países com mercado grande (Brasil, Portugal) têm o nível de estado.
 * Nos demais, o salto vai direto do país para as cidades — manter uma
 * malha administrativa completa do mundo aqui não se paga.
 */

export type Regiao = { id: string; nome: string; cidades: string[] };

export type Pais = {
  id: string;
  nome: string;
  bandeira: string;
  /** Quando existe, o seletor mostra o nível intermediário. */
  regioes?: Regiao[];
  /** Usado quando o país não tem regiões cadastradas. */
  cidades?: string[];
};

const BR: Regiao[] = [
  { id: "AC", nome: "Acre", cidades: ["Rio Branco", "Cruzeiro do Sul", "Xapuri"] },
  { id: "AL", nome: "Alagoas", cidades: ["Maceió", "Maragogi", "São Miguel dos Milagres", "Japaratinga", "Paripueira"] },
  { id: "AP", nome: "Amapá", cidades: ["Macapá", "Oiapoque"] },
  { id: "AM", nome: "Amazonas", cidades: ["Manaus", "Presidente Figueiredo", "Parintins"] },
  { id: "BA", nome: "Bahia", cidades: ["Salvador", "Porto Seguro", "Arraial d'Ajuda", "Trancoso", "Itacaré", "Morro de São Paulo", "Praia do Forte", "Lençóis", "Ilhéus", "Barra Grande"] },
  { id: "CE", nome: "Ceará", cidades: ["Fortaleza", "Jericoacoara", "Canoa Quebrada", "Cumbuco", "Icaraí de Amontada", "Guaramiranga"] },
  { id: "DF", nome: "Distrito Federal", cidades: ["Brasília", "Águas Claras", "Lago Sul"] },
  { id: "ES", nome: "Espírito Santo", cidades: ["Vitória", "Guarapari", "Domingos Martins", "Pedra Azul", "Itaúnas"] },
  { id: "GO", nome: "Goiás", cidades: ["Goiânia", "Pirenópolis", "Caldas Novas", "Alto Paraíso de Goiás"] },
  { id: "MA", nome: "Maranhão", cidades: ["São Luís", "Barreirinhas", "Atins", "Alcântara"] },
  { id: "MT", nome: "Mato Grosso", cidades: ["Cuiabá", "Chapada dos Guimarães", "Nobres", "Poconé"] },
  { id: "MS", nome: "Mato Grosso do Sul", cidades: ["Campo Grande", "Bonito", "Corumbá"] },
  { id: "MG", nome: "Minas Gerais", cidades: ["Belo Horizonte", "Monte Verde", "Tiradentes", "Ouro Preto", "Capitólio", "Serra do Cipó", "São Thomé das Letras", "Diamantina", "Poços de Caldas", "Brumadinho"] },
  { id: "PA", nome: "Pará", cidades: ["Belém", "Alter do Chão", "Santarém"] },
  { id: "PB", nome: "Paraíba", cidades: ["João Pessoa", "Cabedelo", "Areia", "Conde"] },
  { id: "PR", nome: "Paraná", cidades: ["Curitiba", "Foz do Iguaçu", "Morretes", "Ilha do Mel", "Matinhos"] },
  { id: "PE", nome: "Pernambuco", cidades: ["Recife", "Porto de Galinhas", "Fernando de Noronha", "Olinda", "Gravatá", "Bezerros"] },
  { id: "PI", nome: "Piauí", cidades: ["Teresina", "Parnaíba", "Barra Grande"] },
  { id: "RJ", nome: "Rio de Janeiro", cidades: ["Rio de Janeiro", "Búzios", "Arraial do Cabo", "Paraty", "Angra dos Reis", "Petrópolis", "Teresópolis", "Cabo Frio", "Ilha Grande", "Visconde de Mauá"] },
  { id: "RN", nome: "Rio Grande do Norte", cidades: ["Natal", "Pipa", "São Miguel do Gostoso", "Maracajaú"] },
  { id: "RS", nome: "Rio Grande do Sul", cidades: ["Porto Alegre", "Gramado", "Canela", "Bento Gonçalves", "Cambará do Sul", "Torres"] },
  { id: "RO", nome: "Rondônia", cidades: ["Porto Velho", "Ji-Paraná"] },
  { id: "RR", nome: "Roraima", cidades: ["Boa Vista"] },
  { id: "SC", nome: "Santa Catarina", cidades: ["Florianópolis", "Balneário Camboriú", "Bombinhas", "Praia do Rosa", "Urubici", "Garopaba", "São Joaquim", "Itapema", "Blumenau"] },
  { id: "SP", nome: "São Paulo", cidades: ["São Paulo", "Campos do Jordão", "Ubatuba", "Ilhabela", "São Sebastião", "Santos", "Guarujá", "Holambra", "São Roque", "Brotas"] },
  { id: "SE", nome: "Sergipe", cidades: ["Aracaju", "Canindé de São Francisco"] },
  { id: "TO", nome: "Tocantins", cidades: ["Palmas", "Jalapão", "Taquaruçu"] },
];

const PT: Regiao[] = [
  { id: "LIS", nome: "Lisboa", cidades: ["Lisboa", "Cascais", "Sintra", "Ericeira"] },
  { id: "POR", nome: "Porto", cidades: ["Porto", "Vila Nova de Gaia", "Matosinhos"] },
  { id: "FAR", nome: "Algarve", cidades: ["Faro", "Albufeira", "Lagos", "Tavira", "Portimão"] },
  { id: "MAD", nome: "Madeira", cidades: ["Funchal", "Câmara de Lobos"] },
  { id: "AZO", nome: "Açores", cidades: ["Ponta Delgada", "Angra do Heroísmo"] },
  { id: "COI", nome: "Centro", cidades: ["Coimbra", "Figueira da Foz", "Aveiro"] },
];

export const PAISES: Pais[] = [
  { id: "BR", nome: "Brasil", bandeira: "🇧🇷", regioes: BR },
  { id: "PT", nome: "Portugal", bandeira: "🇵🇹", regioes: PT },

  { id: "AR", nome: "Argentina", bandeira: "🇦🇷", cidades: ["Buenos Aires", "Bariloche", "Mendoza", "Córdoba", "El Calafate", "Salta", "Ushuaia", "Mar del Plata"] },
  { id: "UY", nome: "Uruguai", bandeira: "🇺🇾", cidades: ["Montevidéu", "Punta del Este", "Colonia del Sacramento", "José Ignacio"] },
  { id: "CL", nome: "Chile", bandeira: "🇨🇱", cidades: ["Santiago", "Valparaíso", "Puerto Varas", "San Pedro de Atacama", "Pucón", "Viña del Mar"] },
  { id: "PY", nome: "Paraguai", bandeira: "🇵🇾", cidades: ["Assunção", "Ciudad del Este", "Encarnación"] },
  { id: "BO", nome: "Bolívia", bandeira: "🇧🇴", cidades: ["La Paz", "Santa Cruz de la Sierra", "Sucre", "Uyuni"] },
  { id: "PE", nome: "Peru", bandeira: "🇵🇪", cidades: ["Lima", "Cusco", "Arequipa", "Máncora", "Puno"] },
  { id: "CO", nome: "Colômbia", bandeira: "🇨🇴", cidades: ["Bogotá", "Medellín", "Cartagena", "Santa Marta", "Cali", "Guatapé"] },
  { id: "EC", nome: "Equador", bandeira: "🇪🇨", cidades: ["Quito", "Guayaquil", "Cuenca", "Baños"] },
  { id: "MX", nome: "México", bandeira: "🇲🇽", cidades: ["Cidade do México", "Cancún", "Tulum", "Playa del Carmen", "Guadalajara", "Oaxaca", "Puerto Vallarta", "San Miguel de Allende", "Mérida"] },
  { id: "US", nome: "Estados Unidos", bandeira: "🇺🇸", cidades: ["Nova York", "Los Angeles", "Miami", "Orlando", "Chicago", "San Francisco", "Las Vegas", "Austin", "Nashville", "Denver", "Seattle", "Boston", "Nova Orleans", "San Diego"] },
  { id: "CA", nome: "Canadá", bandeira: "🇨🇦", cidades: ["Toronto", "Vancouver", "Montreal", "Quebec", "Banff", "Calgary", "Ottawa"] },
  { id: "CR", nome: "Costa Rica", bandeira: "🇨🇷", cidades: ["San José", "Tamarindo", "La Fortuna", "Manuel Antonio", "Santa Teresa"] },
  { id: "PA", nome: "Panamá", bandeira: "🇵🇦", cidades: ["Cidade do Panamá", "Bocas del Toro", "Boquete"] },
  { id: "DO", nome: "República Dominicana", bandeira: "🇩🇴", cidades: ["Punta Cana", "Santo Domingo", "Puerto Plata", "Las Terrenas"] },

  { id: "ES", nome: "Espanha", bandeira: "🇪🇸", cidades: ["Madri", "Barcelona", "Sevilha", "Valência", "Málaga", "Granada", "Ibiza", "Palma de Maiorca", "Bilbao", "San Sebastián"] },
  { id: "FR", nome: "França", bandeira: "🇫🇷", cidades: ["Paris", "Nice", "Lyon", "Marselha", "Bordeaux", "Cannes", "Chamonix", "Estrasburgo"] },
  { id: "IT", nome: "Itália", bandeira: "🇮🇹", cidades: ["Roma", "Milão", "Florença", "Veneza", "Nápoles", "Costa Amalfitana", "Bolonha", "Turim", "Palermo"] },
  { id: "GB", nome: "Reino Unido", bandeira: "🇬🇧", cidades: ["Londres", "Edimburgo", "Manchester", "Liverpool", "Bath", "Brighton", "Glasgow"] },
  { id: "DE", nome: "Alemanha", bandeira: "🇩🇪", cidades: ["Berlim", "Munique", "Hamburgo", "Colônia", "Frankfurt", "Dresden"] },
  { id: "NL", nome: "Países Baixos", bandeira: "🇳🇱", cidades: ["Amsterdã", "Roterdã", "Utrecht", "Haia"] },
  { id: "CH", nome: "Suíça", bandeira: "🇨🇭", cidades: ["Zurique", "Genebra", "Interlaken", "Zermatt", "Lucerna"] },
  { id: "AT", nome: "Áustria", bandeira: "🇦🇹", cidades: ["Viena", "Salzburgo", "Innsbruck", "Hallstatt"] },
  { id: "GR", nome: "Grécia", bandeira: "🇬🇷", cidades: ["Atenas", "Santorini", "Mykonos", "Creta", "Rodes", "Corfu"] },
  { id: "HR", nome: "Croácia", bandeira: "🇭🇷", cidades: ["Dubrovnik", "Split", "Zagreb", "Hvar", "Zadar"] },
  { id: "IE", nome: "Irlanda", bandeira: "🇮🇪", cidades: ["Dublin", "Galway", "Cork", "Killarney"] },
  { id: "BE", nome: "Bélgica", bandeira: "🇧🇪", cidades: ["Bruxelas", "Bruges", "Antuérpia", "Gante"] },
  { id: "PL", nome: "Polônia", bandeira: "🇵🇱", cidades: ["Varsóvia", "Cracóvia", "Gdansk", "Wroclaw"] },
  { id: "CZ", nome: "Tchéquia", bandeira: "🇨🇿", cidades: ["Praga", "Brno", "Cesky Krumlov"] },
  { id: "NO", nome: "Noruega", bandeira: "🇳🇴", cidades: ["Oslo", "Bergen", "Tromsø", "Lofoten"] },
  { id: "SE", nome: "Suécia", bandeira: "🇸🇪", cidades: ["Estocolmo", "Gotemburgo", "Malmö"] },
  { id: "DK", nome: "Dinamarca", bandeira: "🇩🇰", cidades: ["Copenhague", "Aarhus"] },
  { id: "IS", nome: "Islândia", bandeira: "🇮🇸", cidades: ["Reykjavík", "Vík", "Akureyri"] },
  { id: "TR", nome: "Turquia", bandeira: "🇹🇷", cidades: ["Istambul", "Capadócia", "Antália", "Izmir", "Bodrum"] },

  { id: "AE", nome: "Emirados Árabes", bandeira: "🇦🇪", cidades: ["Dubai", "Abu Dhabi", "Sharjah"] },
  { id: "MA", nome: "Marrocos", bandeira: "🇲🇦", cidades: ["Marrakech", "Casablanca", "Fez", "Chefchaouen", "Essaouira"] },
  { id: "ZA", nome: "África do Sul", bandeira: "🇿🇦", cidades: ["Cidade do Cabo", "Joanesburgo", "Durban", "Stellenbosch"] },
  { id: "EG", nome: "Egito", bandeira: "🇪🇬", cidades: ["Cairo", "Luxor", "Hurghada", "Sharm el-Sheikh"] },

  { id: "JP", nome: "Japão", bandeira: "🇯🇵", cidades: ["Tóquio", "Quioto", "Osaka", "Hokkaido", "Hiroshima", "Nagoya"] },
  { id: "TH", nome: "Tailândia", bandeira: "🇹🇭", cidades: ["Bangkok", "Phuket", "Chiang Mai", "Koh Samui", "Krabi"] },
  { id: "ID", nome: "Indonésia", bandeira: "🇮🇩", cidades: ["Bali", "Jacarta", "Yogyakarta", "Lombok"] },
  { id: "VN", nome: "Vietnã", bandeira: "🇻🇳", cidades: ["Hanói", "Ho Chi Minh", "Da Nang", "Hoi An"] },
  { id: "PH", nome: "Filipinas", bandeira: "🇵🇭", cidades: ["Manila", "Cebu", "Palawan", "Boracay"] },
  { id: "KR", nome: "Coreia do Sul", bandeira: "🇰🇷", cidades: ["Seul", "Busan", "Jeju"] },
  { id: "IN", nome: "Índia", bandeira: "🇮🇳", cidades: ["Nova Délhi", "Mumbai", "Goa", "Jaipur", "Bengaluru"] },
  { id: "SG", nome: "Singapura", bandeira: "🇸🇬", cidades: ["Singapura"] },

  { id: "AU", nome: "Austrália", bandeira: "🇦🇺", cidades: ["Sydney", "Melbourne", "Brisbane", "Gold Coast", "Perth", "Cairns"] },
  { id: "NZ", nome: "Nova Zelândia", bandeira: "🇳🇿", cidades: ["Auckland", "Queenstown", "Wellington", "Christchurch"] },
];

export function achaPais(id: string) {
  return PAISES.find((p) => p.id === id);
}

export function regioesDe(paisId: string): Regiao[] {
  return achaPais(paisId)?.regioes ?? [];
}

/** Cidades do país; se houver regiões, as da região informada. */
export function cidadesDe(paisId: string, regiaoId?: string): string[] {
  const pais = achaPais(paisId);
  if (!pais) return [];
  if (!pais.regioes) return pais.cidades ?? [];
  return pais.regioes.find((r) => r.id === regiaoId)?.cidades ?? [];
}

export function nomeRegiao(paisId: string, regiaoId: string) {
  return regioesDe(paisId).find((r) => r.id === regiaoId)?.nome ?? "";
}

export function nomePais(paisId: string) {
  return achaPais(paisId)?.nome ?? paisId;
}
