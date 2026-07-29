import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dog, Menu, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NAV, BUSINESS } from "./data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5"
    >
      <div
        className={`mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled
            ? "bg-card/80 shadow-soft backdrop-blur-xl hairline"
            : "bg-card/40 backdrop-blur-md hairline"
        }`}
      >
        <a href="#inicio" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl gradient-warm text-primary-foreground shadow-glow">
            <Dog className="size-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-base font-semibold">
              {BUSINESS.short}
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              Saúde e Nutrição Animal
            </span>
          </span>
        </a>

        <div className="flex items-center gap-1.5">
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            aria-label="Sacola de compras"
            className="relative grid size-10 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.8} />
            <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              3
            </span>
          </button>

          <Button asChild size="lg" className="hidden rounded-full font-display sm:inline-flex">
            <a href="#contato">Entrar em contato</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Abrir menu"
                className="grid size-10 place-items-center rounded-full bg-muted text-foreground lg:hidden"
              >
                <Menu className="size-[18px]" strokeWidth={1.8} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm border-l bg-card p-6">
              <div className="mt-8 flex flex-col gap-1">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 font-display text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <Button asChild size="lg" className="mt-6 w-full rounded-full font-display">
                <a href="#contato" onClick={() => setOpen(false)}>
                  Entrar em contato
                </a>
              </Button>
              <p className="mt-6 text-sm text-muted-foreground">{BUSINESS.address}</p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
