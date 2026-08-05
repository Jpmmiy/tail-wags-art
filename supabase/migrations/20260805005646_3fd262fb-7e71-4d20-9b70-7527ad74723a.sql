-- Ajustando a função handle_updated_at (embora não seja security definer, boa prática)
ALTER FUNCTION public.handle_updated_at() SET search_path = public;

-- Forçando o reset de permissões para garantir que o linter limpe os estados
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Garantindo que o linter veja o search_path em todas
ALTER FUNCTION public.has_role(UUID, public.app_role) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
