"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Cta } from "@/components/brand/cta";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#plataforma", label: "Plataforma" },
  { href: "#capacidades", label: "Recursos" },
  { href: "#padrao", label: "Galeria" },
  { href: "#processo", label: "Como funciona" },
  { href: "#planos", label: "Planos" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500",
          scrolled ? "px-3 pt-3 sm:px-5 sm:pt-4" : "px-0 pt-0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-16 items-center justify-between gap-6 px-5 transition-all duration-500 sm:h-[4.5rem] lg:px-8",
            scrolled
              ? "glass max-w-[74rem] rounded-full shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]"
              : "max-w-[82rem] rounded-none border border-transparent bg-transparent",
          )}
        >
        <Link href="/" aria-label="Nexofly, página inicial">
          <Logo markClassName="size-7" />
        </Link>

        <nav
          aria-label="Seções da página"
          className="hidden items-center gap-1 lg:flex"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-[0.86rem] font-medium text-stone transition-colors hover:bg-white/5 hover:text-bone"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/painel"
            className="hidden rounded-full px-3.5 py-2 text-[0.86rem] font-medium text-stone transition-colors hover:text-bone sm:inline-flex"
          >
            Entrar
          </Link>
          <Cta href="#planos" className="hidden h-10 px-5 sm:inline-flex">
            Assinar
          </Cta>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="grid size-10 place-items-center rounded-full border border-white/12 text-bone lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none">
              {open ? (
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/8 bg-ink px-5 pb-8 pt-4 lg:hidden">
          <nav aria-label="Seções da página" className="flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/6 py-3.5 font-display text-lg text-bone"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Cta href="#planos" size="lg">
              Assinar a Nexofly
            </Cta>
            <Link
              href="/painel"
              className="py-2 text-center text-sm text-stone"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
