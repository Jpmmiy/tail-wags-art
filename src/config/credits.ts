export const CREDIT_COSTS = {
  LITE: 10,
  FAST: 25,
  QUALITY: 100,
  CREDITOS_DIARIOS_GRATIS: 50
};

export const VIDEO_PLAN = [
  {
    dia: 1,
    justificativa: "são os dois clipes que mais convencem o anfitrião",
    items: [
      { id: "shot2", nome: "Área Social", shot: 2, modo: "FAST" },
      { id: "shot3", nome: "Diferencial do Imóvel", shot: 3, modo: "FAST" }
    ]
  },
  {
    dia: 2,
    justificativa: "complementam a narrativa com chegada e detalhes",
    items: [
      { id: "shot1", nome: "Fachada / Chegada", shot: 1, modo: "FAST" },
      { id: "shot4", nome: "Detalhe e Frame Final", shot: 4, modo: "FAST" }
    ]
  }
];
