import { createFileRoute } from '@tanstack/react-router';
import { Conta } from '@/components/painel/conta';

export const Route = createFileRoute('/_authenticated/painel/conta')({
  component: () => (
    <div className="min-h-screen bg-ink lg:pl-[260px]">
      <div className="p-6 sm:p-12">
        <div className="mx-auto max-w-4xl">
          <Conta />
        </div>
      </div>
    </div>
  ),
});
