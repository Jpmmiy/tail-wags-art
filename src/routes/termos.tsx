import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/marketing/site-header";
import { Rodape } from "@/components/marketing/rodape";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/termos")({
  head: () => ({
    title: "Termos de Uso | Nexofly",
    meta: [
      { name: "description", content: "Termos de uso e condições de serviço da plataforma Nexofly." },
      { property: "og:title", content: "Termos de Uso | Nexofly" },
      { property: "og:description", content: "Termos de uso e condições de serviço da plataforma Nexofly." },
      { property: "og:url", content: "https://www.nexoflyia.com/termos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <div className="bg-ink min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <h1 className="font-display text-4xl font-bold tracking-tight text-bone sm:text-5xl mb-12">
              Termos de Uso
            </h1>
            
            <div className="prose prose-invert prose-stone max-w-none space-y-8 text-stone leading-relaxed">
              <section>
                <h2 className="text-bone text-xl font-semibold">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e utilizar a Nexofly, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                  [PREENCHER: Razão Social], CNPJ [PREENCHER: CNPJ], sediada em [PREENCHER: Endereço], doravante denominada "Nexofly".
                </p>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">2. Descrição do Serviço</h2>
                <p>
                  A Nexofly é um SaaS (Software as a Service) focado em marketing para imóveis de temporada, fornecendo ferramentas para criação de roteiros, 
                  estratégias de abordagem e materiais de apoio para anfitriões e imobiliárias.
                </p>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">3. Assinatura e Reembolso</h2>
                <p>
                  O acesso à plataforma é realizado mediante assinatura mensal ou vitalícia conforme os planos vigentes. 
                  A política de reembolso garante a devolução integral do valor em até [PREENCHER: Prazo de Reembolso, ex: 7 dias] após a compra, 
                  conforme o Art. 49 do Código de Defesa do Consumidor.
                </p>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">4. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo gerado pela inteligência artificial da plataforma é de responsabilidade e propriedade de uso do assinante, 
                  desde que respeitadas as diretrizes de uso ético. O código-fonte e a marca Nexofly são de propriedade exclusiva da [PREENCHER: Razão Social].
                </p>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">5. Limitação de Responsabilidade</h2>
                <p>
                  A Nexofly não garante resultados financeiros ou de ocupação dos imóveis, sendo uma ferramenta de suporte. 
                  Não nos responsabilizamos por perdas de dados ou interrupções temporárias de serviços de terceiros (IA/Google).
                </p>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">6. Foro</h2>
                <p>
                  Fica eleito o foro da comarca de [PREENCHER: Cidade/Estado] para dirimir quaisquer controvérsias oriundas deste contrato.
                </p>
              </div>
            </Reveal>
          </div>
        </main>
      <Rodape />
    </div>
  );
}
