import { createFileRoute } from "@tanstack/react-router";

import { Dashboard } from "@/components/painel/dashboard";


function Painel() {
  return <Dashboard />;
}

export const Route = createFileRoute("/_authenticated/painel/")({
  head: () => ({
    meta: [
      { title: "Painel · Nexofly" },
      { name: "description", content: "Painel na plataforma Nexofly." },
      { property: "og:title", content: "Painel · Nexofly" },
      { property: "og:description", content: "Painel na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Painel,
});
