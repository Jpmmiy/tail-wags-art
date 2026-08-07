import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { syncProjectsOnLogin } from '@/lib/persistence'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    // Tenta pegar a sessão atual
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.log("Sem sessão em _authenticated, checando redirecionamento...");
      // Se não estiver logado, redireciona para /auth
      if (location.pathname !== '/auth') {
        throw redirect({ 
          to: '/auth', 
          search: { 
            redirect: location.href 
          } 
        })
      }
      return { session: null };
    }

    // Se estiver logado, sincroniza projetos
    syncProjectsOnLogin(session.user.id).catch(console.error);

    // Se estiver logado e na página de auth ou home, vai para o painel
    if (location.pathname === '/' || location.pathname === '/auth') {
      console.log("Usuário logado tentando acessar root/auth, redirecionando para painel");
      throw redirect({ to: '/painel' });
    }

    return { session }
  },
  component: () => <Outlet />,
})
