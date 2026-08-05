DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE public.project_status AS ENUM ('rascunho', 'aguardando_resposta', 'em_producao', 'concluido');
    END IF;
END $$;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS status public.project_status DEFAULT 'rascunho';

-- Update existing records
UPDATE public.projects SET status = 'rascunho' WHERE status IS NULL;
UPDATE public.projects SET current_step = 3 WHERE current_step >= 4;
