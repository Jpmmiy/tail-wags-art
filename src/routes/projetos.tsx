import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { listProjects, setCurrentProjectId } from '@/lib/persistence';
import { 
  Calendar, 
  ChevronRight, 
  Flame, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/projetos')({
  component: ProjetosPage,
});

function ProjetosPage() {
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
              const score = property?.opportunity_score;
              const gerados = p.deliverables?.filter((d: any) => d.gerado).length || 0;

              return (
                <div key={p.id} className="glass group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all hover:rim-lit">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="line-clamp-1 font-medium text-bone">{property?.nome || 'Sem nome'}</h3>
                      {score && (
                        <div className="flex items-center gap-1 font-bold text-orange-400">
                           <Flame className="size-3 fill-orange-400" />
                           <span className="text-sm">{score}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-stone">
                        <Calendar className="size-3" />
                        {new Date(p.updated_at).toLocaleDateString('pt-BR')}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-stone">
                          <span>Progresso</span>
                          <span className="text-bone">{gerados} de 4 clipes</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div 
                            className="h-full bg-chrome transition-all duration-1000" 
                            style={{ width: `${(gerados / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/"
                    onClick={() => setCurrentProjectId(p.id)}
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm font-medium text-bone transition-colors group-hover:bg-chrome group-hover:text-black"
                  >
                    Continuar <ArrowRight className="size-4" />
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
