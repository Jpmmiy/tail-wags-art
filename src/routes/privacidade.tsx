import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/marketing/site-header";
import { Rodape } from "@/components/marketing/rodape";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    title: "Política de Privacidade | Nexofly",
    meta: [
      { name: "description", content: "Como a Nexofly trata e protege os seus dados em conformidade com a LGPD." },
      { property: "og:title", content: "Política de Privacidade | Nexofly" },
      { property: "og:description", content: "Como a Nexofly trata e protege os seus dados em conformidade com a LGPD." },
      { property: "og:url", content: "https://www.nexoflyia.com/privacidade" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <div className="bg-ink min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <h1 className="font-display text-4xl font-bold tracking-tight text-bone sm:text-5xl mb-12">
              Política de Privacidade
            </h1>
            
            <div className="prose prose-invert prose-stone max-w-none space-y-8 text-stone leading-relaxed">
              <p>
                A Nexofly está comprometida com a segurança de seus dados. Esta política explica como coletamos e tratamos suas informações seguindo a LGPD (Lei Geral de Proteção de Dados).
              </p>

              <section>
                <h2 className="text-bone text-xl font-semibold">1. Dados Coletados</h2>
                <p>
                  Coletamos e-mail (para login), nome (opcional), dados de transação da Applyfy, e informações dos imóveis que você cadastra no quiz para processamento pela IA.
                </p>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">2. Finalidade</h2>
                <p>
                  Os dados são utilizados exclusivamente para autenticação, prestação do serviço contratado, geração de relatórios personalizados e suporte técnico.
                </p>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">3. Compartilhamento</h2>
                <p>
                  Compartilhamos dados necessários com:
                </p>
                <ul className="list-disc pl-5">
                  <li><strong>Supabase:</strong> Banco de dados e infraestrutura.</li>
                  <li><strong>Applyfy:</strong> Processamento de pagamentos.</li>
                  <li><strong>Provedores de IA:</strong> Para processamento dos briefings.</li>
                  <li><strong>Google Maps/Places:</strong> Para localização de imóveis.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">4. Direitos do Titular</h2>
                <p>
                  Você pode solicitar a qualquer momento o acesso, correção ou exclusão definitiva de sua conta através do painel de configurações ou pelo e-mail [PREENCHER: E-mail de Contato].
                </p>
              </section>

              <section>
                <h2 className="text-bone text-xl font-semibold">5. Retenção de Dados</h2>
                <p>
                  Mantemos seus dados enquanto sua conta estiver ativa ou conforme exigido por obrigações legais e contábeis.
                </p>
              </section>
            </div>
          </Reveal>
        </div>
      </main>
      <Rodape />
    </div>
  );
}
