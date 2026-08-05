-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
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
CREATE TABLE IF NOT EXISTS public.properties (
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
CREATE TABLE IF NOT EXISTS public.briefings (
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
CREATE TABLE IF NOT EXISTS public.deliverables (
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

-- Simple policies for rapid development
CREATE POLICY "Projects accessible by owner or session" ON public.projects FOR ALL USING (true);
CREATE POLICY "Properties accessible by owner or session" ON public.properties FOR ALL USING (true);
CREATE POLICY "Briefings accessible by owner or session" ON public.briefings FOR ALL USING (true);
CREATE POLICY "Deliverables accessible by owner or session" ON public.deliverables FOR ALL USING (true);
