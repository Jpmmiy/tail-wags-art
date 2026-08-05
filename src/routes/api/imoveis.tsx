import { createFileRoute } from "@tanstack/react-router";

import { nomePais, nomeRegiao } from "@/lib/locais";
import type { CorpoBusca, ImovelEncontrado } from "@/lib/imoveis-tipos";
import { calculateScore } from "@/config/scoring";

const CAMPOS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.addressComponents",
  "places.rating",
  "places.userRatingCount",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.photos",
  "places.reviews",
  "places.priceLevel",
  "places.editorialSummary",
  "places.location",
].join(",");

function linkAirbnb(cidade: string, estado: string, pais: string) {
  const termo = encodeURIComponent(`${cidade}, ${estado}, ${pais}`);
  return `https://www.airbnb.com.br/s/${termo}/homes`;
}

/** Resultados de demonstração, usados quando não há chave configurada. */
function exemplos(c: CorpoBusca): ImovelEncontrado[] {
  const uf = c.regiao ? nomeRegiao(c.pais, c.regiao) : nomePais(c.pais);
  const base = [
    { nome: "Pousada Recanto da Serra", nota: 4.6, av: 128, fotos: 4, site: null, reviews: [{ publishTime: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString() }] },
    { nome: "Chalés Vista Panorâmica", nota: 4.8, av: 64, fotos: 6, site: "https://exemplo.com", reviews: [{ publishTime: new Date().toISOString() }] },
    { nome: "Casa Jardim Central", nota: 3.8, av: 12, fotos: 3, site: null, reviews: [{ publishTime: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString() }] },
    { nome: "Residencial Alto do Mirante", nota: 4.9, av: 212, fotos: 15, site: "https://exemplo.com", reviews: [{ publishTime: new Date().toISOString() }] },
    { nome: "Loft Centro Histórico", nota: 4.4, av: 87, fotos: 7, site: null, reviews: [{ publishTime: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() }] },
    { nome: "Villa das Araucárias", nota: 4.7, av: 33, fotos: 22, site: "https://exemplo.com", reviews: [{ publishTime: new Date().toISOString() }] },
  ];

  return base.map((b, i) => {
    const p = {
      id: `demo-${i}`,
      displayName: { text: b.nome },
      formattedAddress: `${c.cidade}, ${uf}`,
      rating: b.nota,
      userRatingCount: b.av,
      websiteUri: b.site,
      photos: Array(b.fotos).fill({}),
      reviews: b.reviews,
      googleMapsUri: "#",
    };
    
    const score = calculateScore(p);

    return {
      id: p.id,
      nome: b.nome,
      endereco: p.formattedAddress,
      nota: b.nota,
      avaliacoes: b.av,
      telefone: null,
      site: b.site,
      mapa: p.googleMapsUri,
      airbnb: linkAirbnb(c.cidade, uf, nomePais(c.pais)),
      fotos: b.fotos,
      score,
    } as ImovelEncontrado;
  }).sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0));
}

function json(dados: unknown, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/imoveis")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let corpo: CorpoBusca;
        try {
          corpo = (await request.json()) as CorpoBusca;
        } catch {
          return json({ erro: "Corpo inválido." }, 400);
        }

        if (!corpo?.cidade || !corpo?.pais) {
          return json({ erro: "Informe pelo menos país e cidade." }, 400);
        }

        const chave = process.env["GOOGLE_MAPS_API_KEY"];
        const paisNome = nomePais(corpo.pais);
        const uf = corpo.regiao ? nomeRegiao(corpo.pais, corpo.regiao) : paisNome;

        if (!chave) {
          return json(
            {
              erro: "Chave do Google Places não configurada.",
              detalhe: "Configure a variável de ambiente GOOGLE_MAPS_API_KEY.",
            },
            500,
          );
        }

        const consulta =
          corpo.modalidade === "temporada"
            ? `pousadas, chalés e casas de temporada em ${corpo.cidade}, ${uf}, ${paisNome}`
            : `imobiliárias e imóveis para alugar em ${corpo.cidade}, ${uf}, ${paisNome}`;

        try {
          const r = await fetch(
            "https://places.googleapis.com/v1/places:searchText",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": chave,
                "X-Goog-FieldMask": CAMPOS,
              },
              body: JSON.stringify({
                textQuery: consulta,
                languageCode: corpo.pais === "PT" ? "pt-PT" : "pt-BR",
                regionCode: corpo.pais,
                maxResultCount: 12,
                ...(corpo.modalidade === "temporada"
                  ? { includedType: "lodging" }
                  : {}),
              }),
            },
          );

          if (!r.ok) {
            const detalhe = await r.text();
            return json(
              {
                erro: "A busca falhou no Google Places.",
                detalhe: detalhe.slice(0, 300),
              },
              502,
            );
          }

          const dados = (await r.json()) as {
            places?: Array<{
              id: string;
              displayName?: { text?: string };
              formattedAddress?: string;
              rating?: number;
              userRatingCount?: number;
              websiteUri?: string;
              googleMapsUri?: string;
              photos?: unknown[];
              reviews?: Array<{ publishTime: string }>;
              priceLevel?: string;
              editorialSummary?: { text?: string };
              location?: { latitude: number; longitude: number };
            }>;
          };

          const imoveis: ImovelEncontrado[] = (dados.places ?? []).map((p) => {
            const score = calculateScore(p);
            return {
              id: p.id,
              nome: p.displayName?.text ?? "Sem nome",
              endereco: p.formattedAddress ?? `${corpo.cidade}, ${uf}`,
              nota: p.rating ?? null,
              avaliacoes: p.userRatingCount ?? null,
              telefone: null,
              site: p.websiteUri ?? null,
              mapa: p.googleMapsUri ?? null,
              airbnb:
                corpo.modalidade === "temporada"
                  ? linkAirbnb(corpo.cidade, uf, paisNome)
                  : null,
              fotos: p.photos?.length ?? 0,
              score,
              priceLevel: p.priceLevel,
              editorialSummary: p.editorialSummary?.text,
              reviews: p.reviews,
              location: p.location,
            } as ImovelEncontrado;
          }).sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0));

          return json({ fonte: "google" as const, imoveis });
        } catch (e) {
          return json(
            {
              erro: "Não consegui falar com o Google Places.",
              detalhe: String(e),
            },
            502,
          );
        }
      },
    },
  },
});
