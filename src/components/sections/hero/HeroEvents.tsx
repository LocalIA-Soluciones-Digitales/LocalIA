"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, CreditCard, Scale, UtensilsCrossed, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/** Flujos que funcionan hoy en proyectos reales de LocalIA (ver data/automations.ts). */
const EVENTS = [
  { icon: Scale, from: "Venta en báscula", to: "Stock web actualizado", project: "Arrantza", slug: "pescados-mariscos-arrantza" },
  { icon: UtensilsCrossed, from: "Pedido desde la mesa", to: "Cocina y barra", project: "Palomita Bar", slug: "palomita-bar" },
  { icon: Zap, from: "Aviso de avería", to: "WhatsApp + email", project: "Electric", slug: "electric-instalaciones-electricas" },
  { icon: CreditCard, from: "Pago confirmado", to: "Aviso push al panel", project: "Amway Barakaldo", slug: "amway-barakaldo" },
];

export function HeroEvents() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % EVENTS.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fade-up relative" style={{ animationDelay: "1000ms" }}>
      <div className="rounded-2xl border border-white/[0.08] bg-ink-900/60 p-2 backdrop-blur-md">
        <div className="flex items-center justify-between px-3 pb-2 pt-2.5">
          <p className="eyebrow text-[0.64rem]">Funcionando ahora en nuestros proyectos</p>
          <BellRing aria-hidden className="size-3.5 text-fog-500" />
        </div>
        <ul>
          {EVENTS.map((e, i) => {
            const Icon = e.icon;
            const on = i === active;
            return (
              <li key={e.slug}>
                <Link
                  href={`/proyectos/${e.slug}`}
                  className={cn(
                    "relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 transition-colors duration-500",
                    on ? "bg-white/[0.05]" : "hover:bg-white/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset transition-colors duration-500",
                      on ? "bg-cyan/10 text-cyan ring-cyan/30" : "text-fog-500 ring-white/10",
                    )}
                  >
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[0.82rem] text-fog-100">
                      <span className="truncate">{e.from}</span>
                      <span aria-hidden className={cn("transition-colors", on ? "text-cyan" : "text-fog-500")}>→</span>
                      <span className="truncate">{e.to}</span>
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog-500">
                      {e.project}
                    </span>
                  </span>
                  {on && (
                    <span
                      aria-hidden
                      key={active}
                      className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-cyan/0 via-cyan to-cyan/0"
                      style={{ animation: "progress-line 2.8s linear both" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
