import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { isMentorEnabled } from "@/lib/mentor-config";

const MODELO = "google/gemini-3.6-flash";

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
Direto ao ponto. Comece pela resposta, não pelo contexto. Uma a duas frases
resolvem a maioria das perguntas; nunca escreva textos longos.

Fale português do Brasil, no tom de um colega experiente. Sem jargão de
coach, sem "é fundamental que", sem entusiasmo forçado, sem emoji.

Dê números concretos sempre que puder. Ancorar preço na diária do imóvel
funciona: um pacote costuma valer de duas a três diárias. Se faltar o dado
para calcular, peça esse dado em uma frase.

O QUE NÃO FAZER
Não prometa resultado. Não invente número de mercado. Não recomende baixar
preço como primeira resposta a uma objeção — troque escopo antes de trocar
valor. Não fale sobre assuntos fora de venda, produção e operação desse
negócio.`;

type Turno = { de: "voce" | "mentor"; texto: string };

function json(dados: unknown, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Descobre o usuário pelo token enviado pelo navegador (opcional). */
async function usuarioDoToken(request: Request) {
  const auth = request.headers.get("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const url = process.env["VITE_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
  const key =
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;

  try {
    const cliente = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data } = await cliente.auth.getUser(token);
    if (!data?.user) return null;
    return { id: data.user.id, cliente };
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/mentor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isMentorEnabled()) {
          return json(
            { erro: "O Mentor está em manutenção ou foi desativado temporariamente." },
            403,
          );
        }

        const chave = process.env["LOVABLE_API_KEY"];
        if (!chave) {
          return json({ erro: "O Mentor não está configurado neste ambiente." }, 503);
        }

        let historico: Turno[];
        try {
          const corpo = (await request.json()) as { historico?: Turno[] };
          historico = Array.isArray(corpo?.historico) ? corpo.historico : [];
        } catch {
          return json({ erro: "Corpo inválido." }, 400);
        }

        const mensagens = historico
          .filter((t) => t.texto?.trim())
          .slice(-20)
          .map((t) => ({
            role: t.de === "voce" ? ("user" as const) : ("assistant" as const),
            content: t.texto,
          }));

        if (!mensagens.length || mensagens[0].role !== "user") {
          return json({ erro: "A conversa precisa começar com uma pergunta." }, 400);
        }

        const usuario = await usuarioDoToken(request);

        const salvar = async (role: "user" | "assistant", content: string) => {
          if (!usuario || !content) return;
          try {
            await (usuario.cliente.from("mentor_messages") as any).insert({
              user_id: usuario.id,
              role,
              content,
            });
          } catch {
            /* histórico é acessório: nunca derruba a resposta */
          }
        };

        const ultima = mensagens[mensagens.length - 1];
        if (ultima.role === "user") void salvar("user", ultima.content);

        let resposta: Response;
        try {
          resposta = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Lovable-API-Key": chave,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: MODELO,
              stream: true,
              messages: [{ role: "system", content: SISTEMA }, ...mensagens],
            }),
          });
        } catch (e) {
          console.error("[Mentor] Falha de rede:", e);
          return json({ erro: "Não consegui falar com a IA agora. Tente de novo." }, 502);
        }

        if (!resposta.ok || !resposta.body) {
          const detalhe = await resposta.text().catch(() => "");
          console.error(`[Mentor] Gateway ${resposta.status}: ${detalhe}`);
          if (resposta.status === 429) {
            return json({ erro: "Muitos pedidos agora. Tente em instantes." }, 429);
          }
          if (resposta.status === 402) {
            return json({ erro: "Os créditos de IA do espaço acabaram." }, 402);
          }
          return json({ erro: "O servidor de IA respondeu com erro. Tente de novo." }, 502);
        }

        const corpoStream = new ReadableStream<Uint8Array>({
          async start(controlador) {
            const leitor = resposta.body!.getReader();
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            let resto = "";
            let acumulado = "";

            try {
              for (;;) {
                const { done, value } = await leitor.read();
                if (done) break;

                resto += decoder.decode(value, { stream: true });
                const linhas = resto.split("\n");
                resto = linhas.pop() ?? "";

                for (const linha of linhas) {
                  const limpa = linha.trim();
                  if (!limpa.startsWith("data: ")) continue;
                  const dado = limpa.slice(6).trim();
                  if (dado === "[DONE]") continue;
                  try {
                    const evento = JSON.parse(dado);
                    const texto = evento?.choices?.[0]?.delta?.content;
                    if (texto) {
                      acumulado += texto;
                      controlador.enqueue(encoder.encode(texto));
                    }
                  } catch {
                    /* fragmento incompleto */
                  }
                }
              }
              await salvar("assistant", acumulado);
              controlador.close();
            } catch (err) {
              console.error("[Mentor] Erro no stream:", err);
              try {
                controlador.close();
              } catch {
                /* já fechado */
              }
            } finally {
              leitor.releaseLock();
            }
          },
        });

        return new Response(corpoStream, {
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