import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { isMentorEnabled } from "@/lib/mentor-config";
import { checkAiLimits, trackAiUsageStart, trackAiUsageEnd, getCachedAiResponse } from "@/lib/ai-control.server";


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
        // PASSO 3 — ROTA AUTENTICADA (Usando supabaseAdmin para bypass de RLS se necessário, mas validando sessão)
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          return json({ erro: "Você precisa estar logado para usar o Mentor." }, 401);
        }

        if (!isMentorEnabled()) {
          return json(
            { erro: "O Mentor está em manutenção ou foi desativado temporariamente." },
            403,
          );
        }

        const requestId = request.headers.get("x-request-id");
        if (!requestId) return json({ erro: "Request ID ausente." }, 400);

        // PASSO 4 — IDEMPOTÊNCIA
        const cache = await getCachedAiResponse(requestId);
        if (cache) {
          if (cache.status === 'completed' && cache.response_cache) {
            return new Response(cache.response_cache, {
              headers: { "Content-Type": "text/plain; charset=utf-8" }
            });
          }
          if (cache.status === 'processing') {
            return json({ erro: "Geração em andamento. Aguarde." }, 202);
          }
        }

        // PASSO 2 — LIMITES
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const limitCheck = await checkAiLimits(session.user.id, ip);
        if (!limitCheck.allowed) {
          return json({ erro: limitCheck.reason }, 429);
        }

        // PASSO 1 & 4 — GRAVAR INÍCIO
        await trackAiUsageStart(session.user.id, requestId, "/api/mentor", ip);

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

        const MAX_RETRIES = 2;
        let attempt = 0;
        let resposta: Response | null = null;

        while (attempt <= MAX_RETRIES) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            resposta = await fetch(
              "https://ai.gateway.lovable.dev/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${chave}`,
                  "Content-Type": "application/json",
                },
                signal: controller.signal,
                body: JSON.stringify({
                  model: MODELO,
                  stream: true,
                  messages: [{ role: "system", content: SISTEMA }, ...mensagens],
                }),
              },
            );

            clearTimeout(timeoutId);

            if (resposta.ok) break;

            const retryableStatus = [429, 500, 502, 503, 504].includes(resposta.status);
            if (!retryableStatus || attempt === MAX_RETRIES) break;

            attempt++;
            const backoff = Math.pow(2, attempt) * 1000;
            console.log(`[Mentor] Erro ${resposta.status}. Tentativa ${attempt} em ${backoff}ms...`);
            await new Promise(r => setTimeout(r, backoff));
          } catch (e) {
            const isTimeout = e instanceof Error && e.name === 'AbortError';
            if (isTimeout) console.error(`[Mentor] Timeout na tentativa ${attempt + 1}`);
            
            if (attempt === MAX_RETRIES) throw e;
            attempt++;
            await new Promise(r => setTimeout(r, 1000));
          }
        }

        if (!resposta || !resposta.ok || !resposta.body) {
          const detalhe = resposta ? await resposta.text() : "Sem resposta da rede";
          console.error(`Falha no Mentor [${resposta?.status}]: ${detalhe}`);
          if (resposta?.status === 429) {
            return json({ erro: "Muitos pedidos agora. Tente em instantes." }, 429);
          }
          if (resposta?.status === 402) {
            return json(
              { erro: "Os créditos de IA do espaço acabaram." },
              402,
            );
          }
          return json({ erro: "A IA não conseguiu responder no tempo limite." }, 504);
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
              // PASSO 5 — VISIBILIDADE DE CUSTO
              // Estimamos tokens (4 chars por token aprox.)
              await trackAiUsageEnd(requestId, 1000, Math.ceil(acumuladoParaSalvar.length / 4), acumuladoParaSalvar);
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
            await (supabase.from("mentor_messages") as any).insert({
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
