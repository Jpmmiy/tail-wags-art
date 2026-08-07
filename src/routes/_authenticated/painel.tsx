import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/painel')({
  component: PainelRoute,
});

function PainelRoute() {
  console.log("[RENDER] 2. Início do componente PainelRoute (/painel.tsx)");
  return <Outlet />;
}
