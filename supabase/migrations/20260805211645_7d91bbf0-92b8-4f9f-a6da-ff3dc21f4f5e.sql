CREATE TABLE public.radar_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cidade_place_id TEXT NOT NULL,
    cidade_nome TEXT NOT NULL,
    modalidade TEXT NOT NULL,
    resultados JSONB NOT NULL,
    total_encontrados INTEGER NOT NULL,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (cidade_place_id, modalidade)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.radar_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.radar_cache TO anon;
GRANT ALL ON public.radar_cache TO service_role;

ALTER TABLE public.radar_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read and write radar_cache" ON public.radar_cache
    FOR ALL USING (true);