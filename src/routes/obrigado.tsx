import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    title: "Obrigado por escolher a Nexofly",
    meta: [
      { name: "description", content: "Seu acesso está sendo liberado. Bem-vindo à Nexofly." },
      { property: "og:title", content: "Obrigado por escolher a Nexofly" },
      { property: "og:description", content: "Seu acesso está sendo liberado. Bem-vindo à Nexofly." },
      { property: "og:image", content: "https://www.nexoflyia.com/og-image.png" },
      { property: "og:url", content: "https://www.nexoflyia.com/obrigado" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Obrigado,
});

function Obrigado() {
  return (
    <div className="bg-ink min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-bold text-bone sm:text-4xl">
          Quase lá!
        </h1>
        <p className="mt-4 text-stone text-[1.05rem] leading-relaxed">
          Seu acesso está sendo processado. Em instantes você receberá um e-mail com as instruções de login. 
          Se já tiver uma conta, o acesso vitalício já foi liberado no seu painel.
        </p>
        <div className="mt-10">
          <a
            href="/painel"
            className="metal-pill inline-flex h-12 items-center justify-center rounded-xl px-8 text-[0.95rem] font-semibold text-[#08090B]"
          >
            Acessar meu painel
          </a>
        </div>
      </div>
    </div>
  );
}
