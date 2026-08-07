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

    // VERIFICAÇÃO DE ACESSO (TIER VITALÍCIO)
    // Buscamos o perfil no banco para garantir que o tier é real e não do localStorage
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', session.user.id)
      .single();

    // Se o usuário não for vitalício, você pode redirecionar ou limitar o acesso aqui
    // No momento, deixaremos passar para o dashboard, mas a lógica de bloqueio
    // de funcionalidades específicas deve ler o context.profile.tier retornado aqui.

    // Sincroniza rascunhos anônimos e recupera último ID no primeiro load autenticado
    await syncProjectsOnLogin(session.user.id);

    // Redireciona de /painel (que é uma rota de layout) para /painel/ (o dashboard real)
    // No TanStack Router, se _authenticated/painel.tsx existe, ele atende /painel
    // Mas se o usuário entrar em /_authenticated, redirecionamos para o painel.
    
    return { session, profile }

  },
  component: () => <Outlet />,
})

