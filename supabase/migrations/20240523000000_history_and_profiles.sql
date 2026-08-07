-- Adiciona novos campos à tabela de projetos
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS name text;

-- Cria tabela de versões de entregáveis para não sobrescrever
CREATE TABLE IF NOT EXISTS public.deliverable_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id uuid REFERENCES public.deliverables(id) ON DELETE CASCADE NOT NULL,
    conteudo text NOT NULL,
    criado_em timestamptz DEFAULT now() NOT NULL,
    criado_por uuid REFERENCES auth.users(id)
);

GRANT SELECT, INSERT ON public.deliverable_versions TO authenticated;
GRANT ALL ON public.deliverable_versions TO service_role;

ALTER TABLE public.deliverable_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias versões" ON public.deliverable_versions
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.deliverables d
            JOIN public.projects p ON d.project_id = p.id
            WHERE d.id = deliverable_versions.deliverable_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem criar suas próprias versões" ON public.deliverable_versions
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.deliverables d
            JOIN public.projects p ON d.project_id = p.id
            WHERE d.id = deliverable_versions.deliverable_id
            AND p.user_id = auth.uid()
        )
    );

-- Atualiza a tabela profiles com campos de negócio
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pricing_table jsonb;

-- Storage bucket para logos
-- Nota: Buckets são criados via API, mas políticas são SQL
