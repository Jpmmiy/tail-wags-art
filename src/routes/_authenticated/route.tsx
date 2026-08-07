import { createFileRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { getLatestProjectId, setCurrentProjectId } from '@/lib/persistence';

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: async () => {
    // Tenta carregar o último projeto modificado
    const latestId = await getLatestProjectId();
    if (latestId) {
      setCurrentProjectId(latestId);
    }
  },
  component: DashboardPage,
});

import { Dashboard } from '@/components/painel/dashboard';

function DashboardPage() {
  return (
    <div className="min-h-screen bg-ink lg:pl-[260px]">
      <div className="p-6 sm:p-12">
        <div className="mx-auto max-w-7xl">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
