import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isMentorEnabled } from "@/lib/mentor-config";

const MODELO = "google/gemini-3-flash";

const SISTEMA = `Você é o Mentor Nexofly: o consultor de vendas de quem usa a plataforma.

QUEM VOCÊ ATENDE
Um prestador de serviço brasileiro que vende pacotes de fotos tratadas, vídeo
curto, site próprio e proposta para dois públicos: anfitriões de Airbnb e
temporada, e corretores e imobiliárias. Ele mesmo prospecta, negocia e entrega.
Normalmente trabalha sozinho e cobra entre R$ 400 e R$ 2.500 por pacote.

O QUE VOCÊ FAZ
Responde dúvida de venda: precificação, objeção, abordagem fria, follow-up,
fechamento, escopo, prazo, o que entregar antes de receber. Quando fizer
sentido, escreva a mensagem pronta para ele copiar e mandar no WhatsApp.

COMO RESPONDER
Direto ao ponto. Comece pela resposta, não pelo contexto. Duas a seis frases
resolvem a maioria das perguntas; só alongue quando a pergunta pedir passo a
passo ou um roteiro de mensagem.

Fale português do Brasil, no tom de um colega experiente. Sem jargão de
coach, sem "é fundamental que", sem entusiasmo forçado, sem emoji. Nada de
listas com sete itens quando três bastam.

Dê números concretos sempre que puder, e diga de onde vieram. Ancorar preço na
diária do imóvel funciona: um pacote costuma valer de duas a três diárias.
Se ele não deu o dado que você precisa para calcular, peça esse dado em uma
frase em vez de responder no vazio.

Quando escrever uma mensagem pronta, marque com aspas ou em bloco separado, e
escreva do jeito que se manda de verdade — curta, sem saudação formal, sem
"venho por meio desta".

O QUE NÃO FAZER
Não prometa resultado ("você vai fechar", "garantido"). Não invente número de
mercado que você não tem. Não recomende baixar preço como primeira resposta a
uma objeção — troque escopo antes de trocar valor. Não fale sobre assuntos
fora de venda, produção e operação desse negócio; se perguntarem, diga em uma
frase que não é o seu assunto e volte ao que você resolve.`;

type Turno = { de: "voce" | "mentor"; texto: string };

function json(dados: unknown, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/mentor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const chave = process.env["LOVABLE_API_KEY"];
        if (!chave) {
          return json(
            { erro: "O Mentor não está configurado neste ambiente." },
            503,
          );
        }

        let historico: Turno[];
        try {
          const corpo = (await request.json()) as { historico?: Turno[] };
          historico = Array.isArray(corpo?.historico) ? corpo.historico : [];
        } catch {
          return json({ erro: "Corpo inválido." }, 400);
        }

        const mensagens = historico
          .filter((t) => t.texto.trim())
          .map((t) => ({
            role: t.de === "voce" ? ("user" as const) : ("assistant" as const),
            content: t.texto,
          }));

        if (!mensagens.length || mensagens[0].role !== "user") {
          return json(
            { erro: "A conversa precisa começar com uma pergunta." },
            400,
          );
        }

        const resposta = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${chave}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: MODELO,
              stream: true,
              messages: [{ role: "system", content: SISTEMA }, ...mensagens],
            }),
          },
        );

        // Persistência em segundo plano (não bloqueia a resposta)
        const ultimaMensagem = mensagens[mensagens.length - 1];
        if (ultimaMensagem) {
          void (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
              await supabase.from("mentor_messages").insert({
                user_id: session.user.id,
                role: ultimaMensagem.role,
                content: ultimaMensagem.content
              });
            }
          })();
        }

        if (!resposta.ok || !resposta.body) {
          const detalhe = await resposta.text();
          console.error(`Falha no Mentor [${resposta.status}]: ${detalhe}`);
          if (resposta.status === 429) {
            return json({ erro: "Muitos pedidos agora. Tente em instantes." }, 429);
          }
          if (resposta.status === 402) {
            return json(
              { erro: "Os créditos de IA do espaço acabaram." },
              402,
            );
          }
          return json({ erro: "A resposta falhou.", detalhe }, 502);
        }

        const leitor = resposta.body.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let resto = "";

        const corpo = new ReadableStream<Uint8Array>({
          async pull(controlador) {
            const { done, value } = await leitor.read();
            if (done) {
              await salvarRespostaMentor(acumuladoParaSalvar);
              controlador.close();
              return;
            }
            resto += decoder.decode(value, { stream: true });
            const linhas = resto.split("\n");
            resto = linhas.pop() ?? "";
            for (const linha of linhas) {
              if (!linha.startsWith("data: ")) continue;
              const dado = linha.slice(6).trim();
              if (!dado || dado === "[DONE]") continue;
              try {
                const evento = JSON.parse(dado);
                const texto = evento?.choices?.[0]?.delta?.content;
                if (texto) {
                  acumuladoParaSalvar += texto;
                  controlador.enqueue(encoder.encode(texto));
                }
              } catch {
                /* fragmento incompleto */
              }
            }
          },
          async cancel() {
            await salvarRespostaMentor(acumuladoParaSalvar);
            void leitor.cancel();
          },
        });

        let acumuladoParaSalvar = "";
        const salvarRespostaMentor = async (texto: string) => {
          if (!texto) return;
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            await supabase.from("mentor_messages").insert({
              user_id: session.user.id,
              role: "assistant",
              content: texto
            });
          }
        };

        return new Response(corpo, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
