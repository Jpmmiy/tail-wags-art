export const PRICING_BASE = {
  fotos: 480,
  video: 390,
  site: 690,
  recorrencia: 250, // Valor mensal sugerido
};

export function calculatePricing(diaria: number, modalidade: "temporada" | "imobiliario", entregaveis: string[] = ["fotos", "video", "site", "abordagem"], customTable?: any) {
  const table = customTable || PRICING_BASE;
  const multiplicador = modalidade === "temporada" 
    ? Math.max(1, diaria / 300) 
    : Math.max(1, diaria / 500000);

  const precos = {
    fotos: Math.round(table.fotos * multiplicador),
    video: Math.round(table.video * multiplicador),
    site: Math.round(table.site * multiplicador),
    abordagem: 0
  };

  const tem = (id: string) => entregaveis.includes(id);

  const itensEssencial = [];
  if (tem("fotos")) itensEssencial.push("Fotos tratadas");
  if (tem("video")) itensEssencial.push("Vídeo curto (4 shots)");
  
  const valorEssencial = (tem("fotos") ? precos.fotos : 0) + (tem("video") ? precos.video : 0);

  const itensCompleto = [...itensEssencial];
  if (tem("site")) itensCompleto.push("Site com reserva direta");
  const valorCompleto = valorEssencial + (tem("site") ? precos.site : 0);

  const recorrencia = Math.round(PRICING_BASE.recorrencia * multiplicador);

  return {
    essencial: {
      titulo: "Essencial",
      valor: valorEssencial,
      inclui: itensEssencial,
      visivel: itensEssencial.length > 0
    },
    completo: {
      titulo: "Completo",
      valor: valorCompleto,
      inclui: itensCompleto,
      visivel: itensCompleto.length > 0
    },
    premium: {
      titulo: "Premium",
      valor: valorCompleto + (recorrencia * 3),
      inclui: [...itensCompleto, "3 meses de suporte/recorrência"],
      visivel: itensCompleto.length > 0
    }
  };
}
