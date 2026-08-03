import { createFileRoute } from "@tanstack/react-router";

import { Quiz } from "@/components/painel/quiz";


function Criar() {
  return <Quiz />;
}

export const Route = createFileRoute("/painel/criar")({
  head: () => ({
    meta: [
      { title: "Nova entrega · Nexofly" },
      { name: "description", content: "Nova entrega na plataforma Nexofly." },
      { property: "og:title", content: "Nova entrega · Nexofly" },
      { property: "og:description", content: "Nova entrega na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Criar,
});
