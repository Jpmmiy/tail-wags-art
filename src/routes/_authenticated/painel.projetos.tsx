import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { listProjects, setCurrentProjectId } from '@/lib/persistence';
import { useProtocoloStore } from '@/lib/protocolo';
import { 
  Calendar, 
  ChevronRight, 
  Flame, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_authenticated/painel/projetos')({
  component: ProjetosPage,
});

function ProjetosPage() {
  const { overrides } = useProtocoloStore();
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: listProjects,
  });

  return (
    <div className="min-h-screen bg-ink p-6 sm:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-bone">Meus Projetos</h1>
            <p className="mt-1 text-stone">Acompanhe e continue suas oportunidades</p>
          </div>
          <Link to="/" className="metal-pill flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-black">
            <Plus className="size-4" /> Novo Projeto
          </Link>
        </header>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass h-48 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : projects?.length === 0 ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl p-20 text-center">
            <p className="text-stone">Você ainda não tem projetos salvos.</p>
            <Link to="/" className="mt-4 text-chrome hover:underline">Comece agora</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects?.map((p: any) => {
              const property = p.properties?.[0];
              const briefing = p.briefings?.[0];
              const score = property?.opportunity_score;
              const gerados = p.deliverables?.filter((d: any) => d.gerado).length || 0;
              const totalEsperado = p.entregaveis?.length || 2;
              
              const statusLabel = p.status === 'concluido' ? 'Concluído' : p.status === 'em_producao' ? 'Em Produção' : 'Rascunho';
              const statusColor = p.status === 'concluido' ? 'text-green-400 bg-green-400/10' : p.status === 'em_producao' ? 'text-blue-400 bg-blue-400/10' : 'text-stone bg-white/5';

              return (
                <div key={p.id} className="glass group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all hover:rim-lit">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="line-clamp-1 font-medium text-bone">{p.name || property?.nome || 'Sem nome'}</h3>
                        <div className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", statusColor)}>
                          {statusLabel}
                        </div>
                      </div>
                      {score && (
                        <div className="flex flex-col items-end gap-1">
                           <div className="flex items-center gap-1 font-bold text-orange-400">
                             <Flame className="size-3 fill-orange-400" />
                             <span className="text-sm">{score}</span>
                           </div>
                           <span className="text-[10px] text-stone uppercase">{property.opportunity_band}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-stone">
                          <Calendar className="size-3" />
                          {new Date(p.updated_at).toLocaleDateString('pt-BR')}
                        </div>
                        {briefing && (
                          <div className="text-stone">
                            {briefing.publico} • {briefing.estilo_inferido}
                          </div>
                        )}
                      </div>

                      {p.entregaveis && p.entregaveis.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {p.entregaveis.map((e: string) => (
                            <span key={e} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-stone uppercase font-medium">
                              {e}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-stone">
                          <span>Entregáveis</span>
                          <span className="text-bone">{gerados} de {totalEsperado}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div 
                            className="h-full bg-chrome transition-all duration-1000" 
                            style={{ width: `${Math.min((gerados / totalEsperado) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/painel/projeto/$id"
                    params={{ id: p.id } as any}
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm font-medium text-bone transition-colors group-hover:bg-chrome group-hover:text-black"
                  >
                    Abrir Projeto <ArrowRight className="size-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
