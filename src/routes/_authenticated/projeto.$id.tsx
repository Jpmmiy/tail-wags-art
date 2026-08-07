import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadProject, saveDeliverable, getUserProfile } from '@/lib/persistence';
import { generateProposalPDF } from '@/lib/pdf-generator';
import { 

  ArrowLeft, 
  Copy, 
  Check, 
  RefreshCcw, 
  FileText, 
  MessageSquare, 
  Clapperboard, 
  ExternalLink,
  Download,
  Loader2,
  AlertCircle,
  Building2
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { calculatePricing } from '@/config/pricing';

export const Route = createFileRoute('/_authenticated/projeto/$id')({
  component: ProjetoDetalhesPage,
});

function ProjetoDetalhesPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [copiado, setCopiado] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);
  const [conteudoEditado, setConteudoEditado] = useState("");

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => loadProject(id),
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiado(label);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopiado(null), 2000);
  };

  const updateDeliverable = useMutation({
    mutationFn: async ({ deliverableId, content, shotNumber, tipo }: any) => {
      return saveDeliverable(id, {
        shot_number: shotNumber,
        conteudo: content,
        tipo: tipo,
        gerado: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      setEditando(null);
      toast.success('Alteração salva com sucesso!');
    }
  });

  const precos = useMemo(() => {
    if (!project) return null;
    const briefing = project.briefings?.[0];
    const property = project.properties?.[0];
    
    // Se o perfil tem tabela de preços, ela deve ser usada aqui no futuro
    // Por enquanto usamos a lógica global mas ela poderia ser injetada
    return calculatePricing(
      briefing?.diaria || property?.opportunity_score || 250,
      project.modalidade || 'temporada',
      project.entregaveis || []
    );
  }, [project]);

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <Loader2 className="size-8 animate-spin text-chrome" />
    </div>
  );

  if (!project) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink p-6 text-center">
      <AlertCircle className="size-12 text-red-400 mb-4" />
      <h1 className="text-2xl font-bold text-bone">Projeto não encontrado</h1>
      <Link to="/painel/projetos" className="mt-4 text-chrome hover:underline">Voltar para projetos</Link>
    </div>
  );

  const property = project.properties?.[0];
  const deliverables = project.deliverables || [];

  return (
    <div className="min-h-screen bg-ink p-6 sm:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/painel/projetos" className="size-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-stone hover:text-bone transition-colors">
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-semibold text-bone">{project.name || property?.nome}</h1>
              <p className="text-sm text-stone">{new Date(project.updated_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (!project || !precos) {
                  toast.error("Aguarde o carregamento dos dados");
                  return;
                }
                const promise = generateProposalPDF(project, profile, precos);
                toast.promise(promise, {
                  loading: 'Gerando PDF...',
                  success: 'PDF exportado com sucesso!',
                  error: 'Erro ao gerar PDF'
                });
              }}
              className="metal-pill flex items-center gap-2 px-4 py-2 text-sm font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="size-4" /> Exportar PDF
            </button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-bone flex items-center gap-2">
                <Clapperboard className="size-5 text-chrome" /> Materiais Gerados
              </h2>

              
              <div className="grid gap-4">
                {deliverables.length === 0 ? (
                  <div className="glass p-12 text-center rounded-2xl">
                    <p className="text-stone">Nenhum material gerado ainda.</p>
                  </div>
                ) : (

                  deliverables.map((d: any) => (
                    <div key={d.id} className="glass rounded-2xl p-6 space-y-4 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-chrome">
                          {d.tipo} {d.shot_number ? `#${d.shot_number}` : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleCopy(d.conteudo, `${d.tipo} ${d.shot_number || ''}`)}
                            className="p-2 rounded-lg bg-white/5 text-stone hover:text-bone hover:bg-white/10 transition-all"
                          >
                            {copiado === `${d.tipo} ${d.shot_number || ''}` ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                          </button>
                          <button 
                            onClick={() => {
                              setEditando(d.id);
                              setConteudoEditado(d.conteudo);
                            }}
                            className="p-2 rounded-lg bg-white/5 text-stone hover:text-bone hover:bg-white/10 transition-all text-xs font-medium"
                          >
                            Editar
                          </button>
                        </div>
                      </div>

                      {editando === d.id ? (
                        <div className="space-y-3">
                          <textarea 
                            value={conteudoEditado}
                            onChange={(e) => setConteudoEditado(e.target.value)}
                            className="w-full h-32 rounded-xl bg-ink border border-white/10 p-4 text-bone text-sm outline-none focus:border-chrome transition-colors"
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditando(null)} className="px-3 py-1.5 text-xs text-stone hover:text-bone">Cancelar</button>
                            <button 
                              onClick={() => updateDeliverable.mutate({ deliverableId: d.id, content: conteudoEditado, shotNumber: d.shot_number, tipo: d.tipo })}
                              disabled={updateDeliverable.isPending}
                              className="px-4 py-1.5 bg-chrome text-black rounded-lg text-xs font-bold flex items-center gap-2"
                            >
                              {updateDeliverable.isPending && <Loader2 className="size-3 animate-spin" />}
                              Confirmar e Salvar Versão
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-bone/90 leading-relaxed whitespace-pre-wrap">{d.conteudo}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-medium text-bone">Proposta</h3>
              {precos ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-stone">Preço Sugerido (Essencial)</span>
                      <span className="text-bone font-bold">R$ {precos.essencial.valor}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setConteudoEditado(whatsMessage(project, profile))}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-bold hover:bg-green-500/20 transition-all"
                  >
                    <MessageSquare className="size-4" /> Mensagem WhatsApp
                  </button>
                </div>
              ) : (
                <p className="text-xs text-stone">Dados insuficientes para proposta.</p>
              )}
            </section>

            <section className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-medium text-bone">Perfil Utilizado</h3>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-white/5 overflow-hidden grid place-items-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} className="size-full object-contain p-1" />
                  ) : (
                    <Building2 className="size-5 text-stone" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-bone">{(profile as any)?.business_name || 'Nexofly Global'}</p>
                  <Link to="/perfil" className="text-[10px] text-chrome hover:underline">Editar perfil</Link>
                </div>
              </div>
              {!(profile as any)?.business_name && (
                <div className="p-3 rounded-lg bg-orange-400/10 border border-orange-400/20 flex gap-2">
                  <AlertCircle className="size-4 text-orange-400 shrink-0" />
                  <p className="text-[10px] text-orange-200">Personalize seu perfil para propostas profissionais.</p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function whatsMessage(project: any, profile: any) {
  const property = project?.properties?.[0];
  const businessName = profile?.business_name || "Nexofly";
  const nome = property?.nome || "seu imóvel";
  
  return `Oi! Aqui é do ${businessName}. Vi o anúncio do ${nome} e reparei no grande potencial que ele tem.\nMontei uma estratégia de valorização visual para aumentar a conversão de interessados.\nPosso te mandar os detalhes?`;
}
