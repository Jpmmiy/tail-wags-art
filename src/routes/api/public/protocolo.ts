import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/api/public/protocolo')({
  server: {
    handlers: {
      GET: async () => {
        // PASSO 3 — ROTA PÚBLICA SEGURA
        // Buscamos as configurações que precisam ser públicas (notificações de venda)
        // sem expor a tabela inteira via RLS
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'protocolo_config')
          .single();

        if (error || !data) {
          return new Response(JSON.stringify({ enabled: false, sales: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Filtramos apenas o necessário para o frontend público
        const val = data.value as any;
        const publicData = {
          enabled: val.enabled ?? false,
          sales: val.sales ?? [],
          triggers: val.triggers ?? { onLoad: true, onScroll: false, onExit: false }
        };

        return new Response(JSON.stringify(publicData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }
})
