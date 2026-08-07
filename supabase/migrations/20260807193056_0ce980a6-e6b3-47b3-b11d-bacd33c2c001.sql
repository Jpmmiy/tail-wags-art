
-- Step 1: Ensure owner column exists and is linked to auth.users
-- The table already has 'user_id' which is used for ownership. 
-- I will add a foreign key constraint if it's missing and set default.

DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'projects' AND constraint_type = 'FOREIGN KEY' 
        AND constraint_name = 'projects_user_id_fkey'
    ) THEN
        ALTER TABLE public.projects 
        ADD CONSTRAINT projects_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

ALTER TABLE public.projects ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Step 2: Drop permissive policies
DROP POLICY IF EXISTS "Projects global access" ON public.projects;
DROP POLICY IF EXISTS "Properties global access" ON public.properties;
DROP POLICY IF EXISTS "Briefings global access" ON public.briefings;
DROP POLICY IF EXISTS "Deliverables global access" ON public.deliverables;

-- Step 3: Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties FORCE ROW LEVEL SECURITY;

ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefings FORCE ROW LEVEL SECURITY;

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables FORCE ROW LEVEL SECURITY;

-- Step 4: Projects Policies (owner_id in my list is user_id in the DB)
CREATE POLICY "projects_select_own" ON public.projects
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "projects_insert_own" ON public.projects
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "projects_update_own" ON public.projects
    FOR UPDATE TO authenticated USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
CREATE POLICY "projects_delete_own" ON public.projects
    FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Step 5: Child Tables Policies (inherited via project_id)

-- Properties
CREATE POLICY "properties_select_own" ON public.properties
    FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = properties.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "properties_insert_own" ON public.properties
    FOR INSERT TO authenticated WITH CHECK (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = properties.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "properties_update_own" ON public.properties
    FOR UPDATE TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = properties.project_id AND p.user_id = auth.uid())
    ) WITH CHECK (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = properties.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "properties_delete_own" ON public.properties
    FOR DELETE TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = properties.project_id AND p.user_id = auth.uid())
    );

-- Briefings
CREATE POLICY "briefings_select_own" ON public.briefings
    FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = briefings.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "briefings_insert_own" ON public.briefings
    FOR INSERT TO authenticated WITH CHECK (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = briefings.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "briefings_update_own" ON public.briefings
    FOR UPDATE TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = briefings.project_id AND p.user_id = auth.uid())
    ) WITH CHECK (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = briefings.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "briefings_delete_own" ON public.briefings
    FOR DELETE TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = briefings.project_id AND p.user_id = auth.uid())
    );

-- Deliverables
CREATE POLICY "deliverables_select_own" ON public.deliverables
    FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = deliverables.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "deliverables_insert_own" ON public.deliverables
    FOR INSERT TO authenticated WITH CHECK (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = deliverables.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "deliverables_update_own" ON public.deliverables
    FOR UPDATE TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = deliverables.project_id AND p.user_id = auth.uid())
    ) WITH CHECK (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = deliverables.project_id AND p.user_id = auth.uid())
    );
CREATE POLICY "deliverables_delete_own" ON public.deliverables
    FOR DELETE TO authenticated USING (
      EXISTS (SELECT 1 FROM public.projects p WHERE p.id = deliverables.project_id AND p.user_id = auth.uid())
    );

-- Step 6: Indices
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_project_id ON public.properties(project_id);
CREATE INDEX IF NOT EXISTS idx_briefings_project_id ON public.briefings(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON public.deliverables(project_id);

-- Grants
GRANT ALL ON public.projects TO authenticated;
GRANT ALL ON public.properties TO authenticated;
GRANT ALL ON public.briefings TO authenticated;
GRANT ALL ON public.deliverables TO authenticated;
GRANT ALL ON public.projects TO service_role;
GRANT ALL ON public.properties TO service_role;
GRANT ALL ON public.briefings TO service_role;
GRANT ALL ON public.deliverables TO service_role;
