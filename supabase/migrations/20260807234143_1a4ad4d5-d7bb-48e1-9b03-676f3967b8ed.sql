ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;