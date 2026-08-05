export const PRICING_BASE = {
  fotos: 480,
  video: 390,
  site: 690,
  recorrencia: 250, // Valor mensal sugerido
};

export function calculatePricing(diaria: number, modalidade: "temporada" | "imobiliario") {
  // Ajuste de preço baseado no valor do imóvel ou diária
  // Se for imobiliário, o valor é muito maior, então usamos uma base diferente ou fator de escala
  const multiplicador = modalidade === "temporada" 
    ? Math.max(1, diaria / 300) 
    : Math.max(1, diaria / 500000);

  const fotos = Math.round(PRICING_BASE.fotos * multiplicador);
  const video = Math.round(PRICING_BASE.video * multiplicador);
  const site = Math.round(PRICING_BASE.site * multiplicador);
  const recorrencia = Math.round(PRICING_BASE.recorrencia * multiplicador);

  return {
    essencial: {
      titulo: "Essencial",
      valor: fotos + video,
      inclui: ["Fotos tratadas", "Vídeo curto (4 shots)"],
    },
    completo: {
      titulo: "Completo",
      valor: fotos + video + site,
      inclui: ["Fotos tratadas", "Vídeo curto (4 shots)", "Site com reserva direta"],
    },
    premium: {
      titulo: "Premium",
      valor: fotos + video + site + (recorrencia * 3), // 3 meses de recorrência inclusos
      inclui: ["Fotos tratadas", "Vídeo curto (4 shots)", "Site com reserva direta", "3 meses de suporte/recorrência"],
    }
  };
}
