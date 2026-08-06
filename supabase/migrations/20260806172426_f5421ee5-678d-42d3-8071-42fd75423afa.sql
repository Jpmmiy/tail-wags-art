
-- Se o tipo já existir, não falhamos, apenas prosseguimos.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'protocolo', 'user');
    END IF;
END $$;

-- Criar tabela user_roles se não existir
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função has_role resiliente
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Tabela para Log de Erros
CREATE TABLE IF NOT EXISTS public.system_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    context JSONB
);

GRANT INSERT ON public.system_errors TO authenticated;
GRANT ALL ON public.system_errors TO service_role;

ALTER TABLE public.system_errors ENABLE ROW LEVEL SECURITY;

-- Evitar erro de duplicidade em políticas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own errors') THEN
        CREATE POLICY "Users can insert their own errors" ON public.system_errors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all errors') THEN
        CREATE POLICY "Admins can view all errors" ON public.system_errors FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;
