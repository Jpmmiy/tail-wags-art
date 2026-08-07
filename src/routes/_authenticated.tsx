import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { syncProjectsOnLogin } from '@/lib/persistence'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    console.log("[AUTH] 4. no início do beforeLoad de _authenticated na rota:", location.pathname);
    
    // Tenta pegar a sessão atual
    const { data: { session } } = await supabase.auth.getSession()
    console.log("[AUTH] 5. no resultado do getSession() dentro do beforeLoad. temSessao:", !!session);

    // Se estiver logado e na página de auth ou home, vai para o painel
    if (session && (location.pathname === '/auth' || location.pathname === '/')) {
      console.log("Usuário logado tentando acessar root/auth, redirecionando para painel");
      throw redirect({ to: '/painel' });
    }

    if (!session) {
      console.log("[AUTH] 6. no momento exato em que o redirect para /auth é disparado");
      // Se não estiver logado e NÃO estiver na rota de auth, redireciona para /auth
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

    return { session }
  },
  component: () => <Outlet />,
})
