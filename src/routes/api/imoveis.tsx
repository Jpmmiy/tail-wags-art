import { createFileRoute } from "@tanstack/react-router";
import { nomePais, nomeRegiao } from "@/lib/locais";
import type { CorpoBusca, ImovelEncontrado } from "@/lib/imoveis-tipos";
import { calculateScore } from "@/config/scoring";
import { supabase } from "@/integrations/supabase/client";

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

const TYPES_TEMPORADA = [
  "bed_and_breakfast", "guest_house", "cottage", "hostel", "inn", 
  "lodging", "farmstay", "private_guest_room", "resort_hotel", 
  "extended_stay_hotel", "motel"
];

const TYPES_IMOBILIARIO = ["real_estate_agency"];

function linkAirbnb(cidade: string, estado: string, pais: string) {
  const termo = encodeURIComponent(`${cidade}, ${estado}, ${pais}`);
  return `https://www.airbnb.com.br/s/${termo}/homes`;
}

function json(dados: unknown, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function fetchPlaces(url: string, body: any, key: string) {
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": CAMPOS,
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(err);
  }
  return await r.json();
}

export const Route = createFileRoute("/api/imoveis")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let corpo: CorpoBusca & { forceRefresh?: boolean };
        try {
          corpo = (await request.json()) as any;
        } catch {
          return json({ erro: "Corpo inválido." }, 400);
        }

        if (!corpo?.cidade || !corpo?.pais) {
          return json({ erro: "Informe pelo menos país e cidade." }, 400);
        }

        const chave = process.env["GOOGLE_MAPS_API_KEY"];
        if (!chave) return json({ erro: "Chave não configurada." }, 500);

        const paisNome = nomePais(corpo.pais);
        const uf = corpo.regiao ? nomeRegiao(corpo.pais, corpo.regiao) : paisNome;

        // 1. RESOLVER CIDADE
        const citySearch = await fetchPlaces(
          "https://places.googleapis.com/v1/places:searchText",
          {
            textQuery: `${corpo.cidade}, ${uf}, ${paisNome}`,
            maxResultCount: 1,
            languageCode: "pt-BR",
          },
          chave
        );

        const cityPlace = citySearch.places?.[0];
        if (!cityPlace) return json({ erro: "Cidade não encontrada." }, 404);

        const cityPlaceId = cityPlace.id;
        const cityLocation = cityPlace.location;

        // 2. CHECK CACHE
        if (!corpo.forceRefresh) {
          const { data: cache } = await supabase
            .from("radar_cache")
            .select("*")
            .eq("cidade_place_id", cityPlaceId)
            .eq("modalidade", corpo.modalidade)
            .maybeSingle();

          if (cache) {
            const dias = (Date.now() - new Date(cache.criado_em).getTime()) / (1000 * 60 * 60 * 24);
            if (dias < 7) {
              return json({ 
                fonte: "cache", 
                imoveis: cache.resultados, 
                atualizado_ha: Math.floor(dias),
                total: cache.total_encontrados 
              });
            }
          }
        }

        // 3. BUSCAS EM PARALELO
        const promises: Promise<any>[] = [];
        const isTemporada = corpo.modalidade === "temporada";

        // Step 2: Nearby Search (3 radii)
        const types = isTemporada ? TYPES_TEMPORADA : TYPES_IMOBILIARIO;
        [5000, 15000, 30000].forEach(radius => {
          promises.push(
            fetchPlaces("https://places.googleapis.com/v1/places:searchNearby", {
              locationRestriction: { circle: { center: cityLocation, radius } },
              includedTypes: types,
              maxResultCount: 20,
              languageCode: "pt-BR",
            }, chave)
          );
        });

        // Step 3: Text Search (specific keywords)
        const queries = isTemporada 
          ? [
              `pousada em ${corpo.cidade}`, 
              `chalé em ${corpo.cidade}`, 
              `casa de temporada ${corpo.cidade}`, 
              `flat ${corpo.cidade}`, 
              `apart hotel ${corpo.cidade}`, 
              `aluguel por temporada ${corpo.cidade}`
            ]
          : [
              `imobiliária ${corpo.cidade}`, 
              `corretor de imóveis ${corpo.cidade}`, 
              `administradora de imóveis ${corpo.cidade}`, 
              `construtora ${corpo.cidade}`
            ];

        queries.forEach(q => {
          promises.push(
            fetchPlaces("https://places.googleapis.com/v1/places:searchText", {
              textQuery: q,
              maxResultCount: 10,
              languageCode: "pt-BR",
              regionCode: corpo.pais,
            }, chave)
          );
        });

        const results = await Promise.allSettled(promises);
        const allPlaces: any[] = [];
        
        results.forEach(res => {
          if (res.status === "fulfilled" && res.value.places) {
            allPlaces.push(...res.value.places);
          }
        });

        // Step 4: Deduplicate
        const uniquePlaces = Array.from(new Map(allPlaces.map(p => [p.id, p])).values());

        // Step 5: Score and Map
        const imoveis: ImovelEncontrado[] = uniquePlaces.map(p => {
          const score = calculateScore(p);
          
          let ufReal = uf;
          const ufComponent = p.addressComponents?.find((c: any) => c.types.includes("administrative_area_level_1"));
          if (ufComponent) ufReal = ufComponent.shortText;

          return {
            id: p.id,
            nome: p.displayName?.text ?? "Sem nome",
            endereco: p.formattedAddress ?? `${corpo.cidade}, ${ufReal}`,
            nota: p.rating ?? null,
            avaliacoes: p.userRatingCount ?? null,
            telefone: null,
            site: p.websiteUri ?? null,
            mapa: p.googleMapsUri ?? null,
            airbnb: isTemporada ? linkAirbnb(corpo.cidade, ufReal, paisNome) : null,
            fotos: p.photos?.length ?? 0,
            primeiraFoto: p.photos?.[0]?.name,
            score,
            priceLevel: p.priceLevel,
            editorialSummary: p.editorialSummary?.text,
            reviews: p.reviews,
            location: p.location,
          } as ImovelEncontrado;
        }).sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0));

        // 4. SAVE CACHE
        try {
          await supabase
            .from("radar_cache")
            .upsert({
              cidade_place_id: cityPlaceId,
              cidade_nome: corpo.cidade,
              modalidade: corpo.modalidade,
              resultados: imoveis,
              total_encontrados: imoveis.length,
              criado_em: new Date().toISOString()
            }, { onConflict: "cidade_place_id, modalidade" });
        } catch (e) {
          console.error("Cache save error:", e);
        }

        return json({ fonte: "google", imoveis, total: imoveis.length });
      },
    },
  },
});