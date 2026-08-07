import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { syncProjectsOnLogin } from '@/lib/persistence'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    console.log("[AUTH] 4. no início do beforeLoad de _authenticated na rota:", location.pathname);
    
    const { data: { session } } = await supabase.auth.getSession()
    console.log("[AUTH] 5. resultado getSession() no beforeLoad. temSessao:", !!session);

    if (!session) {
      console.log("[AUTH] 6. Redirect para /auth");
      throw redirect({ 
        to: '/auth', 
        search: { redirect: location.href } 
      })
    }

    if (session && (location.pathname === '/auth' || location.pathname === '/')) {
      console.log("[AUTH] Redirect para /painel (já logado)");
      throw redirect({ to: '/painel' });
    }

    // REMOVIDO: syncProjectsOnLogin daqui para evitar chamadas duplicadas e bloqueios de guard.
    // O onAuthStateChange em __root cuida disso de forma assíncrona.

    return { session }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  console.log("[RENDER] 1. Início do componente AuthenticatedLayout (_authenticated.tsx)");
  return <Outlet />;
}
