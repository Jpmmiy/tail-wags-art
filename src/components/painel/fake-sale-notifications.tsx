import { useEffect, useState } from 'react';
import { FakeSale } from '@/lib/protocolo';
import { toast } from 'sonner';

export const FakeSaleNotifications = () => {
  const [data, setData] = useState<{ enabled: boolean; sales: FakeSale[]; triggers: any } | null>(null);

  useEffect(() => {
    // PASSO 3 — CONSUMINDO ROTA PÚBLICA
    const fetchPublicProtocolo = async () => {
      try {
        const r = await fetch('/api/public/protocolo');
        if (r.ok) {
          const d = await r.json();
          setData(d);
        }
      } catch (err) {
        console.error('Erro ao buscar notificações:', err);
      }
    };
    fetchPublicProtocolo();
  }, []);

  const enabled = data?.enabled ?? false;
  const sales = data?.sales ?? [];
  const triggers = data?.triggers ?? { onLoad: true };


  useEffect(() => {
    if (!enabled || sales.length === 0 || !triggers.onLoad) return;

    const timeouts: NodeJS.Timeout[] = [];

    sales.forEach((sale: FakeSale) => {
      const timeout = setTimeout(() => {
        toast.success(`Venda Realizada!`, {
          description: `${sale.nome_cliente} acabou de comprar ${sale.produto} por ${sale.valor}`,
          duration: 5000,
        });
      }, sale.atraso * 1000);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [enabled, sales, triggers.onLoad]);

  return null;
};
