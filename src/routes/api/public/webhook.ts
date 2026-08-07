import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const bodyText = await request.text();
          const signature = request.headers.get('x-applyfy-signature') || request.headers.get('Authorization');
          
          // Se houver uma chave configurada, validamos
          const webhookSecret = process.env['APPLYFY_WEBHOOK_SECRET'];
          if (webhookSecret && signature !== webhookSecret) {
            console.error('[Webhook] Assinatura inválida');
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
          }

          const body = JSON.parse(bodyText);
          console.log('Applyfy Webhook Received:', body);

          const { event, data } = body;
          // Mapeamento flexível de eventos da Applyfy
          const isApproved = event === 'order_approved' || 
                            event === 'transaction_paid' || 
                            event === 'Transação paga' ||
                            event === 'payment_approved';

          if (isApproved && data?.customer?.email) {
            const email = data.customer.email;
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

            const { data: userCreated, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email: email,
              password: '12345678',
              email_confirm: true,
              user_metadata: {
                created_via_webhook: true,
                initial_login_timer_start: Date.now()
              }
            });

            if (authError) {
              if (authError.message.includes('already registered')) {
                console.log(`[Webhook] Usuário ${email} já existe.`);
              } else {
                console.error(`[Webhook] Erro Auth: ${authError.message}`);
              }
            } else if (userCreated?.user) {
              console.log(`[Webhook] Usuário criado: ${email}`);
              // Garante que o usuário tenha a role 'user' se a tabela existir
              try {
                await supabaseAdmin.from('user_roles').insert({
                  user_id: userCreated.user.id,
                  role: 'user'
                });
              } catch (e) {
                console.log('[Webhook] Tabela user_roles não encontrada ou erro ao inserir role.');
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
