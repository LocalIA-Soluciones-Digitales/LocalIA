"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Bell, Bot, Check, Database, FileText, LayoutDashboard, User, Workflow } from "lucide-react";
import { PIPELINE } from "@/data/automations";
import { cn } from "@/lib/utils";

const ICONS = [User, FileText, Database, Workflow, Bot, Bell, LayoutDashboard];
const LOG = [
  "Nuevo contacto desde la web",
  "Formulario validado: nombre, teléfono, necesidad",
  "Ficha creada en el CRM",
  "Flujo «nuevo lead» iniciado",
  "IA: clasificado como urgente · presupuesto",
  "Aviso enviado al móvil del responsable",
  "Panel actualizado: +1 solicitud hoy",
];

const STEP_MS = 1150;

/** Flujo conceptual animado: un dato viajando del cliente al dashboard. */
export function PipelineViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const [step, setStep] = useState(0);
  const [reduce, setReduce] = useState(false);
  const n = PIPELINE.length;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (n + 2)), STEP_MS);
    return () => clearInterval(id);
  }, [inView, reduce, n]);

  // step va de 0 a n+1: los dos últimos valores dejan el flujo completo un momento antes de reiniciar.
  const current = reduce ? n - 1 : Math.min(step, n - 1);
  const progress = current / (n - 1);
  const time = (i: number) => `09:14:${String(2 + i * 3).padStart(2, "0")}`;

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Nodos */}
      <div className="relative lg:col-span-8">
        {/* Línea base + progreso: vertical en móvil, horizontal en escritorio */}
        <div aria-hidden className="absolute bottom-7 left-[1.375rem] top-7 w-px bg-white/10 lg:bottom-auto lg:left-[calc(100%/14)] lg:right-[calc(100%/14)] lg:top-[1.75rem] lg:h-px lg:w-auto" />
        <div
          aria-hidden
          className="absolute left-[1.375rem] top-7 w-px origin-top bg-gradient-to-b from-signal to-cyan transition-[height] duration-1000 ease-out lg:hidden"
          style={{ height: `calc((100% - 3.5rem) * ${progress})` }}
        />
        <div
          aria-hidden
          className="absolute left-[calc(100%/14)] top-[1.75rem] hidden h-px bg-gradient-to-r from-signal to-cyan transition-[width] duration-1000 ease-out lg:block"
          style={{ width: `calc((100% - 100% / 7) * ${progress})` }}
        />

        <ol className="relative flex flex-col gap-5 lg:grid lg:grid-cols-7 lg:gap-2">
          {PIPELINE.map((node, i) => {
            const Icon = ICONS[i];
            const done = i < current;
            const on = i === current;
            return (
              <li key={node.key} className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center">
                <span
                  className={cn(
                    "relative z-10 grid size-11 shrink-0 place-items-center rounded-xl border bg-ink-900 transition-all duration-500 lg:size-14",
                    on
                      ? node.key === "ia"
                        ? "border-violet/70 text-violet shadow-[0_0_28px_-4px_rgb(157_125_255/0.7)]"
                        : "border-cyan/70 text-cyan shadow-[0_0_28px_-4px_rgb(63_216_232/0.6)]"
                      : done
                        ? "border-white/20 text-fog-100"
                        : "border-white/10 text-fog-500",
                  )}
                >
                  <Icon aria-hidden className="size-[1.15rem] lg:size-5" />
                  {done && (
                    <span className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-emerald-400 text-ink-950">
                      <Check aria-hidden className="size-2.5" strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-sm font-medium transition-colors", on || done ? "text-fog-50" : "text-fog-400")}>
                    {node.label}
                  </span>
                  <span
                    className={cn(
                      "block font-mono text-[0.66rem] uppercase tracking-[0.1em] transition-opacity duration-500",
                      on ? "text-cyan opacity-100" : done ? "text-fog-500 opacity-100" : "opacity-0",
                    )}
                  >
                    {node.state}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Registro de eventos */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-white/[0.08] bg-ink-900/70 p-5 font-mono text-[0.72rem]">
          <div className="mb-4 flex items-center justify-between text-fog-500">
            <span className="uppercase tracking-[0.14em]">Registro</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-400" /> en vivo
            </span>
          </div>
          <ol className="space-y-2.5" aria-live="off">
            {LOG.map((line, i) => (
              <li
                key={line}
                className={cn(
                  "flex gap-3 transition-all duration-500",
                  i <= current ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                )}
              >
                <span className="shrink-0 text-fog-500">{time(i)}</span>
                <span className={i === current ? (i === 4 ? "text-violet" : "text-cyan") : "text-fog-300"}>{line}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 border-t border-white/[0.06] pt-3 text-[0.62rem] uppercase tracking-[0.12em] text-fog-500">
            Ejemplo ilustrativo de un flujo
          </p>
        </div>
      </div>
    </div>
  );
}
