-- Tabela de uso de IA para limites e custos
CREATE TABLE public.ai_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    request_id text UNIQUE NOT NULL, -- ID enviado pelo frontend para idempotência
    route text NOT NULL,
    prompt_tokens integer,
    completion_tokens integer,
    estimated_cost numeric(10, 6), -- custo em USD
    ip text NOT NULL,
    status text NOT NULL DEFAULT 'processing', -- processing, completed, failed
    response_cache text, -- cache da resposta para idempotência
    created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Admins view all AI usage" ON public.ai_usage
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Grant para service_role (usado nas server functions)
GRANT ALL ON public.ai_usage TO service_role;
GRANT SELECT ON public.ai_usage TO authenticated;
