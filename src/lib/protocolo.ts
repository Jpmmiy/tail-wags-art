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
      setEnabled: (enabled) => set({ enabled }),
      addSale: (sale) => set((state) => ({ 
        sales: [...state.sales, { ...sale, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeSale: (id) => set((state) => ({ 
        sales: state.sales.filter((s) => s.id !== id) 
      })),
      updateTriggers: (triggers) => set((state) => ({ 
        triggers: { ...state.triggers, ...triggers } 
      })),
      setOverride: (key, value) => set((state) => ({ 
        overrides: { ...state.overrides, [key]: value } 
      })),
    }),
    {
      name: 'nexofly-protocolo-settings',
    }
  )
);
