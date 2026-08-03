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
};

export type CorpoBusca = {
  modalidade: Modalidade;
  pais: string;
  /** Vazio nos países sem nível intermediário cadastrado. */
  regiao?: string;
  cidade: string;
};
