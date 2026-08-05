import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/applyfy')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          console.log('Applyfy Webhook Received:', body);

          // O Applyfy envia eventos de compra. Evento esperado: 'order_approved'
          // A imagem de referência mostra eventos como "Transação paga"
          const { event, data } = body;

          // Mapeando para os eventos comuns da Applyfy (baseado no contexto do usuário)
          const isApproved = event === 'order_approved' || event === 'transaction_paid' || event === 'Transação paga';

          if (isApproved && data?.customer?.email) {
            const email = data.customer.email;
            
            // Importação dinâmica para evitar que o client bundle tente carregar o admin client
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

            // 1. Criar o usuário no Auth com a senha padrão 12345678
            // Se o usuário já existir, o Supabase retornará um erro que trataremos
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email: email,
              password: '12345678',
              email_confirm: true // Autoriza a pessoa imediatamente
            });

            if (authError) {
              // Se o erro for que o usuário já existe, podemos ignorar ou atualizar
              if (authError.message.includes('already registered')) {
                console.log(`Usuário ${email} já existe no sistema.`);
              } else {
                console.error(`Erro ao criar usuário no Auth: ${authError.message}`);
              }
            } else {
              console.log(`Usuário criado com sucesso no Auth: ${email}`);
            }

            // 2. Garantir que o perfil exista na tabela profiles (se houver essa tabela)
            // Aqui você pode adicionar lógica para conceder acesso vitalício ou mensal
            // baseado no produto comprado.
            
            console.log(`Acesso concedido via webhook para: ${email}`);
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
