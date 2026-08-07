import { createFileRoute } from "@tanstack/react-router";

import { Conta } from "@/components/painel/conta";


function ContaPage() {
  return <Conta />;
}

export const Route = createFileRoute("/painel/conta")({
  head: () => ({
    meta: [
      { title: "Configurações · Nexofly" },
      { name: "description", content: "Configurações na plataforma Nexofly." },
      { property: "og:title", content: "Configurações · Nexofly" },
      { property: "og:description", content: "Configurações na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContaPage,
});
