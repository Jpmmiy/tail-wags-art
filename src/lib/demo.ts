"use client";

import { useSyncExternalStore } from "react";

/**
 * Modo demonstração do painel.
 *
 * Liga números editáveis no dashboard para apresentar a plataforma sem
 * precisar de uma conta com histórico. O controle e o editor moram na
 * aba Segurança das Configurações.
 *
 * O estado vive no localStorage e fora do React, então usamos
 * useSyncExternalStore. O instantâneo precisa ser o MESMO objeto entre
 * leituras — montar um objeto novo a cada getSnapshot faz o React
 * re-renderizar em laço.
 */

export type Atividade = { quando: string; texto: string; valor: number | null };

export type Pecas = {
  fotos: number;
  video: number;
  site: number;
  abordagem: number;
};

export type Painel = {
  faturado: number;
  aguardando: number;
  propostasAbertas: number;
  entregas: number;
  ticket: number;
  /** Doze posições, de janeiro a dezembro. Entradas confirmadas. */
  fluxo: number[];
  /** Mesma escala do fluxo: o que foi proposto e ainda não entrou. */
  aberto: number[];
  pecas: Pecas;
  atividade: Atividade[];
};

const CHAVE_LIGADO = "nexofly:demo";
const CHAVE_DADOS = "nexofly:demo:dados";

export const ZERADO: Painel = {
  faturado: 0,
  aguardando: 0,
  propostasAbertas: 0,
  entregas: 0,
  ticket: 0,
  fluxo: Array(12).fill(0),
  aberto: Array(12).fill(0),
  pecas: { fotos: 0, video: 0, site: 0, abordagem: 0 },
  atividade: [],
};

/** Índice do mês corrente. Mês que ainda não chegou não tem faturamento. */
export const mesCorrente = () => new Date().getMonth();

/**
 * Rampa cheia do ano. O que passa do mês corrente é zerado, senão o
 * painel mostraria dezembro faturado em agosto.
 */
const RAMPA = [
  1240, 2180, 3060, 4310, 5220, 6480, 7950, 9340, 10700, 12100, 13850, 15200,
];

export const soAteHoje = (v: number[], mes = mesCorrente()) =>
  v.map((n, i) => (i <= mes ? n : 0));

const RAMPA_ABERTO = [
  380, 640, 900, 1180, 1420, 1760, 2120, 2480, 2810, 3140, 3520, 3900,
];

const FLUXO_EXEMPLO = soAteHoje(RAMPA);
const ABERTO_EXEMPLO = soAteHoje(RAMPA_ABERTO);

/** Ponto de partida da demonstração. Não representa nenhuma conta real. */
export const EXEMPLO: Painel = {
  faturado: FLUXO_EXEMPLO[mesCorrente()],
  aguardando: 3240,
  propostasAbertas: 4,
  entregas: 27,
  ticket: 1386,
  fluxo: FLUXO_EXEMPLO,
  aberto: ABERTO_EXEMPLO,
  pecas: { fotos: 42, video: 27, site: 19, abordagem: 31 },
  atividade: [
    { quando: "há 2 h", texto: "Pousada Recanto da Serra · pacote fechado", valor: 1560 },
    { quando: "há 5 h", texto: "Chalés Vista Panorâmica · proposta enviada", valor: null },
    { quando: "ontem", texto: "Casa Jardim Central · site publicado", valor: 690 },
    { quando: "ontem", texto: "Loft Centro Histórico · pacote fechado", valor: 1170 },
    { quando: "há 3 dias", texto: "Villa das Araucárias · vídeo entregue", valor: 390 },
  ],
};

export type Estado = { ligado: boolean; dados: Painel };

const NO_SERVIDOR: Estado = { ligado: false, dados: EXEMPLO };

let estado: Estado = NO_SERVIDOR;
let carregou = false;
const ouvintes = new Set<() => void>();

/** Preenche o que faltar, para um localStorage antigo não quebrar a tela. */
function completa(bruto: unknown): Painel {
  const p = (bruto ?? {}) as Partial<Painel>;
  const fluxo = Array.isArray(p.fluxo) ? p.fluxo.slice(0, 12) : [];
  const aberto = Array.isArray(p.aberto) ? p.aberto.slice(0, 12) : [];
  return {
    faturado: Number(p.faturado ?? EXEMPLO.faturado),
    aguardando: Number(p.aguardando ?? EXEMPLO.aguardando),
    propostasAbertas: Number(p.propostasAbertas ?? EXEMPLO.propostasAbertas),
    entregas: Number(p.entregas ?? EXEMPLO.entregas),
    ticket: Number(p.ticket ?? EXEMPLO.ticket),
    fluxo: soAteHoje(
      Array.from({ length: 12 }, (_, i) => Number(fluxo[i] ?? 0)),
    ),
    aberto: soAteHoje(
      Array.from({ length: 12 }, (_, i) => Number(aberto[i] ?? 0)),
    ),
    pecas: { ...EXEMPLO.pecas, ...(p.pecas ?? {}) },
    atividade: Array.isArray(p.atividade) ? p.atividade : EXEMPLO.atividade,
  };
}

function carrega() {
  if (carregou) return;
  carregou = true;
  let dados = EXEMPLO;
  try {
    const salvo = localStorage.getItem(CHAVE_DADOS);
    if (salvo) dados = completa(JSON.parse(salvo));
  } catch {
    // JSON corrompido: cai no exemplo em vez de derrubar o painel
  }
  estado = { ligado: localStorage.getItem(CHAVE_LIGADO) === "1", dados };
}

function assinar(aoMudar: () => void) {
  carrega();
  ouvintes.add(aoMudar);
  return () => {
    ouvintes.delete(aoMudar);
  };
}

const pegar = () => estado;
const pegarNoServidor = () => NO_SERVIDOR;

function publica(novo: Estado) {
  estado = novo;
  ouvintes.forEach((f) => f());
}

export function ligarDemo(valor: boolean) {
  carrega();
  localStorage.setItem(CHAVE_LIGADO, valor ? "1" : "0");
  publica({ ligado: valor, dados: estado.dados });
}

export function salvarDemo(dados: Painel) {
  carrega();
  localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
  publica({ ligado: estado.ligado, dados });
}

export function editarDemo(troca: Partial<Painel>) {
  salvarDemo({ ...estado.dados, ...troca });
}

export function restaurarDemo() {
  salvarDemo(EXEMPLO);
}

/** Devolve o estado inteiro; o objeto é estável entre renders. */
export function useDemo(): Estado {
  return useSyncExternalStore(assinar, pegar, pegarNoServidor);
}
