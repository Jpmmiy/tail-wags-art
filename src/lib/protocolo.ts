import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

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
  loading: boolean;
  
  // Actions
  fetchSettings: () => Promise<void>;
  setEnabled: (enabled: boolean) => Promise<void>;
  addSale: (sale: Omit<FakeSale, 'id'>) => Promise<void>;
  removeSale: (id: string) => Promise<void>;
  updateTriggers: (triggers: Partial<ProtocoloState['triggers']>) => Promise<void>;
  setOverride: (key: keyof ProtocoloState['overrides'], value: string) => Promise<void>;
}

const SETTINGS_KEY = 'protocolo_config';

// Cast para evitar erros de tipo já que a tabela foi criada via migração SQL
const getTable = () => (supabase as any).from('app_settings');

export const useProtocoloStore = create<ProtocoloState>((set, get) => ({
  enabled: false,
  sales: [],
  triggers: {
    onLoad: true,
    onScroll: false,
    onExit: false,
  },
  overrides: {},
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data, error } = await getTable()
        .select('value')
        .eq('key', SETTINGS_KEY)
        .single();

      if (data?.value) {
        const val = data.value as any;
        set({
          enabled: val.enabled ?? false,
          sales: val.sales ?? [],
          triggers: val.triggers ?? { onLoad: true, onScroll: false, onExit: false },
          overrides: val.overrides ?? {},
        });
      }
    } catch (err) {
      console.error('Error fetching protocolo settings:', err);
    } finally {
      set({ loading: false });
    }
  },

  setEnabled: async (enabled: boolean) => {
    const current = get();
    const newValue = { ...current, enabled };
    set({ enabled });
    await getTable().upsert({ key: SETTINGS_KEY, value: newValue });
  },

  addSale: async (sale: Omit<FakeSale, 'id'>) => {
    const current = get();
    const newSale = { ...sale, id: Math.random().toString(36).substr(2, 9) };
    const newSales = [...current.sales, newSale];
    set({ sales: newSales });
    await getTable().upsert({ 
      key: SETTINGS_KEY, 
      value: { ...current, sales: newSales } 
    });
  },

  removeSale: async (id: string) => {
    const current = get();
    const newSales = current.sales.filter((s: FakeSale) => s.id !== id);
    set({ sales: newSales });
    await getTable().upsert({ 
      key: SETTINGS_KEY, 
      value: { ...current, sales: newSales } 
    });
  },

  updateTriggers: async (triggers: Partial<ProtocoloState['triggers']>) => {
    const current = get();
    const newTriggers = { ...current.triggers, ...triggers };
    set({ triggers: newTriggers });
    await getTable().upsert({ 
      key: SETTINGS_KEY, 
      value: { ...current, triggers: newTriggers } 
    });
  },

  setOverride: async (key: keyof ProtocoloState['overrides'], value: string) => {
    const current = get();
    const newOverrides = { ...current.overrides, [key]: value };
    set({ overrides: newOverrides });
    await getTable().upsert({ 
      key: SETTINGS_KEY, 
      value: { ...current, overrides: newOverrides } 
    });
  },
}));
