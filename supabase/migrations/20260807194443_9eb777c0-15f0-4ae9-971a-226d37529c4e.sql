-- Criação da tabela de eventos de webhook para idempotência
CREATE TABLE public.webhook_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id text UNIQUE NOT NULL, -- ID que vem da Applyfy
    provider text NOT NULL DEFAULT 'applyfy',
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    status text NOT NULL DEFAULT 'pending', -- pending, processed, failed, ignored
    result text,
    created_at timestamptz DEFAULT now(),
    processed_at timestamptz
);

-- Habilitar RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Garantir acesso ao service_role
GRANT ALL ON public.webhook_events TO service_role;
GRANT SELECT ON public.webhook_events TO authenticated; -- Admin vai precisar ver isso depois no painel
