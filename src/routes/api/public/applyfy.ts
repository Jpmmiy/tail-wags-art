import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/api/public/applyfy')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          console.log('Applyfy Webhook Received:', body);

          // O Applyfy envia eventos de compra. Vamos focar em 'order_approved' ou similar.
          // Estrutura típica do Applyfy: { event: 'order_approved', data: { customer: { email: '...' }, product: { id: '...' } } }
          const { event, data } = body;

          if (event === 'order_approved' && data?.customer?.email) {
            const email = data.customer.email;
            
            // Aqui poderíamos liberar recursos, enviar e-mail de boas-vindas, etc.
            // No momento, vamos apenas registrar o recebimento para depuração.
            console.log(`Pagamento aprovado para: ${email}`);
          }

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Applyfy Webhook Error:', error);
          return new Response(JSON.stringify({ error: 'Invalid payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
