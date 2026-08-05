export type Modalidade = "temporada" | "imobiliario";

export type ImovelEncontrado = {
  id: string;
  nome: string;
  endereco: string;
  nota: number | null;
  avaliacoes: number | null;
  telefone: string | null;
  site: string | null;
  mapa: string | null;
  /** Busca do Airbnb já filtrada pela cidade. */
  airbnb: string | null;
  fotos: number;
  primeiraFoto?: string;
  /** Novos campos da API Google Places (New) */
  priceLevel?: string;
  editorialSummary?: string;
  reviews?: Array<{ publishTime: string }>;
  location?: { latitude: number; longitude: number };
  /** Metadados de Score calculados */
  score?: {
    total: number;
    signals: string[];
    angulo: string;
    faixa: 'ALTA' | 'MEDIA' | 'BAIXA';
  };
};

export type CorpoBusca = {
  modalidade: Modalidade;
  pais: string;
  /** Vazio nos países sem nível intermediário cadastrado. */
  regiao?: string;
  cidade: string;
};
