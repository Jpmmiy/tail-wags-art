ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Permitir que o usuário atualize seu próprio perfil (onboarding)
CREATE POLICY "Users can update their own onboarding status"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

GRANT UPDATE(onboarding_completed) ON public.profiles TO authenticated;
