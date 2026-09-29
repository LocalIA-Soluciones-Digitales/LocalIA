"use client";

import { useRef } from "react";
import { m, useInView } from "framer-motion";
import { Bot, Check, CreditCard, Printer, Scale, ShoppingBag } from "lucide-react";
import type { ServiceVisual as VisualKind } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Pequeñas visualizaciones conceptuales por servicio. Solo se animan cuando
 * están en pantalla; con reduced-motion MotionConfig las deja estáticas.
 */
export function ServiceVisual({ kind, className }: { kind: VisualKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const Visual = VISUALS[kind];
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900",
        className,
      )}
    >
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgb(77_124_255/0.14),transparent)]" />
      <div className="relative h-full">{inView && <Visual />}</div>
    </div>
  );
}

const loop = (delay = 0, duration = 3.2) => ({
  duration,
  delay,
  repeat: Infinity,
  repeatDelay: 0.6,
  ease: [0.16, 1, 0.3, 1] as const,
});

function WebVisual() {
  const blocks = [
    { x: "8%", y: "16%", w: "42%", h: "9%", d: 0 },
    { x: "8%", y: "29%", w: "30%", h: "5%", d: 0.15 },
    { x: "8%", y: "40%", w: "16%", h: "7%", d: 0.3, accent: true },
    { x: "56%", y: "14%", w: "36%", h: "36%", d: 0.2, img: true },
    { x: "8%", y: "58%", w: "26%", h: "26%", d: 0.45 },
    { x: "37%", y: "58%", w: "26%", h: "26%", d: 0.55 },
    { x: "66%", y: "58%", w: "26%", h: "26%", d: 0.65 },
  ];
  return (
    <div className="absolute inset-[9%] rounded-lg border border-white/10 bg-ink-850">
      <div className="flex h-[8%] items-center gap-1 border-b border-white/[0.06] px-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-white/15" />
        ))}
      </div>
      {blocks.map((b, i) => (
        <m.div
          key={i}
          className={cn(
            "absolute rounded-[4px]",
            b.accent ? "bg-signal" : b.img ? "bg-gradient-to-br from-signal/40 to-cyan/20" : "bg-white/10",
          )}
          style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 0] }}
          transition={{ ...loop(b.d, 4.2), times: [0, 0.2, 0.85, 1] }}
        />
      ))}
      <m.div
        className="absolute size-3 rotate-[-20deg] border-l-[6px] border-t-[10px] border-l-transparent border-t-fog-50"
        initial={{ left: "70%", top: "80%" }}
        animate={{ left: ["70%", "18%", "18%", "70%"], top: ["80%", "44%", "44%", "80%"] }}
        transition={{ ...loop(0.4, 4.2), times: [0, 0.35, 0.6, 1] }}
      />
    </div>
  );
}

function AutomationVisual() {
  const nodes = ["Formulario", "CRM", "Flujo", "Aviso"];
  return (
    <div className="absolute inset-0 flex items-center justify-between px-[8%]">
      <div className="absolute inset-x-[14%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_12px_rgb(63_216_232/0.9)]"
          initial={{ left: "14%", opacity: 0 }}
          animate={{ left: ["14%", "86%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, delay: i * 0.87, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {nodes.map((n, i) => (
        <div key={n} className="relative z-10 flex flex-col items-center gap-2.5">
          <m.span
            className="grid size-11 place-items-center rounded-xl border border-white/15 bg-ink-800 font-mono text-[0.6rem] text-fog-300 md:size-14"
            animate={{ borderColor: ["rgb(255 255 255 / 0.15)", "rgb(63 216 232 / 0.7)", "rgb(255 255 255 / 0.15)"] }}
            transition={{ duration: 2.6, delay: 0.3 + i * 0.75, repeat: Infinity, repeatDelay: 0 }}
          >
            0{i + 1}
          </m.span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fog-400">{n}</span>
        </div>
      ))}
    </div>
  );
}

