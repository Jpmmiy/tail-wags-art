import { createFileRoute } from "@tanstack/react-router";

import { Projetos } from "@/components/painel/projetos";


function ProjetosPage() {
  return <Projetos />;
}

export const Route = createFileRoute("/painel/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos · Nexofly" },
      { name: "description", content: "Projetos na plataforma Nexofly." },
      { property: "og:title", content: "Projetos · Nexofly" },
      { property: "og:description", content: "Projetos na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjetosPage,
});
