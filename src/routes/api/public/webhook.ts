import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          console.log('Applyfy Webhook Received:', body);

          const { event, data } = body;
          // Mapeamento flexível de eventos da Applyfy
          const isApproved = event === 'order_approved' || 
                            event === 'transaction_paid' || 
                            event === 'Transação paga' ||
                            event === 'payment_approved';

          if (isApproved && data?.customer?.email) {
            const email = data.customer.email;
            
            // Segurança: Garantir que estamos no ambiente de servidor
            if (typeof process !== 'undefined') {
              const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

              const { error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: '12345678',
                email_confirm: true
              });

              if (authError) {
                if (authError.message.includes('already registered')) {
                  console.log(`[Webhook] Usuário ${email} já existe.`);
                } else {
                  console.error(`[Webhook] Erro Auth: ${authError.message}`);
                }
              } else {
                console.log(`[Webhook] Usuário criado: ${email}`);
              }
            }
          }

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('[Webhook] Error:', error);
          return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
