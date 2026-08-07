-- Correção dos alertas do Linter e melhoria de segurança

-- 1. Restringir execução da função has_role (SECURITY DEFINER)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 2. Corrigir a trigger de app_settings para ser mais robusta
CREATE OR REPLACE FUNCTION public.handle_app_settings_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Definir explicitamente o search_path para evitar ataques de mutação
  SET search_path = public;
  
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Revogar execução de funções SECURITY DEFINER de usuários anônimos
REVOKE EXECUTE ON FUNCTION public.handle_app_settings_update() FROM public;
GRANT EXECUTE ON FUNCTION public.handle_app_settings_update() TO service_role;
