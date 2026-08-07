-- Política para permitir que o service_role gerencie tudo
-- (Já possui GRANT ALL, mas o linter pede policy)
CREATE POLICY "service_role_full_access" ON public.webhook_events
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Política para permitir que admins visualizem eventos no painel
CREATE POLICY "admins_view_webhook_events" ON public.webhook_events
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
