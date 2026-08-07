import { createFileRoute } from "@tanstack/react-router";

import { Presente } from "@/components/painel/presente";


function PresentePage() {
  return <Presente />;
}

export const Route = createFileRoute("/_authenticated/painel/presente")({
  head: () => ({
    meta: [
      { title: "Presente · Nexofly" },
      { name: "description", content: "Presente na plataforma Nexofly." },
      { property: "og:title", content: "Presente · Nexofly" },
      { property: "og:description", content: "Presente na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PresentePage,
});
