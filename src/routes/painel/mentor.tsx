import { createFileRoute } from "@tanstack/react-router";

import { Mentor } from "@/components/painel/mentor";


function MentorPage() {
  return <Mentor />;
}

export const Route = createFileRoute("/painel/mentor")({
  head: () => ({
    meta: [
      { title: "Mentor Nexofly · Nexofly" },
      { name: "description", content: "Mentor Nexofly na plataforma Nexofly." },
      { property: "og:title", content: "Mentor Nexofly · Nexofly" },
      { property: "og:description", content: "Mentor Nexofly na plataforma Nexofly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MentorPage,
});
