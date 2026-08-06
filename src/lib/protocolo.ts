import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FakeSale {
  id: string;
  produto: string;
  valor: string;
  nome_cliente: string;
  atraso: number; // segundos
}

interface ProtocoloState {
  enabled: boolean;
  sales: FakeSale[];
  triggers: {
    onLoad: boolean;
    onScroll: boolean;
    onExit: boolean;
  };
  overrides: {
    totalVendas?: string;
    projetosConcluidos?: string;
  };
  setEnabled: (enabled: boolean) => void;
  addSale: (sale: Omit<FakeSale, 'id'>) => void;
  removeSale: (id: string) => void;
  updateTriggers: (triggers: Partial<ProtocoloState['triggers']>) => void;
  setOverride: (key: keyof ProtocoloState['overrides'], value: string) => void;
}

export const useProtocoloStore = create<ProtocoloState>()(
  persist(
    (set) => ({
      enabled: false,
      sales: [],
      triggers: {
        onLoad: true,
        onScroll: false,
        onExit: false,
      },
      overrides: {},
      setEnabled: (enabled: boolean) => set({ enabled }),
      addSale: (sale: Omit<FakeSale, 'id'>) => set((state: ProtocoloState) => ({ 
        sales: [...state.sales, { ...sale, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeSale: (id: string) => set((state: ProtocoloState) => ({ 
        sales: state.sales.filter((s: FakeSale) => s.id !== id) 
      })),
      updateTriggers: (triggers: Partial<ProtocoloState['triggers']>) => set((state: ProtocoloState) => ({ 
        triggers: { ...state.triggers, ...triggers } 
      })),
      setOverride: (key: keyof ProtocoloState['overrides'], value: string) => set((state: ProtocoloState) => ({ 
        overrides: { ...state.overrides, [key]: value } 
      })),
    }),
    {
      name: 'nexofly-protocolo-settings',
    }
  )
);
