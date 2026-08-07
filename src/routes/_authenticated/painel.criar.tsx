import { createFileRoute } from '@tanstack/react-router';
import { Quiz } from '@/components/painel/quiz';

export const Route = createFileRoute('/_authenticated/painel/criar')({
  component: CriarProjetoPage,
});

function CriarProjetoPage() {
  return (
    <div className="min-h-screen bg-ink lg:pl-[260px]">
      <div className="p-6 sm:p-12">
        <div className="mx-auto max-w-5xl">
          <Quiz />
        </div>
      </div>
    </div>
  );
}
