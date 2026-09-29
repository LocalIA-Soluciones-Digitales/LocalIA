"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MAIN_NAV, PRIMARY_CTA } from "@/data/navigation";
import { FEATURED_PROJECTS } from "@/data/projects";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú al navegar.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-white/[0.07] bg-ink-950/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
      >
        <nav aria-label="Principal" className="container-x flex h-16 items-center justify-between md:h-[4.5rem]">
          <Link href="/" aria-label="LocalIA, ir al inicio" className="relative z-10 -m-1 rounded-lg p-1">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {MAIN_NAV.slice(1).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[0.9rem] transition-colors duration-300",
                    isActive(l.href) ? "text-white" : "text-fog-400 hover:text-fog-100",
                  )}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <span aria-hidden className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-signal-bright to-transparent" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href={PRIMARY_CTA.href}
              className="group hidden h-10 items-center gap-2 rounded-full bg-fog-50 px-4.5 text-sm font-medium text-ink-950 transition-colors hover:bg-white sm:inline-flex"
            >
              {PRIMARY_CTA.label}
              <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="relative z-10 grid size-11 place-items-center rounded-full ring-1 ring-inset ring-white/12 lg:hidden"
            >
              <span className="relative block h-3 w-4.5">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full rounded bg-fog-50 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full rounded bg-fog-50 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-0 z-40 flex flex-col bg-ink-950/95 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40 mask-fade-y" />
            <div className="container-x relative flex flex-1 flex-col justify-between pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
              <ul className="space-y-1">
                {MAIN_NAV.map((l, i) => (
                  <li key={l.href} className="overflow-hidden">
                    <m.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%", transition: { duration: 0.3 } }}
                      transition={{ delay: 0.18 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={l.href}
                        aria-current={isActive(l.href) ? "page" : undefined}
                        className="group flex items-baseline gap-4 py-2"
                      >
                        <span className="font-mono text-xs text-fog-500">0{i + 1}</span>
                        <span
                          className={cn(
                            "text-[2.6rem] font-medium leading-none tracking-[-0.045em] transition-colors",
                            isActive(l.href) ? "text-white" : "text-fog-300 group-active:text-white",
                          )}
                        >
                          {l.label}
                        </span>
                      </Link>
                    </m.div>
                  </li>
                ))}
              </ul>

              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-6"
              >
                <div>
                  <p className="eyebrow mb-3">En producción</p>
                  <div className="flex flex-wrap gap-2">
                    {FEATURED_PROJECTS.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/proyectos/${p.slug}`}
                        className="rounded-full px-3 py-1.5 text-xs text-fog-300 ring-1 ring-inset ring-white/10"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href={PRIMARY_CTA.href}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-fog-50 text-base font-medium text-ink-950"
                >
                  {PRIMARY_CTA.label}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
