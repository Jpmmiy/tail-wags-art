import { createFileRoute } from '@tanstack/react-router';
import { createHmac, timingSafeEqual } from 'crypto';

export const Route = createFileRoute('/api/public/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        
        try {
          // 1. Obter corpo cru para validação de assinatura
          const bodyText = await request.text();
          
          // 2. Verificar Segredo de Webhook
          const webhookSecret = process.env['APPLYFY_WEBHOOK_SECRET'];
          if (!webhookSecret) {
            console.error('[Webhook] APPLYFY_WEBHOOK_SECRET não configurada');
            return new Response('Configuration Error', { status: 500 });
          }

          // 3. Validação de Assinatura (Flexível para HMAC ou Token Estático)
          // Nota: A Applyfy geralmente envia no header 'x-applyfy-signature'
          const signature = request.headers.get('x-applyfy-signature') || request.headers.get('Authorization');
          
          if (!signature) {
            console.warn(`[Webhook] Tentativa sem assinatura bloqueada. IP: ${ip}`);
            return new Response('Unauthorized', { status: 401 });
          }

          // Se o segredo começar com 'sha256=', assumimos que o usuário quer validação HMAC
          // Caso contrário, usamos timingSafeEqual para token estático
          let isAuthorized = false;
          
          if (webhookSecret.startsWith('sha256=')) {
            const secret = webhookSecret.replace('sha256=', '');
            const expected = createHmac('sha256', secret).update(bodyText).digest('hex');
            isAuthorized = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
          } else {
            // Token estático - SEMPRE usar timingSafeEqual para evitar ataques de tempo
            isAuthorized = timingSafeEqual(Buffer.from(signature), Buffer.from(webhookSecret));
          }

          if (!isAuthorized) {
            console.warn(`[Webhook] Assinatura INVÁLIDA bloqueada. IP: ${ip}`);
            return new Response('Unauthorized', { status: 401 });
          }

          const body = JSON.parse(bodyText);
          const { event, data, id: externalEventId } = body;
          
          // ID único do evento para idempotência (Applyfy costuma mandar 'id' ou 'event_id')
          const eventUniqueId = externalEventId || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // 4. Idempotência: Verificar se o evento já foi processado
          const { data: existingEvent } = await supabaseAdmin
            .from('webhook_events')
            .select('id, status')
            .eq('external_id', eventUniqueId)
            .single();

          if (existingEvent) {
            return new Response(JSON.stringify({ ok: true, note: 'Already processed' }), { status: 200 });
          }

          // 5. Registrar evento no banco (Status: pending)
          await supabaseAdmin.from('webhook_events').insert({
            external_id: eventUniqueId,
            event_type: event,
            payload: body,
            status: 'pending'
          });

          // Resposta rápida para o gateway
          const response = new Response(JSON.stringify({ received: true }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });

          // 6. Processamento em Background (Server Functions no TanStack Start permitem isso se o runtime suportar)
          // Em Cloudflare Workers, usamos context.waitUntil ou apenas processamos antes de retornar se for rápido.
          // Aqui, processaremos antes de retornar para garantir a transação, mas o ideal em escala é queue.
          
          const isApproved = ['order_approved', 'transaction_paid', 'payment_approved', 'Transação paga'].includes(event);
          const isRevoked = ['order_refunded', 'chargeback', 'subscription_canceled'].includes(event);

          if ((isApproved || isRevoked) && data?.customer?.email) {
            const email = data.customer.email;
            
            // BUSCA OU CRIA USUÁRIO
            const { data: userRecord, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email: email,
              password: Math.random().toString(36).slice(-12), // Senha aleatória forte
              email_confirm: true,
              user_metadata: { created_via_webhook: true }
            });

            // Se o usuário já existe, buscamos o ID
            let userId = userRecord?.user?.id;
            if (authError?.message.includes('already registered')) {
              const { data: existingUser } = await supabaseAdmin.from('profiles').select('id').eq('email', email).single();
              userId = existingUser?.id;
            }

            if (userId) {
              const tier = isApproved ? 'vitalicio' : 'free';
              
              // Atualiza o Tier no perfil do usuário
              await supabaseAdmin.from('profiles').update({
                tier: tier,
                updated_at: new Date().toISOString()
              }).eq('id', userId);

              // Atualiza status do evento
              await supabaseAdmin.from('webhook_events').update({
                status: 'processed',
                result: `User ${email} updated to ${tier}`,
                processed_at: new Date().toISOString()
              }).eq('external_id', eventUniqueId);
            }
          }

          return response;

        } catch (error: any) {
          console.error('[Webhook] Critical Error:', error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
      },
    },
  },
});
