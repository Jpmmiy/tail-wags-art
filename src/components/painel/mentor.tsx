"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Copy, Check, RefreshCw, Square } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Msg = { id: string; de: "voce" | "mentor"; texto: string };

const SUGESTOES = [
  "O anfitrião achou caro. O que respondo?",
  "Quanto cobrar por um imóvel de R$ 600 a diária?",
  "Como retomar uma proposta parada?",
  "Ele pediu para ver antes de pagar. Faço?",
];

function Balao({ m, aoRefazer }: { m: Msg; aoRefazer?: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const meu = m.de === "voce";

  return (
    <li className={cn("group flex gap-3", meu && "flex-row-reverse")}>
      {meu ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/8 font-mono text-[11px] text-stone">
          JP
        </span>
      ) : (
        <span className="glass grid size-8 shrink-0 place-items-center rounded-lg">
          <LogoMark className="size-4" />
        </span>
      )}

      <div className={cn("min-w-0 max-w-[46rem]", meu && "flex flex-col items-end")}>
        <div
          className={cn(
            "whitespace-pre-line rounded-2xl px-4 py-3 text-[0.92rem] leading-relaxed",
            meu
              ? "rounded-tr-sm bg-white/10 text-bone"
              : "glass rounded-tl-sm text-bone/90",
          )}
        >
          {m.texto || (
            <span className="inline-flex gap-1 py-1" aria-label="Escrevendo">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{ animationDelay: `${i * 160}ms` }}
                  className="size-1.5 rounded-full bg-stone motion-safe:animate-pulse"
                />
              ))}
            </span>
          )}
        </div>

        {!meu && m.texto && (
          <div className="mt-1.5 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(m.texto);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 1600);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.74rem] text-stone transition-colors hover:bg-white/6 hover:text-bone"
            >
              {copiado ? (
                <Check className="size-3" strokeWidth={2.6} />
              ) : (
                <Copy className="size-3" strokeWidth={2} />
              )}
              {copiado ? "Copiado" : "Copiar"}
            </button>
            {aoRefazer && (
              <button
                type="button"
                onClick={aoRefazer}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.74rem] text-stone transition-colors hover:bg-white/6 hover:text-bone"
              >
                <RefreshCw className="size-3" strokeWidth={2} />
                Refazer
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export function Mentor() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [texto, setTexto] = useState("");
  const [escrevendo, setEscrevendo] = useState(false);
  const fim = useRef<HTMLDivElement>(null);
  const controle = useRef<AbortController | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("mentor_messages")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true });

      if (data && !error) {
        setMsgs(data.map(m => ({
          id: m.id,
          de: m.role === "user" ? "voce" : "mentor",
          texto: m.content
        })));
      }
    };

    carregarHistorico();
  }, []);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  /** Fala com /api/mentor e vai escrevendo conforme o modelo responde. */
  const responder = async (historico: Msg[]) => {
    const id = crypto.randomUUID();
    setMsgs((m) => [...m, { id, de: "mentor", texto: "" }]);
    setEscrevendo(true);

    const ctrl = new AbortController();
    controle.current = ctrl;
    let acumulado = "";

    try {
      const r = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          historico: historico.map((m) => ({ de: m.de, texto: m.texto })),
        }),
      });

      if (!r.ok || !r.body) {
        const corpo = await r.json().catch(() => null);
        throw new Error(corpo?.erro ?? `A resposta falhou (${r.status}).`);
      }

      const leitor = r.body.getReader();
      const decodificador = new TextDecoder();

      for (;;) {
        const { done, value } = await leitor.read();
        if (done) break;
        acumulado += decodificador.decode(value, { stream: true });
        setMsgs((m) =>
          m.map((x) => (x.id === id ? { ...x, texto: acumulado } : x)),
        );
      }
    } catch (e) {
      if ((e as Error)?.name === "AbortError") {
        // Cancelado pelo usuário: guarda o que já chegou, descarta o vazio.
        if (!acumulado) setMsgs((m) => m.filter((x) => x.id !== id));
        return;
      }
      const aviso =
        e instanceof Error ? e.message : "Não consegui responder agora.";
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, texto: aviso } : x)));
    } finally {
      setEscrevendo(false);
      controle.current = null;
    }
  };

  const enviar = (pergunta: string) => {
    const p = pergunta.trim();
    if (!p || escrevendo) return;
    const proximo: Msg[] = [
      ...msgs,
      { id: crypto.randomUUID(), de: "voce", texto: p },
    ];
    setMsgs(proximo);
    setTexto("");
    void responder(proximo);
  };

  const refazer = (i: number) => {
    if (escrevendo) return;
    const ate = msgs.slice(0, i);
    if (!ate.length) return;
    setMsgs(ate);
    void responder(ate);
  };

  return (
    <div className="flex h-[calc(100dvh-9rem)] flex-col">
      <header className="shrink-0 pb-5">
        <div className="flex items-center gap-3">
          <span className="glass grid size-10 place-items-center rounded-xl">
            <LogoMark className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-[1.35rem] font-semibold text-bone">
              Mentor Nexofly
            </h1>
            <p className="flex items-center gap-1.5 text-[0.8rem] text-stone">
              <span className="size-1.5 rounded-full bg-jade" />
              Preço, objeção, negociação e script
            </p>
          </div>
        </div>
      </header>

      <div className="glass flex min-h-0 flex-1 flex-col rounded-2xl">
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {msgs.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="glass-deep grid size-14 place-items-center rounded-2xl">
                <LogoMark className="size-6" />
              </span>
              <h2 className="mt-5 font-display text-[1.35rem] font-semibold text-bone">
                Pergunte antes de errar
              </h2>
              <p className="mt-2 max-w-sm text-[0.9rem] leading-relaxed text-stone">
                Trago o script pronto e o raciocínio por trás dele. Comece por
                uma das perguntas abaixo ou escreva a sua.
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              {msgs.map((m, i) => (
                <Balao
                  key={m.id}
                  m={m}
                  aoRefazer={
                    m.de === "mentor" && !escrevendo ? () => refazer(i) : undefined
                  }
                />
              ))}
            </ul>
          )}
          <div ref={fim} />
        </div>

        <div className="shrink-0 border-t border-white/8 p-4 sm:p-5">
          {msgs.length === 0 && (
            <ul className="mb-3 flex flex-wrap gap-2">
              {SUGESTOES.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => enviar(s)}
                    className="rounded-full border border-white/12 px-3.5 py-1.5 text-[0.78rem] text-stone transition-colors hover:border-chrome/40 hover:text-bone"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
            className="flex items-end gap-2 rounded-2xl border border-white/12 bg-white/[0.03] p-2 pl-4 transition-colors focus-within:border-chrome/50"
          >
            <label htmlFor="pergunta" className="sr-only">
              Sua pergunta para o Mentor Nexofly
            </label>
            <textarea
              id="pergunta"
              value={texto}
              rows={1}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar(texto);
                }
              }}
              placeholder="Escreva sua dúvida…"
              className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent py-2 text-[0.92rem] leading-relaxed text-bone outline-none placeholder:text-stone/55"
            />

            {escrevendo ? (
              <button
                type="button"
                onClick={() => controle.current?.abort()}
                aria-label="Parar resposta"
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/12 text-stone transition-colors hover:text-bone"
              >
                <Square className="size-3.5 fill-current" strokeWidth={0} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!texto.trim()}
                aria-label="Enviar pergunta"
                className="metal-pill grid size-10 shrink-0 place-items-center rounded-xl text-[#08090B] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-35"
              >
                <ArrowUp className="size-4" strokeWidth={2.6} />
              </button>
            )}
          </form>

          <p className="mt-2 text-center text-[0.72rem] text-stone/60">
            Enter envia · Shift + Enter quebra linha
          </p>
        </div>
      </div>
    </div>
  );
}
