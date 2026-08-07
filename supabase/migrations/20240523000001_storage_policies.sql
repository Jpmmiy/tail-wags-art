-- Políticas para o bucket public-assets-logos (logo do usuário)
CREATE POLICY "Logos são visíveis publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'public-assets-logos');

CREATE POLICY "Usuários podem gerenciar seus próprios logos"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'public-assets-logos' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'public-assets-logos' AND (storage.foldername(name))[1] = auth.uid()::text);
