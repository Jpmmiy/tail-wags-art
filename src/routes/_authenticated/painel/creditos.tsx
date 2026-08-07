import { createFileRoute } from "@tanstack/react-router";

import { Creditos } from "@/components/painel/creditos";


function CreditosPage() {
  return <Creditos />;
}

export const Route = createFileRoute("/_authenticated/painel/creditos")({
  head: () => ({
    meta: [
      { title: "Créditos infinitos · Nexofly" },
      { name: "description", content: "Créditos infinitos na plataforma Nexofly." },
      { property: "og:title", content: "Créditos infinitos · Nexofly" },
      { property: "og:description", content: "Créditos infinitos na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CreditosPage,
});