function AiVisual() {
  const fields = [
    { k: "tipo", v: "presupuesto" },
    { k: "urgencia", v: "alta" },
    { k: "zona", v: "Barakaldo" },
  ];
  return (
    <div className="absolute inset-[8%] flex flex-col justify-between gap-3">
      <div className="rounded-lg border border-white/10 bg-ink-850 p-3 text-[0.7rem] leading-relaxed text-fog-300 md:text-xs">
        «Hola, necesitaría un{" "}
        <m.span className="rounded px-0.5" animate={{ backgroundColor: ["rgb(157 125 255 / 0)", "rgb(157 125 255 / 0.35)"] }} transition={loop(0.4)}>
          presupuesto
        </m.span>{" "}
        para cambiar el cuadro eléctrico,{" "}
        <m.span className="rounded px-0.5" animate={{ backgroundColor: ["rgb(157 125 255 / 0)", "rgb(157 125 255 / 0.35)"] }} transition={loop(0.8)}>
          salta todo el rato
        </m.span>
        . Estoy en{" "}
        <m.span className="rounded px-0.5" animate={{ backgroundColor: ["rgb(157 125 255 / 0)", "rgb(157 125 255 / 0.35)"] }} transition={loop(1.2)}>
          Barakaldo
        </m.span>
        .»
      </div>
      <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-violet">
        <Bot className="size-3.5" /> extrayendo datos
      </div>
      <div className="rounded-lg border border-violet/30 bg-violet/[0.06] p-3 font-mono text-[0.68rem] md:text-xs">
        {fields.map((f, i) => (
          <m.div
            key={f.k}
            className="flex justify-between py-0.5"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: [0, 1, 1, 0], x: [-6, 0, 0, 0] }}
            transition={{ ...loop(1.4 + i * 0.3, 4), times: [0, 0.15, 0.9, 1] }}
          >
            <span className="text-fog-500">{f.k}</span>
            <span className="text-fog-100">{f.v}</span>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function CrmVisual() {
  const cols = ["Nuevo", "En curso", "Cerrado"];
  return (
    <div className="absolute inset-[8%] grid grid-cols-3 gap-2.5">
      {cols.map((c, ci) => (
        <div key={c} className="flex flex-col gap-2 rounded-lg border border-white/[0.07] bg-ink-850/80 p-2">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-fog-500">{c}</span>
          {[0, 1].map((r) => (
            <div key={r} className="h-8 rounded-md bg-white/[0.06] md:h-10" style={{ opacity: 1 - ci * 0.2 - r * 0.2 }} />
          ))}
        </div>
      ))}
      <m.div
        className="absolute left-[2%] top-[42%] h-8 w-[29%] rounded-md border border-signal/60 bg-signal/20 shadow-[0_8px_24px_-8px_rgb(77_124_255/0.7)] md:h-10"
        animate={{ left: ["2%", "35.5%", "35.5%", "69%", "69%"], rotate: [0, -3, 0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.8, times: [0, 0.3, 0.5, 0.8, 1], ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}

function EcommerceVisual() {
  return (
    <div className="absolute inset-[8%] flex gap-3">
      <div className="grid flex-1 grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-white/[0.07] bg-ink-850 p-1.5">
            <div className="flex-1 rounded bg-gradient-to-br from-white/10 to-white/[0.02]" />
            <div className="h-1.5 w-2/3 rounded bg-white/15" />
            <m.div
              className="h-4 rounded bg-white/10"
              animate={i === 1 ? { backgroundColor: ["rgb(255 255 255 / 0.1)", "rgb(77 124 255 / 0.9)", "rgb(255 255 255 / 0.1)"] } : undefined}
              transition={loop(0.5, 3.6)}
            />
          </div>
        ))}
      </div>
      <div className="flex w-[38%] flex-col justify-between rounded-lg border border-white/10 bg-ink-850 p-2.5">
        <div className="flex items-center justify-between text-fog-300">
          <ShoppingBag className="size-4" />
          <m.span
            className="grid size-5 place-items-center rounded-full bg-signal font-mono text-[0.6rem] text-white"
            animate={{ scale: [1, 1, 1.35, 1] }}
            transition={{ ...loop(0.5, 3.6), times: [0, 0.3, 0.4, 0.5] }}
          >
            1
          </m.span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 rounded bg-white/15" />
          <div className="h-1.5 w-2/3 rounded bg-white/10" />
        </div>
        <m.div
          className="flex items-center justify-center gap-1 rounded-md py-1.5 font-mono text-[0.58rem] uppercase tracking-wider"
          animate={{ backgroundColor: ["rgb(255 255 255 / 0.08)", "rgb(255 255 255 / 0.08)", "rgb(52 211 153 / 0.2)"], color: ["#b4bac5", "#b4bac5", "#6ee7b7"] }}
          transition={{ ...loop(0.5, 3.6), times: [0, 0.6, 0.75] }}
        >
          <CreditCard className="size-3" /> Pagar
        </m.div>
      </div>
    </div>
  );
}

function CustomVisual() {
  const tiles = [
    { x: 1, y: 1, label: "API" },
    { x: 2, y: 1, label: "DB" },
    { x: 1, y: 2, label: "Panel" },
    { x: 2, y: 2, label: "Web" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[8%] px-[8%]">
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((t, i) => (
          <m.div
            key={t.label}
            className="grid size-14 place-items-center rounded-lg border border-white/12 bg-ink-800 font-mono text-[0.6rem] uppercase tracking-wider text-fog-300 md:size-16"
            initial={{ x: (t.x === 1 ? -1 : 1) * 18, y: (t.y === 1 ? -1 : 1) * 18, opacity: 0 }}
            animate={{ x: [(t.x === 1 ? -1 : 1) * 18, 0, 0], y: [(t.y === 1 ? -1 : 1) * 18, 0, 0], opacity: [0, 1, 1] }}
            transition={{ duration: 3.6, delay: i * 0.12, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.3, 1], ease: [0.16, 1, 0.3, 1] }}
          >
            {t.label}
          </m.div>
        ))}
      </div>
      <div className="relative flex flex-col gap-4">
        <div className="absolute -left-[42%] top-1/2 h-px w-[42%] bg-gradient-to-r from-white/5 to-cyan/60" />
        {[Printer, Scale].map((Icon, i) => (
          <m.span
            key={i}
            className="grid size-12 place-items-center rounded-xl border border-cyan/30 bg-cyan/[0.06] text-cyan"
            animate={{ boxShadow: ["0 0 0 0 rgb(63 216 232 / 0)", "0 0 0 6px rgb(63 216 232 / 0.12)", "0 0 0 0 rgb(63 216 232 / 0)"] }}
            transition={{ duration: 2.4, delay: 1 + i * 0.4, repeat: Infinity }}
          >
            <Icon className="size-5" />
          </m.span>
        ))}
        <m.span
          className="absolute -right-3 -top-3 grid size-5 place-items-center rounded-full bg-emerald-400/90 text-ink-950"
          animate={{ scale: [0, 0, 1, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 0.6, times: [0, 0.5, 0.6, 1] }}
        >
          <Check className="size-3" />
        </m.span>
      </div>
    </div>
  );
}

const VISUALS: Record<VisualKind, () => React.JSX.Element> = {
  web: WebVisual,
  automation: AutomationVisual,
  ai: AiVisual,
  crm: CrmVisual,
  ecommerce: EcommerceVisual,
  custom: CustomVisual,
};
