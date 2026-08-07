import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { syncProjectsOnLogin } from '@/lib/persistence'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({ 
        to: '/auth', 
        search: { 
          redirect: location.href 
        } 
      })
    }

    // Sincroniza rascunhos anônimos e recupera último ID no primeiro load autenticado
    await syncProjectsOnLogin(session.user.id);

    return { session }
  },
  component: () => <Outlet />,
})
