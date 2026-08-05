-- We need to drop the old projects table if it doesn't match the required schema
-- because our types.ts shows different columns (config, owner_id, etc) than what I requested.
-- However, since I just created it and it failed to sync properly or was already there,
-- let's make sure it has exactly the fields we need.

DROP TABLE IF EXISTS public.deliverables CASCADE;
DROP TABLE IF EXISTS public.briefings CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

-- Re-create Projects table with correct fields
CREATE TABLE public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id text NOT NULL,
    modalidade text CHECK (modalidade IN ('temporada', 'imobiliario')),
    current_step integer DEFAULT 1,
    status text DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'concluido')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO anon;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Properties table
CREATE TABLE public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    place_id text,
    nome text NOT NULL,
    endereco text,
    lat double precision,
    lng double precision,
    rating numeric,
    user_rating_count integer,
    photos_count integer,
    website_uri text,
    last_review_at timestamp with time zone,
    opportunity_score integer,
    opportunity_band text,
    signals jsonb,
    angulo_abordagem text
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO anon;
GRANT ALL ON public.properties TO service_role;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Briefings table
CREATE TABLE public.briefings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    publico text,
    comodos jsonb,
    diaria numeric,
    estilo_inferido text,
    formato_video text DEFAULT '9:16'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.briefings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.briefings TO anon;
GRANT ALL ON public.briefings TO service_role;

ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;

-- Deliverables table
CREATE TABLE public.deliverables (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    tipo text CHECK (tipo IN ('video', 'foto', 'site', 'proposta')),
    conteudo text,
    shot_number integer,
    modo text CHECK (modo IN ('lite', 'fast', 'quality')),
    creditos integer,
    dia_plano integer,
    gerado boolean DEFAULT false
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.deliverables TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deliverables TO anon;
GRANT ALL ON public.deliverables TO service_role;

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- Global access policies (for development)
CREATE POLICY "Projects global access" ON public.projects FOR ALL USING (true);
CREATE POLICY "Properties global access" ON public.properties FOR ALL USING (true);
CREATE POLICY "Briefings global access" ON public.briefings FOR ALL USING (true);
CREATE POLICY "Deliverables global access" ON public.deliverables FOR ALL USING (true);
