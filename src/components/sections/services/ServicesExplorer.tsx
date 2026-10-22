"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Check, Globe, LayoutDashboard, Plus, Puzzle, ShoppingBag, Sparkles, Workflow } from "lucide-react";
import { ServiceVisual } from "@/components/sections/services/ServiceVisual";
import type { Service, ServiceVisual as VisualKind } from "@/data/services";
import { cn } from "@/lib/utils";

export type ServiceProof = { name: string; slug: string };

interface Props {
  services: Service[];
  proofs: Record<string, ServiceProof[]>;
}

const ICONS: Record<VisualKind, typeof Globe> = {
  web: Globe,
  automation: Workflow,
  ai: Sparkles,
  crm: LayoutDashboard,
  ecommerce: ShoppingBag,
  custom: Puzzle,
};

export function ServicesExplorer({ services, proofs }: Props) {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-16">
      {/* Lista de servicios */}
      <ul className="space-y-1.5 lg:col-span-5">
        {services.map((s, i) => {
          const on = i === active;
          const Icon = ICONS[s.visual];
          return (
            <li
              key={s.key}
              className={cn(
                "relative rounded-2xl transition-colors duration-500",
                on ? "bg-white/[0.035] ring-1 ring-inset ring-white/[0.09]" : "hover:bg-white/[0.02]",
              )}
            >
              {on && (
                <m.span
                  aria-hidden
                  className="absolute bottom-4 left-0 top-4 hidden w-[2px] origin-top rounded-full bg-gradient-to-b from-signal-bright to-cyan lg:block"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => window.matchMedia("(min-width: 1024px)").matches && setActive(i)}
                onFocus={() => setActive(i)}
                aria-expanded={on}
                aria-controls={`service-panel-${s.key}`}
                className="group flex w-full items-center gap-4 px-4 py-4 text-left md:gap-5 md:px-5 md:py-5"
              >
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-xl border transition-all duration-500 md:size-12",
                    on
                      ? "border-signal-bright/40 bg-signal/15 text-signal-bright shadow-[0_0_30px_-8px_rgb(77_124_255/0.8)]"
                      : "border-white/[0.08] bg-white/[0.02] text-fog-500 group-hover:text-fog-300",
                  )}
                >
                  <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-3">
                    <span className={cn("font-mono text-[0.68rem] transition-colors", on ? "text-signal-bright" : "text-fog-500")}>{s.index}</span>
                    <span
                      className={cn(
                        "block text-[1.3rem] font-medium leading-tight tracking-[-0.03em] transition-colors duration-300 md:text-[1.6rem]",
                        on ? "text-white" : "text-fog-400 group-hover:text-fog-100",
                      )}
                    >
                      {s.title}
                    </span>
                  </span>
                  <span className={cn("mt-1 block text-sm leading-snug transition-colors", on ? "text-fog-300" : "text-fog-500")}>{s.lead}</span>
                </span>
                <Plus
                  aria-hidden
                  className={cn("size-5 shrink-0 transition-all duration-500 lg:hidden", on ? "rotate-45 text-white" : "text-fog-500")}
                />
              </button>

              {/* Móvil / tablet: detalle desplegable bajo cada servicio */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
                  on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-6 md:px-5">
                    {on && <ServiceVisual kind={s.visual} />}
                    <ServiceDetail service={s} proofs={proofs[s.key]} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Escritorio: panel fijo que cambia con el servicio activo */}
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-24" id={`service-panel-${current.key}`} aria-live="polite">
          <AnimatePresence mode="wait">
            <m.div
              key={current.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <ServiceVisual kind={current.visual} />
              <ServiceDetail service={current} proofs={proofs[current.key]} />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ServiceDetail({ service, proofs }: { service: Service; proofs: ServiceProof[] }) {
  return (
    <div className="mt-6">
      <p className="text-[0.98rem] leading-relaxed text-fog-300">{service.description}</p>
      <ul className="mt-5 flex flex-wrap gap-2 text-[0.8rem] text-fog-300">
        {service.deliverables.map((d) => (
          <li key={d} className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 ring-1 ring-inset ring-white/[0.08]">
            <Check aria-hidden className="size-3.5 text-cyan" />
            {d}
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-white/[0.07] pt-5">
        {proofs.length > 0 ? (
          <>
            <p className="eyebrow mb-3 text-[0.64rem]">Lo hemos hecho en</p>
            <div className="flex flex-wrap gap-2">
              {proofs.map((p) => (
                <Link
                  key={p.slug}
                  href={`/proyectos/${p.slug}`}
                  className="group inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-fog-300 ring-1 ring-inset ring-white/10 transition hover:text-white hover:ring-white/25"
                >
                  {p.name}
                  <ArrowUpRight aria-hidden className="size-3 opacity-50 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-fog-500">
            Punto de partida real:{" "}
            <Link href="/proyectos/reformas-integrales-martin" className="text-fog-300 underline underline-offset-4 hover:text-white">
              Reformas Integrales Martín
            </Link>{" "}
            ya tiene una arquitectura de agentes preparada para conectar un modelo de IA.
          </p>
        )}
      </div>
    </div>
  );
}
