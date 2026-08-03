import { createFileRoute } from "@tanstack/react-router";

import { nomePais, nomeRegiao } from "@/lib/locais";
import type { CorpoBusca, ImovelEncontrado } from "@/lib/imoveis-tipos";

const CAMPOS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.photos",
].join(",");

function linkAirbnb(cidade: string, estado: string, pais: string) {
  const termo = encodeURIComponent(`${cidade}, ${estado}, ${pais}`);
  return `https://www.airbnb.com.br/s/${termo}/homes`;
}

/** Resultados de demonstração, usados quando não há chave configurada. */
function exemplos(c: CorpoBusca): ImovelEncontrado[] {
  const uf = c.regiao ? nomeRegiao(c.pais, c.regiao) : nomePais(c.pais);
  const base = [
    { nome: "Pousada Recanto da Serra", nota: 4.6, av: 128, fotos: 8 },
    { nome: "Chalés Vista Panorâmica", nota: 4.8, av: 64, fotos: 6 },
    { nome: "Casa Jardim Central", nota: 4.3, av: 41, fotos: 5 },
    { nome: "Residencial Alto do Mirante", nota: 4.9, av: 212, fotos: 12 },
    { nome: "Loft Centro Histórico", nota: 4.4, av: 87, fotos: 7 },
    { nome: "Villa das Araucárias", nota: 4.7, av: 33, fotos: 9 },
  ];

  return base.map((b, i) => ({
    id: `demo-${i}`,
    nome: b.nome,
    endereco: `${c.cidade}, ${uf}`,
    nota: b.nota,
    avaliacoes: b.av,
    telefone: null,
    site: null,
    mapa: `https://www.google.com/maps/search/${encodeURIComponent(
      `${b.nome} ${c.cidade} ${uf}`,
    )}`,
    airbnb: linkAirbnb(c.cidade, uf, nomePais(c.pais)),
    fotos: b.fotos,
  }));
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
          return json({ fonte: "exemplo" as const, imoveis: exemplos(corpo) });
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
              nationalPhoneNumber?: string;
              websiteUri?: string;
              googleMapsUri?: string;
              photos?: unknown[];
            }>;
          };

          const imoveis: ImovelEncontrado[] = (dados.places ?? []).map((p) => ({
            id: p.id,
            nome: p.displayName?.text ?? "Sem nome",
            endereco: p.formattedAddress ?? `${corpo.cidade}, ${uf}`,
            nota: p.rating ?? null,
            avaliacoes: p.userRatingCount ?? null,
            telefone: p.nationalPhoneNumber ?? null,
            site: p.websiteUri ?? null,
            mapa: p.googleMapsUri ?? null,
            airbnb:
              corpo.modalidade === "temporada"
                ? linkAirbnb(corpo.cidade, uf, paisNome)
                : null,
            fotos: p.photos?.length ?? 0,
          }));

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
