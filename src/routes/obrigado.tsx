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
    <div className="bg-ink min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-chrome/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-chrome/10 border border-chrome/20 flex items-center justify-center animate-pulse">
            <svg 
              viewBox="0 0 24 24" 
              className="w-10 h-10 text-chrome" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <h1 className="font-display text-4xl font-bold text-bone sm:text-6xl tracking-tight mb-6">
          Seja bem-vindo à <span className="text-chrome">Nexofly</span>
        </h1>
        
        <p className="text-stone text-lg sm:text-xl leading-relaxed mb-10 max-w-lg mx-auto">
          Sua transação foi aprovada e seu acesso vitalício já está disponível. O "Cérebro Operacional" do seu marketing imobiliário está pronto.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
          <a
            href="/painel"
            className="metal-pill flex h-14 items-center justify-center rounded-2xl px-8 text-base font-bold text-[#08090B] shadow-lg shadow-chrome/10 transition-transform active:scale-95"
          >
            Acessar Painel Agora
          </a>
          <a
            href="https://labs.google/fx/pt/tools/flow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-semibold text-bone hover:bg-white/10 transition-all"
          >
            Abrir Google Flow
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-stone/60 text-sm italic">
            "Onde a tecnologia encontra a prospecção de alto nível."
          </p>
        </div>
      </div>
    </div>
  );
}
