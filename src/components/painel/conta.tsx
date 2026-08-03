"use client";

import { useState } from "react";
import {
  User,
  Camera,
  Mail,
  Lock,
  Webhook,
  CreditCard,
  Copy,
  Check,
  Eye,
  EyeOff,
  MonitorPlay,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo, ligarDemo } from "@/lib/demo";
import { EditorDemo } from "./editor-demo";

type Aba = "perfil" | "seguranca" | "plano" | "integracoes";

const ABAS: { id: Aba; rotulo: string; icone: typeof User }[] = [
  { id: "perfil", rotulo: "Perfil", icone: User },
  { id: "seguranca", rotulo: "Segurança", icone: Lock },
  { id: "plano", rotulo: "Plano", icone: CreditCard },
  { id: "integracoes", rotulo: "Integrações", icone: Webhook },
];

const GATEWAYS = ["Kiwify", "Hotmart", "Kirvano", "Stripe", "Mercado Pago", "Outro"];

function Campo({
  rotulo,
  children,
  dica,
}: {
  rotulo: string;
  children: React.ReactNode;
  dica?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
        {rotulo}
      </span>
      <div className="mt-2">{children}</div>
      {dica && <p className="mt-1.5 text-[0.78rem] text-stone/70">{dica}</p>}
    </label>
  );
}

const entrada =
  "h-11 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3.5 text-[0.9rem] text-bone outline-none transition-colors placeholder:text-stone/50 focus-visible:border-chrome";

