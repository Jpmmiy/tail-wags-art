import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Phone, 
  Upload, 
  Save, 
  Loader2, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_authenticated/perfil')({
  component: PerfilPage,
});

function PerfilPage() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    phone: '',
    avatar_url: '',
    pricing_table: {
      fotos: 480,
      video: 390,
      site: 690,
      recorrencia: 250
    }
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        business_name: (profile as any).business_name || '',
        phone: (profile as any).phone || '',
        avatar_url: profile.avatar_url || '',
        pricing_table: (profile as any).pricing_table || {
          fotos: 480,
          video: 390,
          site: 690,
          recorrencia: 250
        }
      });
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async (newData: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: newData.full_name,
          business_name: newData.business_name,
          phone: newData.phone,
          avatar_url: newData.avatar_url,
          pricing_table: newData.pricing_table as any,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao atualizar perfil.');
    }
  });

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/logo-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('public-assets-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public-assets-logos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Logo enviada!');
    } catch (error) {
      console.error(error);
      toast.error('Erro no upload da logo.');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <Loader2 className="size-8 animate-spin text-chrome" />
    </div>
  );

  return (
    <div className="min-h-screen bg-ink p-6 sm:p-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <header>
          <h1 className="font-display text-3xl font-semibold text-bone">Meu Perfil</h1>
          <p className="mt-1 text-stone">Configure sua identidade e tabela de preços</p>
        </header>

        <div className="glass space-y-8 rounded-3xl p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="group relative">
              <div className="size-24 overflow-hidden rounded-2xl bg-white/5 rim-lit grid place-items-center">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Logo" className="size-full object-contain p-2" />
                ) : (
                  <Building2 className="size-8 text-stone" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 flex size-8 cursor-pointer items-center justify-center rounded-xl bg-chrome text-black transition-transform hover:scale-110 shadow-lg">
                <Upload className="size-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleUploadLogo} disabled={uploading} />
              </label>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
                  <Loader2 className="size-5 animate-spin text-chrome" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium text-bone">{formData.business_name || 'Seu Negócio'}</h3>
              <p className="text-sm text-stone">{profile?.email}</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone flex items-center gap-2">
                <User className="size-3" /> Nome Completo
              </label>
              <input 
                type="text" 
                value={formData.full_name}
                onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                placeholder="Seu nome"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-bone focus:border-chrome outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone flex items-center gap-2">
                <Building2 className="size-3" /> Nome do Negócio
              </label>
              <input 
                type="text" 
                value={formData.business_name}
                onChange={e => setFormData(p => ({ ...p, business_name: e.target.value }))}
                placeholder="Ex: Fly Marketing"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-bone focus:border-chrome outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone flex items-center gap-2">
                <Phone className="size-3" /> Contato (WhatsApp)
              </label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                placeholder="+55 ..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-bone focus:border-chrome outline-none transition-colors"
              />
            </div>
          </div>

          <hr className="border-white/5" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-bone flex items-center gap-2">
                <DollarSign className="size-4 text-chrome" /> Tabela de Preços (Sugestão)
              </h4>
              <div className="text-[10px] text-stone flex items-center gap-1">
                <AlertCircle className="size-3" /> Usado nos cálculos automáticos
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(formData.pricing_table).map(([key, val]) => (
                <div key={key} className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-stone">
                    {key === 'recorrencia' ? 'Suporte Mensal' : key}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone text-sm">R$</span>
                    <input 
                      type="number" 
                      value={val}
                      onChange={e => setFormData(p => ({ 
                        ...p, 
                        pricing_table: { ...p.pricing_table, [key]: Number(e.target.value) } 
                      }))}
                      className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-bone focus:border-chrome outline-none transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => updateProfile.mutate(formData)}
            disabled={updateProfile.isPending}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-chrome px-6 py-4 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {updateProfile.isPending ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
