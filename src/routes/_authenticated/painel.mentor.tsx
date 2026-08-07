import { createFileRoute } from '@tanstack/react-router';
import { Mentor } from '@/components/painel/mentor';

export const Route = createFileRoute('/_authenticated/painel/mentor')({
  component: () => (
    <div className="min-h-screen bg-ink lg:pl-[260px]">
      <div className="p-6 sm:p-12">
        <div className="mx-auto max-w-4xl">
          <Mentor />
        </div>
      </div>
    </div>
  ),
});
