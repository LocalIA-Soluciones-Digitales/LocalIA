"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { FileText, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const SCENARIOS = [
  {
    key: "email",
    tab: "Clasificar",
    icon: Mail,
    input: {
      title: "Email entrante",
      body: "Buenas, somos un restaurante de Getxo y querríamos recibir género tres veces por semana. ¿Podéis pasarnos condiciones y precios para hostelería? Gracias.",
    },
    output: [
      ["categoría", "cliente hostelería"],
      ["intención", "alta de suministro"],
      ["prioridad", "alta"],
      ["acción", "enviar tarifa + crear ficha"],
    ],
  },
  {
    key: "doc",
    tab: "Extraer",
    icon: FileText,
    input: {
      title: "Albarán escaneado (PDF)",
      body: "PROVEEDOR: Proveedor de ejemplo S.L. · Nº 2026-0418 · Fecha 14/09/2026 · 12 cajas refresco 24u · 6 barriles 30L · Total 486,20 €",
    },
    output: [
      ["proveedor", "Proveedor de ejemplo S.L."],
      ["documento", "2026-0418"],
      ["líneas", "2 productos"],
      ["total", "486,20 €"],
    ],
  },
  {
    key: "chat",
    tab: "Responder",
    icon: MessageSquare,
    input: {
      title: "Pregunta de un empleado",
      body: "¿Qué hago si un cliente quiere devolver un producto abierto?",
    },
    output: [
      ["respuesta", "Solo con defecto de fábrica"],
      ["plazo", "14 días con ticket"],
      ["fuente", "Manual interno · §4.2"],
      ["confianza", "alta"],
    ],
  },
];

/** Demostración ilustrativa: entrada no estructurada → datos útiles. */
export function AiDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!inView || !auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % SCENARIOS.length), 5200);
    return () => clearInterval(id);
  }, [inView, auto]);

  const s = SCENARIOS[active];

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-white/[0.09] bg-ink-900/80">
      <div role="tablist" aria-label="Ejemplos de IA aplicada" className="flex border-b border-white/[0.07]">
        {SCENARIOS.map((sc, i) => {
          const Icon = sc.icon;
          return (
            <button
              key={sc.key}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls="ai-demo-panel"
              onClick={() => {
                setActive(i);
                setAuto(false);
              }}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 py-3.5 text-xs transition-colors md:text-sm",
                i === active ? "text-white" : "text-fog-500 hover:text-fog-300",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {sc.tab}
              {i === active && <span aria-hidden className="absolute inset-x-4 bottom-0 h-px bg-violet" />}
            </button>
          );
        })}
      </div>

      <div id="ai-demo-panel" role="tabpanel" className="relative grid min-h-[330px] gap-4 p-5 md:grid-cols-2 md:p-6">
        <AnimatePresence mode="wait">
          <m.div
            key={s.key + "-in"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-ink-850 p-4"
          >
            <p className="eyebrow text-[0.62rem]">{s.input.title}</p>
            <p className="mt-3 text-[0.84rem] leading-relaxed text-fog-300">{s.input.body}</p>
            <m.span
              aria-hidden
              className="absolute inset-x-0 h-10 bg-gradient-to-b from-violet/0 via-violet/20 to-violet/0"
              initial={{ top: "-20%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
            />
          </m.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <m.dl
            key={s.key + "-out"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-violet/25 bg-violet/[0.05] p-4 font-mono text-[0.74rem]"
          >
            <p className="mb-3 flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.14em] text-violet">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-violet" /> resultado estructurado
            </p>
            {s.output.map(([k, v], i) => (
              <m.div
                key={k}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.18, duration: 0.5 }}
                className="flex justify-between gap-4 border-b border-white/[0.05] py-2 last:border-0"
              >
                <dt className="text-fog-500">{k}</dt>
                <dd className="text-right text-fog-50">{v}</dd>
              </m.div>
            ))}
          </m.dl>
        </AnimatePresence>
      </div>
      <p className="border-t border-white/[0.06] px-5 py-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fog-500 md:px-6">
        Demostración ilustrativa · datos de ejemplo
      </p>
    </div>
  );
}
