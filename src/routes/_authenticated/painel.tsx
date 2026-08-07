import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Sidebar } from "@/components/painel/sidebar";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel · Nexofly" },
      {
        name: "description",
        content:
          "Painel da Nexofly: crie entregas, acompanhe projetos e use o mentor de vendas.",
      },
      { property: "og:title", content: "Painel · Nexofly" },
      {
        property: "og:description",
        content: "Crie entregas, acompanhe projetos e use o mentor de vendas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PainelLayout,
});

function PainelLayout() {
  return (
    <div className="min-h-dvh bg-ink">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <main className="mx-auto max-w-[74rem] px-5 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
