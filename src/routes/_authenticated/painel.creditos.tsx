import { createFileRoute } from '@tanstack/react-router';
import { Creditos } from '@/components/painel/creditos';

export const Route = createFileRoute('/_authenticated/painel/creditos')({
  component: () => (
    <div className="min-h-screen bg-ink lg:pl-[260px]">
      <div className="p-6 sm:p-12">
        <div className="mx-auto max-w-4xl">
          <Creditos />
        </div>
      </div>
    </div>
  ),
});
