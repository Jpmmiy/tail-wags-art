import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { syncProjectsOnLogin } from '@/lib/persistence'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    // Tenta pegar a sessão atual de forma síncrona se possível ou assíncrona
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.log("Sessão não encontrada em _authenticated, redirecionando para /auth");
      throw redirect({ 
        to: '/auth', 
        search: { 
          redirect: location.href 
        } 
      })
    }

    console.log("Sessão encontrada em _authenticated para o usuário:", session.user.id);

    try {
      // Sincroniza projetos em segundo plano para não travar o carregamento inicial
      syncProjectsOnLogin(session.user.id).catch(err => console.error("Erro ao sincronizar projetos:", err));

      if (location.pathname === '/' || location.pathname === '/auth') {
        throw redirect({ to: '/painel' });
      }

      return { session }
    } catch (error) {
      console.error("Erro no loader de _authenticated:", error);
      return { session }
    }
  },
  component: () => <Outlet />,
})
