import { createFileRoute } from '@tanstack/react-router';
import { getLatestProjectId, setCurrentProjectId } from '@/lib/persistence';
import { Dashboard } from '@/components/painel/dashboard';

export const Route = createFileRoute('/_authenticated/painel/')({
  beforeLoad: async () => {
    const latestId = await getLatestProjectId();
    if (latestId) {
      setCurrentProjectId(latestId);
    }
  },
  component: DashboardPage,
});

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