function Cartao({
  titulo,
  desc,
  children,
}: {
  titulo: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-6 sm:p-7">
      <h2 className="font-display text-[1.1rem] font-semibold text-bone">
        {titulo}
      </h2>
      {desc && <p className="mt-1 text-[0.86rem] text-stone">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Salvar({ children = "Salvar" }: { children?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }}
      className="metal-pill inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[0.88rem] font-semibold text-[#08090B] transition-transform hover:-translate-y-0.5"
    >
      {ok && <Check className="size-4" strokeWidth={3} />}
      {ok ? "Salvo" : children}
    </button>
  );
}

export function Conta() {
  const [aba, setAba] = useState<Aba>("perfil");
  const { ligado: demo } = useDemo();
  const [nome, setNome] = useState("João Pedro");
  const [email, setEmail] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [gateway, setGateway] = useState(GATEWAYS[0]);
  const [copiado, setCopiado] = useState(false);

  const urlWebhook = "https://app.nexofly.com.br/api/webhook/pagamentos/u_7k2q";

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Conta</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-4xl">
          Configurações
        </h1>
        <p className="mt-1.5 text-[0.95rem] text-stone">
          Seus dados, o acesso e o que a Nexofly conecta por você.
        </p>
      </header>

      <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
        {ABAS.map((a) => {
          const Icone = a.icone;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setAba(a.id)}
              aria-pressed={aba === a.id}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[0.86rem] transition-all duration-300",
                aba === a.id
                  ? "metal-pill font-semibold text-[#08090B]"
                  : "text-stone hover:text-bone",
              )}
            >
              <Icone className="size-3.5" strokeWidth={2} />
              {a.rotulo}
            </button>
          );
        })}
      </div>

      {aba === "perfil" && (
        <div className="space-y-5 motion-safe:animate-rise">
          <Cartao titulo="Foto e nome">
            <div className="flex flex-wrap items-center gap-5">
              <div className="relative">
                <span className="glass-deep grid size-20 place-items-center rounded-full text-[1.6rem] font-semibold text-bone">
                  {nome.trim().charAt(0).toUpperCase() || "N"}
                </span>
                <button
                  type="button"
                  aria-label="Trocar foto"
                  className="metal-pill absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full text-[#08090B] transition-transform hover:scale-105"
                >
                  <Camera className="size-3.5" strokeWidth={2.2} />
                </button>
              </div>

              <div className="min-w-[14rem] flex-1">
                <Campo rotulo="Nome">
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={entrada}
                  />
                </Campo>
              </div>
            </div>

            <div className="mt-5">
              <Campo rotulo="E-mail" dica="Usado para login, avisos e sorteios.">
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone"
                    strokeWidth={1.8}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className={cn(entrada, "pl-10")}
                  />
                </div>
              </Campo>
            </div>

            <div className="mt-6">
              <Salvar />
            </div>
          </Cartao>
        </div>
      )}

      {aba === "seguranca" && (
        <div className="space-y-5 motion-safe:animate-rise">
          <Cartao
            titulo="Trocar senha"
            desc="A troca desconecta as outras sessões abertas."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo rotulo="Senha atual">
                <input type="password" className={entrada} />
              </Campo>
              <Campo rotulo="Nova senha" dica="Mínimo de 8 caracteres.">
                <div className="relative">
                  <input
                    type={verSenha ? "text" : "password"}
                    className={cn(entrada, "pr-11")}
                  />
                  <button
                    type="button"
                    onClick={() => setVerSenha((v) => !v)}
                    aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone transition-colors hover:text-bone"
                  >
                    {verSenha ? (
                      <EyeOff className="size-4" strokeWidth={1.8} />
                    ) : (
                      <Eye className="size-4" strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </Campo>
            </div>
            <div className="mt-6">
              <Salvar>Trocar senha</Salvar>
            </div>
          </Cartao>

          <Cartao
            titulo="Modo demonstração"
            desc="Preenche o painel com números de exemplo para você apresentar a plataforma. Não altera nada da sua conta."
          >
            <button
              type="button"
              role="switch"
              aria-checked={demo}
              onClick={() => ligarDemo(!demo)}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition-colors hover:border-white/20"
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                    demo ? "metal-pill text-[#08090B]" : "bg-white/6 text-stone",
                  )}
                >
                  <MonitorPlay className="size-4" strokeWidth={1.9} />
                </span>
                <span>
                  <span className="block text-[0.88rem] font-medium text-bone">
                    Números de exemplo no painel
                  </span>
                  <span className="mt-0.5 block text-[0.78rem] text-stone">
                    {demo
                      ? "Ativo. O painel marca a tela como demonstração."
                      : "Desligado. O painel mostra os seus dados reais."}
                  </span>
                </span>
              </span>

              <span
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
                  demo ? "bg-chrome" : "bg-white/12",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 size-4 rounded-full transition-all duration-300",
                    demo ? "left-6 bg-[#08090B]" : "left-1 bg-stone",
                  )}
                />
              </span>
            </button>
          </Cartao>

          {demo && <EditorDemo />}
        </div>
      )}

      {aba === "plano" && (
        <div className="space-y-5 motion-safe:animate-rise">
          <Cartao titulo="Seu plano">
            <div className="glass-deep flex flex-wrap items-center justify-between gap-4 rounded-xl p-5">
              <div>
                <p className="font-display text-[1.2rem] font-semibold text-bone">
                  Vitalício
                </p>
                <p className="mt-0.5 text-[0.84rem] text-stone">
                  Pagamento único · sem renovação
                </p>
              </div>
              <span className="rounded-full bg-jade/14 px-3.5 py-1.5 text-[0.78rem] font-medium text-jade">
                Ativo
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[0.86rem] text-bone transition-colors hover:border-chrome/40"
              >
                Ver histórico de pagamentos
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[0.86rem] text-stone transition-colors hover:border-white/25 hover:text-bone"
              >
                Mudar de plano
              </button>
            </div>
          </Cartao>
        </div>
      )}

      {aba === "integracoes" && (
        <div className="space-y-5 motion-safe:animate-rise">
          <Cartao
            titulo="Webhook de pagamentos"
            desc="Cole esta URL no seu gateway. Cada venda aprovada entra no painel sozinha."
          >
            <Campo rotulo="Gateway">
              <select
                value={gateway}
                onChange={(e) => setGateway(e.target.value)}
                className={entrada}
              >
                {GATEWAYS.map((g) => (
                  <option key={g} value={g} className="bg-ink">
                    {g}
                  </option>
                ))}
              </select>
            </Campo>

            <div className="mt-4">
              <Campo
                rotulo="URL do webhook"
                dica="Eventos aceitos: compra aprovada, reembolso e chargeback."
              >
                <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/30 p-2 pl-4">
                  <code className="min-w-0 flex-1 truncate font-mono text-[0.82rem] text-bone">
                    {urlWebhook}
                  </code>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(urlWebhook);
                      setCopiado(true);
                      setTimeout(() => setCopiado(false), 1800);
                    }}
                    className="metal-pill inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.78rem] font-semibold text-[#08090B]"
                  >
                    {copiado ? (
                      <Check className="size-3.5" strokeWidth={3} />
                    ) : (
                      <Copy className="size-3.5" strokeWidth={2} />
                    )}
                    {copiado ? "Copiada" : "Copiar"}
                  </button>
                </div>
              </Campo>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <span className="size-2 shrink-0 rounded-full bg-stone/50" />
              <p className="text-[0.84rem] text-stone">
                Nenhum evento recebido ainda. Assim que a primeira venda cair, o
                faturamento do painel passa a se atualizar sozinho.
              </p>
            </div>
          </Cartao>
        </div>
      )}
    </div>
  );
}
