-- Adicionar colunas necessárias para a Sala de Produção
ALTER TABLE public.deliverables 
ADD COLUMN IF NOT EXISTS prompt_pt TEXT,
ADD COLUMN IF NOT EXISTS prompt_en TEXT,
ADD COLUMN IF NOT EXISTS idioma_escolhido TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS gerado_em TIMESTAMPTZ;

-- Ajustar a constraint para permitir upsert por (project_id, shot_number)
ALTER TABLE public.deliverables DROP CONSTRAINT IF EXISTS deliverables_project_id_shot_number_key;
ALTER TABLE public.deliverables ADD CONSTRAINT deliverables_project_id_shot_number_key UNIQUE (project_id, shot_number);

-- Garantir privilégios
GRANT ALL ON public.deliverables TO authenticated;
GRANT ALL ON public.deliverables TO service_role;
GRANT ALL ON public.deliverables TO anon;
