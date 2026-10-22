"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { ArrowUpRight, Check, Zap } from "lucide-react";
import { BrowserFrame } from "@/components/projects/DeviceFrames";
import type { RealAutomation } from "@/data/automations";
import { cn } from "@/lib/utils";

export type ShowcaseAutomation = RealAutomation & { name: string; url?: string; accent: string };

const STEP_MS = 850;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Automatizaciones reales, una a una: la web del proyecto a la izquierda y el
 * flujo avanzando paso a paso a la derecha. Cambia sola de proyecto mientras
 * está en pantalla; al elegir uno se queda en él.
 */
export function AutomationShowcase({ items }: { items: ShowcaseAutomation[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [reduce, setReduce] = useState(false);
  const a = items[active];
  const n = a.steps.length;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Avanza los pasos; al terminar, espera un poco y pasa al siguiente proyecto.
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setStep((s) => s + 1), STEP_MS);
    return () => clearInterval(id);
  }, [inView, reduce]);

  useEffect(() => {
    if (!auto || step <= n + 2) return;
    setActive((i) => (i + 1) % items.length);
    setStep(0);
  }, [step, auto, n, items.length]);

  const shown = reduce ? n : Math.min(step, n);
  const done = shown >= n;

  return (
    <div ref={ref} className="overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900/70">
      {/* Selector de proyecto */}
      <div role="tablist" aria-label="Automatizaciones reales" className="flex gap-1 overflow-x-auto border-b border-white/[0.07] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={it.slug}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="automation-panel"
              onClick={() => {
                setAuto(false);
                setActive(i);
                setStep(0);
              }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition-colors duration-300",
                on ? "bg-white/[0.07] text-white" : "text-fog-500 hover:text-fog-100",
              )}
            >
              <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: it.accent, opacity: on ? 1 : 0.5 }} />
              {it.project}
            </button>
          );
        })}
      </div>

      <div id="automation-panel" role="tabpanel" className="grid lg:grid-cols-12">
        {/* La web real */}
        <div className="relative overflow-hidden p-5 md:p-8 lg:col-span-7">
          <div
            aria-hidden
            className="absolute inset-0 -z-0 opacity-70 transition-colors duration-700"
            style={{ background: `radial-gradient(70% 60% at 30% 40%, ${a.accent}22, transparent)` }}
          />
          <div className="relative">
            <BrowserFrame url={a.url} accent={a.accent}>
              <AnimatePresence mode="popLayout" initial={false}>
                <m.div
                  key={a.slug}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image src={a.image} alt={`Web de ${a.name}`} fill sizes="(min-width: 1024px) 680px, 92vw" className="object-cover object-top" />
                </m.div>
              </AnimatePresence>
            </BrowserFrame>

            {/* Resultado final del flujo, sobre la web */}
            <AnimatePresence>
              {done && (
                <m.div
                  key={a.slug}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="absolute -bottom-3 right-3 flex max-w-[78%] items-center gap-3 rounded-2xl bg-white/[0.97] p-3 pr-4 text-ink-950 shadow-[0_24px_60px_-16px_rgb(0_0_0/0.8)] md:right-6 md:max-w-[60%]"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-950" style={{ backgroundColor: a.accent }}>
                    <Zap aria-hidden className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.82rem] font-semibold leading-tight">{a.steps[n - 1]}</span>
                    <span className="block truncate text-xs text-ink-600">Automático · {a.name}</span>
                  </span>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* El flujo, paso a paso */}
        <div className="flex flex-col border-t border-white/[0.07] p-5 md:p-8 lg:col-span-5 lg:border-l lg:border-t-0">
          <p className="eyebrow">Así funciona</p>
          <ol className="relative mt-6 flex-1">
            {a.steps.map((s, i) => {
              const ok = i < shown;
              const now = i === shown && !done;
              return (
                <li key={`${a.slug}-${s}`} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < n - 1 && (
                    <span aria-hidden className="absolute left-[0.9375rem] top-8 h-[calc(100%-2rem)] w-px bg-white/10">
                      <m.span
                        className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-signal-bright to-cyan"
                        initial={false}
                        animate={{ height: ok && i + 1 < shown ? "100%" : "0%" }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </span>
                  )}
                  <span
                    className={cn(
                      "relative z-10 grid size-[1.875rem] shrink-0 place-items-center rounded-full border font-mono text-[0.62rem] transition-all duration-500",
                      ok ? "border-transparent bg-white text-ink-950" : now ? "border-cyan/60 text-cyan shadow-[0_0_20px_-4px_rgb(63_216_232/0.7)]" : "border-white/10 text-fog-500",
                    )}
                  >
                    {ok ? <Check aria-hidden className="size-3.5" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span className={cn("pt-1 text-[0.98rem] transition-colors duration-500", ok ? "text-white" : now ? "text-fog-100" : "text-fog-500")}>{s}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-fog-400">{a.summary}</p>
          <Link
            href={`/proyectos/${a.slug}`}
            className="group mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-fog-100 hover:text-white"
          >
            Ver el caso de {a.name}
            <ArrowUpRight aria-hidden className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
