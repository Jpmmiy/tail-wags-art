import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Projeto limpo — pronto para conectar ao GitHub" },
      {
        name: "description",
        content:
          "Projeto sem conteúdo do site anterior, pronto para sincronizar com um repositório do GitHub.",
      },
      { property: "og:title", content: "Projeto limpo — pronto para o GitHub" },
      {
        property: "og:description",
        content: "Base limpa, aguardando sincronização com o repositório.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Projeto limpo
        </h1>
        <p className="text-muted-foreground">
          Todo o conteúdo do site anterior foi removido. A base está pronta para
          ser sincronizada com um repositório do GitHub.
        </p>
      </div>
    </main>
  );
}
