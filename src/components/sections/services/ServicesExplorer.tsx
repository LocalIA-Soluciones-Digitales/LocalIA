"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { ServiceVisual } from "@/components/sections/services/ServiceVisual";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

export type ServiceProof = { name: string; slug: string };

interface Props {
  services: Service[];
  proofs: Record<string, ServiceProof[]>;
}

export function ServicesExplorer({ services, proofs }: Props) {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-16">
      {/* Lista de servicios */}
      <ul className="border-t border-white/[0.08] lg:col-span-6">
        {services.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.key} className="border-b border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => window.matchMedia("(min-width: 1024px)").matches && setActive(i)}
                onFocus={() => setActive(i)}
                aria-expanded={on}
                aria-controls={`service-panel-${s.key}`}
                className="group flex w-full items-start gap-5 py-6 text-left md:py-7"
              >
                <span className={cn("mt-2 font-mono text-xs transition-colors", on ? "text-signal-bright" : "text-fog-500")}>
                  {s.index}
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block text-[1.6rem] font-medium leading-tight tracking-[-0.035em] transition-colors duration-300 md:text-[2.1rem]",
                      on ? "text-white" : "text-fog-400 group-hover:text-fog-100",
                    )}
                  >
                    {s.title}
                  </span>
                  <span className={cn("mt-1.5 block text-sm transition-colors md:text-[0.95rem]", on ? "text-fog-300" : "text-fog-500")}>
                    {s.lead}
                  </span>
                </span>
                <Plus
                  aria-hidden
                  className={cn(
                    "mt-2.5 size-5 shrink-0 transition-all duration-500 lg:hidden",
                    on ? "rotate-45 text-white" : "text-fog-500",
                  )}
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
                  <div className="pb-8">
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
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-28" id={`service-panel-${current.key}`} aria-live="polite">
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
    <div className="mt-7">
      <p className="text-[0.98rem] leading-relaxed text-fog-300">{service.description}</p>
      <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-fog-400">
        {service.deliverables.map((d) => (
          <li key={d} className="flex items-center gap-2.5">
            <span aria-hidden className="size-1 rounded-full bg-signal-bright" />
            {d}
          </li>
        ))}
      </ul>
      <div className="mt-7 border-t border-white/[0.07] pt-5">
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
