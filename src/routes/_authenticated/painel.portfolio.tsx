import { createFileRoute } from '@tanstack/react-router';
import { GeradorPortfolio } from '@/components/painel/gerador-portfolio';

export const Route = createFileRoute('/_authenticated/painel/portfolio')({
  component: () => (
    <div className="min-h-screen bg-ink lg:pl-[260px]">
      <div className="p-6 sm:p-12">
        <div className="mx-auto max-w-4xl">
          <GeradorPortfolio />
        </div>
      </div>
    </div>
  ),
});
