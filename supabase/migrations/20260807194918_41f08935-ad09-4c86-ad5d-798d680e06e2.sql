-- Fix final para os alertas do linter

-- Corrigir has_role com search_path e permissões
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Corrigir handle_app_settings_update com search_path robusto e permissões
CREATE OR REPLACE FUNCTION public.handle_app_settings_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_app_settings_update() FROM public;
REVOKE EXECUTE ON FUNCTION public.handle_app_settings_update() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_app_settings_update() TO service_role;
