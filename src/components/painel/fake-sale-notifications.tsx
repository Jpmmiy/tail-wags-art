import { useEffect } from 'react';
import { useProtocoloStore } from '@/lib/protocolo';
import { toast } from 'sonner';

export const FakeSaleNotifications = () => {
  const { enabled, sales, triggers } = useProtocoloStore();

  useEffect(() => {
    if (!enabled || sales.length === 0 || !triggers.onLoad) return;

    const timeouts: NodeJS.Timeout[] = [];

    sales.forEach((sale) => {
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
