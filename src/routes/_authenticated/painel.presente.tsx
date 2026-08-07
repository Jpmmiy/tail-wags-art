import { createFileRoute } from '@tanstack/react-router';
import { Presente } from '@/components/painel/presente';

export const Route = createFileRoute('/_authenticated/painel/presente')({
  component: () => (
    <div className="min-h-screen bg-ink lg:pl-[260px]">
      <div className="p-6 sm:p-12">
        <div className="mx-auto max-w-4xl">
          <Presente />
        </div>
      </div>
    </div>
  ),
});
