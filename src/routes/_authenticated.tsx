import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { syncProjectsOnLogin } from '@/lib/persistence'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    console.log("[RENDER] 1: AuthenticatedLayout beforeLoad");
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("[RENDER] 1.1: Session error:", sessionError);
    }
    console.log("[RENDER] 1.1: Session status:", !!session);
    
    if (!session) {
      console.log("[RENDER] 1.2: No session, redirecting to /auth");
      throw redirect({ 
        to: '/auth', 
        search: { 
          redirect: location.href 
        } 
      })
    }

    console.log("[RENDER] 1.3: Fetching profile for user:", session.user.id);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error("[RENDER] 1.4: Profile fetch error:", profileError);
    } else {
      console.log("[RENDER] 1.5: Profile loaded:", profile.tier);
    }

    return { session, profile }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const router = useRouter();
  console.log("[RENDER] 1: AuthenticatedLayout component rendering");
  
  return (
    <div className="min-h-screen bg-ink">
      <Outlet />
    </div>
  );
}
