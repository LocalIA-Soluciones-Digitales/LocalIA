"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { Bell, Bot, Check, ChefHat, CreditCard, Mail, MessageCircle, Printer, QrCode, Scale, Search, ShoppingBag, UserPlus } from "lucide-react";
import type { ServiceVisual as VisualKind } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Cada servicio se cuenta en tres pasos que se reproducen solos mientras la
 * pieza está en pantalla. Los pasos de abajo dicen qué está pasando y se
 * pueden pulsar; con reduced-motion no avanza solo.
 */
const STEP_MS = 2800;
const EASE = [0.16, 1, 0.3, 1] as const;
/** Tamaño de diseño de las escenas: se escalan al ancho real, igual en móvil y escritorio. */
const STAGE_W = 660;
const STAGE_H = 412;

export function ServiceVisual({ kind, className }: { kind: VisualKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const { steps, Scene } = VISUALS[kind];

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / STAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
  }, []);

  useEffect(() => {
    if (!inView || !auto) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => clearInterval(id);
  }, [inView, auto, steps.length]);

  return (
    <div ref={ref} className={cn("overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900", className)}>
      <div ref={stageRef} aria-hidden className="relative w-full overflow-hidden" style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgb(77_124_255/0.16),transparent)]" />
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
          {inView && <Scene step={step} />}
        </div>
      </div>

      <ol className="grid grid-cols-3 border-t border-white/[0.07]">
        {steps.map((s, i) => {
          const on = i === step;
          return (
            <li key={s} className="border-white/[0.07] [&:not(:first-child)]:border-l">
              <button
                type="button"
                onClick={() => {
                  setAuto(false);
                  setStep(i);
                }}
                aria-pressed={on}
                className="group relative flex h-full w-full flex-col items-start gap-1.5 px-2.5 py-3 text-left sm:flex-row sm:gap-2.5 sm:px-3 sm:py-3.5 md:px-4"
              >
                <span
                  className={cn(
                    "mt-px grid size-5 shrink-0 place-items-center rounded-full font-mono text-[0.6rem] transition-colors duration-300",
                    on ? "bg-white text-ink-950" : i < step ? "bg-white/15 text-fog-100" : "bg-white/[0.06] text-fog-500",
                  )}
                >
                  {i + 1}
                </span>
                <span className={cn("text-[0.72rem] leading-snug transition-colors duration-300 sm:text-[0.78rem] md:text-[0.82rem]", on ? "text-white" : "text-fog-500 group-hover:text-fog-300")}>
                  {s}
                </span>
                {on && (
                  <m.span
                    key={`${step}-${auto}`}
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-signal-bright to-cyan"
                    initial={{ scaleX: auto ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: auto ? STEP_MS / 1000 : 0, ease: "linear" }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

type SceneProps = { step: number };

/* ---------- Piezas comunes ---------- */

function Toast({ icon: Icon, title, text, tone = "signal", className }: { icon: typeof Bell; title: string; text: string; tone?: "signal" | "emerald" | "violet" | "amber"; className?: string }) {
  const tones = {
    signal: "bg-signal text-white",
    emerald: "bg-emerald-500 text-white",
    violet: "bg-violet text-white",
    amber: "bg-amber-400 text-ink-950",
  };
  return (
    <m.div
      initial={{ opacity: 0, y: -14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn("absolute z-20 flex items-start gap-3 rounded-2xl bg-white/[0.96] p-3 text-ink-950 shadow-[0_18px_50px_-12px_rgb(0_0_0/0.7)]", className)}
    >
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", tones[tone])}>
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.78rem] font-semibold leading-tight">{title}</span>
        <span className="mt-0.5 block text-[0.72rem] leading-snug text-ink-600">{text}</span>
      </span>
    </m.div>
  );
}

function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("absolute rounded-[1.4rem] bg-ink-700 p-[5px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/15", className)}>
      <div className="relative h-full w-full overflow-hidden rounded-[1.1rem] bg-ink-900">{children}</div>
    </div>
  );
}

function Browser({ url, children, className }: { url: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("absolute overflow-hidden rounded-lg bg-ink-800 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10", className)}>
      <div className="flex h-6 items-center gap-1 border-b border-white/[0.06] bg-ink-850 px-2">
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/10" />
        <span className="size-1.5 rounded-full bg-white/10" />
        <span className="mx-auto truncate rounded bg-white/[0.06] px-2 font-mono text-[0.55rem] text-fog-400">{url}</span>
      </div>
      <div className="relative h-[calc(100%-1.5rem)]">{children}</div>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.5, ease: EASE },
};

/* ---------- 01 · Desarrollo web: te encuentran → ven tu web → te escriben ---------- */

function WebScene({ step }: SceneProps) {
  const query = "electricista urgente barakaldo";
  return (
    <div className="absolute inset-0">
      {/* Paso 1: búsqueda en Google */}
      <AnimatePresence>
        {step === 0 && (
          <m.div {...fade} className="absolute inset-x-[10%] top-[16%] space-y-3">
            <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-ink-950 shadow-lg">
              <Search className="size-4 text-ink-500" />
              <m.span
                className="overflow-hidden whitespace-nowrap text-sm"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 1, ease: "linear" }}
              >
                {query}
              </m.span>
            </div>
            {[0, 1].map((i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.15, duration: 0.45, ease: EASE }}
                className={cn("rounded-xl p-3.5", i === 0 ? "bg-white/[0.08] ring-1 ring-signal-bright/60" : "bg-white/[0.03]")}
              >
                <p className="font-mono text-[0.62rem] text-fog-400">{i === 0 ? "electricbarakaldo.com › urgencias" : "otro-resultado.es"}</p>
                <p className={cn("mt-1 text-sm font-medium", i === 0 ? "text-signal-bright" : "text-fog-500")}>
                  {i === 0 ? "Electricista urgente 24h en Barakaldo y toda Euskadi" : "Directorio de profesionales"}
                </p>
                {i === 0 && <p className="mt-1 text-xs text-fog-300">Averías, cuadros eléctricos e instalaciones. Presupuesto claro.</p>}
              </m.div>
            ))}
          </m.div>
        )}
      </AnimatePresence>

      {/* Pasos 2 y 3: la web real en escritorio y móvil */}
      <AnimatePresence>
        {step > 0 && (
          <m.div {...fade} className="absolute inset-0">
            <Browser url="electricbarakaldo.com" className="left-[6%] top-[10%] w-[66%] aspect-[16/10]">
              <Image src="/projects/electric-instalaciones-electricas/desktop-home.jpg" alt="" fill sizes="420px" className="object-cover object-top" />
            </Browser>
            <Phone className="bottom-[6%] right-[8%] aspect-[780/1400] w-[24%]">
              <Image src="/projects/electric-instalaciones-electricas/mobile-home.jpg" alt="" fill sizes="160px" className="object-cover object-top" />
              {step === 2 && (
                <m.span
                  className="absolute bottom-[6%] right-[8%] size-6 rounded-full bg-white/40 ring-2 ring-white"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.2, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9 }}
                />
              )}
            </Phone>
            <div className="absolute bottom-[8%] left-[6%] flex flex-wrap gap-1.5">
              {["Diseño propio", "Rápida en móvil", "SEO local"].map((c, i) => (
                <m.span
                  key={c}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-fog-300 ring-1 ring-inset ring-white/10"
                >
                  {c}
                </m.span>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {step === 2 && (
          <Toast
            icon={MessageCircle}
            tone="emerald"
            title="WhatsApp · nuevo aviso"
            text="Avería urgente · salta el diferencial · Barakaldo · con foto"
            className="right-[5%] top-[7%] w-[54%]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 02 · Automatización: venta en báscula → stock web → aviso ---------- */

function AutomationScene({ step }: SceneProps) {
  const stock = step === 0 ? "8,4" : "4,2";
  return (
    <div className="absolute inset-0">
      {/* Báscula */}
      <div className="absolute left-[6%] top-[14%] w-[38%] rounded-xl border border-white/10 bg-ink-850 p-3.5">
        <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fog-400">
          <Scale className="size-3.5 text-cyan" /> Báscula · tienda 1
        </div>
        <div className="mt-3 rounded-lg bg-black/60 px-3 py-2.5 font-mono">
          <p className="text-[0.62rem] text-emerald-300/80">ANCHOAS</p>
          <p className="mt-0.5 text-xl text-emerald-300">4,200 kg</p>
        </div>
        <m.div
          key={step === 0 ? "venta" : "hecho"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "mt-3 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-[0.7rem] font-medium",
            step === 0 ? "bg-cyan/15 text-cyan" : "bg-white/[0.05] text-fog-400",
          )}
        >
          {step === 0 ? "Venta registrada" : <><Check className="size-3" /> Sincronizada</>}
        </m.div>
      </div>

      {/* Conexión */}
      <div className="absolute left-[44%] right-[47%] top-[30%] h-px bg-white/10">
        {step >= 1 && (
          <m.span
            key={step}
            className="absolute -top-[3px] size-[7px] rounded-full bg-cyan shadow-[0_0_12px_rgb(63_216_232/0.9)]"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Ficha en la web */}
      <Browser url="pescaderiaarrantza.com" className="right-[6%] top-[10%] w-[41%]">
        <div className="bg-[#f6f2ec] p-2.5 text-ink-950">
          {/* Foto de la primera ficha del catálogo real (recorte de la captura) */}
          <div
            className="aspect-[4/3] rounded-md bg-no-repeat"
            style={{
              backgroundImage: "url(/projects/pescados-mariscos-arrantza/desktop-productos.jpg)",
              backgroundSize: `${(1440 / 312) * 100}% auto`,
              backgroundPosition: `${(48 / (1440 - 312)) * 100}% ${(430 / (900 - 234)) * 100}%`,
            }}
          />
          <p className="mt-2 font-serif text-sm">Anchoas</p>
          <div className="mt-1 flex items-center justify-between text-[0.68rem]">
            <span className="text-ink-600">Disponible</span>
            <m.span
              key={stock}
              initial={{ scale: 1.25, color: "#0e7490" }}
              animate={{ scale: 1, color: "#12151a" }}
              transition={{ duration: 0.6 }}
              className="font-semibold"
            >
              {stock} kg
            </m.span>
          </div>
        </div>
      </Browser>

      <div className="absolute inset-x-[6%] bottom-[8%] flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fog-500">
        <span className="size-1.5 rounded-full bg-emerald-400" /> Sin que nadie toque nada
      </div>

      <AnimatePresence>
        {step === 2 && (
          <Toast icon={Mail} tone="amber" title="Stock bajo · Anchoas" text="Quedan 4,2 kg, por debajo del mínimo de 5 kg." className="bottom-[16%] left-[22%] w-[56%]" />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 03 · IA: email → la IA lo entiende → ficha creada ---------- */

function AiScene({ step }: SceneProps) {
  const fields = [
    ["Tipo", "Presupuesto"],
    ["Urgencia", "Alta"],
    ["Zona", "Barakaldo"],
  ];
  const mark = (t: string, d: number) => (
    <m.span
      className="rounded px-0.5"
      animate={{ backgroundColor: step >= 1 ? "rgb(157 125 255 / 0.35)" : "rgb(157 125 255 / 0)" }}
      transition={{ delay: step >= 1 ? d : 0, duration: 0.4 }}
    >
      {t}
    </m.span>
  );
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[6%] top-[10%] w-[52%] rounded-xl border border-white/10 bg-ink-850 p-3.5">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2.5">
          <span className="grid size-7 place-items-center rounded-full bg-white/10 text-[0.62rem] font-semibold text-fog-100">LG</span>
          <div className="min-w-0">
            <p className="text-[0.72rem] font-medium text-fog-100">Laura G.</p>
            <p className="truncate text-[0.62rem] text-fog-500">Asunto: cuadro eléctrico</p>
          </div>
          <Mail className="ml-auto size-3.5 text-fog-500" />
        </div>
        <p className="mt-2.5 text-[0.74rem] leading-relaxed text-fog-300">
          Hola, necesitaría un {mark("presupuesto", 0.1)} para cambiar el cuadro eléctrico, {mark("salta todo el rato", 0.35)}. Estoy en{" "}
          {mark("Barakaldo", 0.6)}.
        </p>
      </div>

      <AnimatePresence>
        {step >= 1 && (
          <m.div {...fade} className="absolute right-[6%] top-[14%] w-[34%] rounded-xl border border-violet/30 bg-violet/[0.07] p-3">
            <p className="flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-violet">
              <Bot className="size-3.5" /> La IA lo entiende
            </p>
            <div className="mt-2 space-y-1.5">
              {fields.map(([k, v], i) => (
                <m.div
                  key={k}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.2 }}
                  className="flex justify-between text-[0.7rem]"
                >
                  <span className="text-fog-500">{k}</span>
                  <span className="font-medium text-fog-50">{v}</span>
                </m.div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === 2 && (
          <m.div {...fade} className="absolute bottom-[9%] left-[6%] right-[6%] flex items-center gap-3 rounded-xl bg-white/[0.96] p-3 text-ink-950 shadow-xl">
            <span className="grid size-8 place-items-center rounded-lg bg-signal text-white">
              <UserPlus className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.78rem] font-semibold">Ficha creada en tu CRM</p>
              <p className="text-[0.7rem] text-ink-600">Laura G. · Presupuesto cuadro · Barakaldo</p>
            </div>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[0.62rem] font-semibold text-rose-700">Urgente</span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 04 · CRM y gestión: entra un pedido → lo preparas → lo ves todo ---------- */

function CrmScene({ step }: SceneProps) {
  const rows = [
    { id: "Pedido #128", who: "Restaurante Itsaso", state: step === 0 ? "Nuevo" : step === 1 ? "Preparando" : "Listo", fresh: true },
    { id: "Pedido #127", who: "Amaia R.", state: "Listo" },
    { id: "Reserva", who: "Mesa 4 · 21:00", state: "Confirmada" },
  ];
  const chip: Record<string, string> = {
    Nuevo: "bg-signal/20 text-signal-bright",
    Preparando: "bg-amber-400/15 text-amber-300",
    Listo: "bg-emerald-400/15 text-emerald-300",
    Confirmada: "bg-white/[0.07] text-fog-300",
  };
  const bars = [38, 52, 44, 61, 57, step === 2 ? 82 : 66];
  return (
    <div className="absolute inset-[7%] flex flex-col gap-3 rounded-xl border border-white/10 bg-ink-850/90 p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">Hoy</p>
        <span className="flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-fog-500">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-400" /> en tiempo real
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Pedidos", step === 0 ? "11" : "12"],
          ["Reservas", "7"],
          ["Stock bajo", "2"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-white/[0.04] px-2.5 py-2">
            <p className="text-[0.6rem] text-fog-500">{k}</p>
            <m.p key={v} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-lg font-semibold tracking-tight text-white">
              {v}
            </m.p>
          </div>
        ))}
      </div>
      <div className="flex flex-1 gap-3">
        <ul className="flex-1 space-y-1.5">
          {rows.map((r, i) => (
            <m.li
              key={r.id}
              initial={r.fresh ? { opacity: 0, x: -14 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={cn("flex items-center justify-between rounded-md px-2.5 py-1.5", i === 0 ? "bg-white/[0.07] ring-1 ring-signal/40" : "bg-white/[0.03]")}
            >
              <span className="min-w-0">
                <span className="block text-[0.7rem] font-medium text-fog-100">{r.id}</span>
                <span className="block truncate text-[0.6rem] text-fog-500">{r.who}</span>
              </span>
              <m.span key={r.state} initial={{ scale: 0.85 }} animate={{ scale: 1 }} className={cn("rounded-full px-2 py-0.5 text-[0.6rem] font-medium", chip[r.state])}>
                {r.state}
              </m.span>
            </m.li>
          ))}
        </ul>
        <div className="flex w-[32%] items-end gap-1 rounded-md bg-white/[0.03] p-2">
          {bars.map((h, i) => (
            <m.span
              key={i}
              className={cn("flex-1 rounded-sm", i === bars.length - 1 ? "bg-gradient-to-t from-signal to-cyan" : "bg-white/15")}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 05 · E-commerce: eligen → pagan → te avisa ---------- */

function EcommerceScene({ step }: SceneProps) {
  return (
    <div className="absolute inset-0">
      <Phone className="left-[8%] top-[7%] aspect-[780/1400] w-[30%]">
        <Image src="/projects/amway-barakaldo/mobile-catalogo.jpg" alt="" fill sizes="180px" className="object-cover object-top" />
        <AnimatePresence>
          {step >= 1 && (
            <m.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="absolute inset-x-0 bottom-0 rounded-t-xl bg-white p-2.5 text-ink-950"
            >
              <p className="text-[0.6rem] text-ink-500">Total</p>
              <p className="text-sm font-semibold">34,90 €</p>
              <div
                className={cn(
                  "mt-1.5 flex items-center justify-center gap-1 rounded-md py-1.5 text-[0.6rem] font-semibold text-white transition-colors duration-500",
                  step === 2 ? "bg-emerald-600" : "bg-[#635bff]",
                )}
              >
                {step === 2 ? <><Check className="size-3" /> Pagado</> : <><CreditCard className="size-3" /> Pagar</>}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </Phone>

      {/* Carrito */}
      <div className="absolute right-[8%] top-[12%] w-[46%] rounded-xl border border-white/10 bg-ink-850 p-3.5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-medium text-white">
            <ShoppingBag className="size-4" /> Carrito
          </p>
          <m.span key={step} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="grid size-5 place-items-center rounded-full bg-signal font-mono text-[0.6rem] text-white">
            {step === 0 ? 0 : 2}
          </m.span>
        </div>
        <ul className="mt-3 space-y-1.5 text-[0.7rem]">
          {[
            ["XS Energy · pack", "21,90 €"],
            ["Crema de manos", "13,00 €"],
          ].map(([n, e], i) => (
            <m.li
              key={n}
              animate={{ opacity: step === 0 ? 0.25 : 1, x: step === 0 ? -6 : 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex justify-between rounded-md bg-white/[0.04] px-2.5 py-1.5"
            >
              <span className="text-fog-300">{n}</span>
              <span className="text-fog-100">{e}</span>
            </m.li>
          ))}
        </ul>
        <p className="mt-3 text-[0.62rem] text-fog-500">Recogida en tienda · pago con tarjeta</p>
      </div>

      <AnimatePresence>
        {step === 2 && <Toast icon={Bell} title="Nuevo pedido · 34,90 €" text="Pagado con tarjeta · recogida en tienda" className="bottom-[10%] right-[8%] w-[46%]" />}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 06 · A medida: pedido desde la mesa → cocina → comanda impresa ---------- */

function CustomScene({ step }: SceneProps) {
  return (
    <div className="absolute inset-0">
      {/* Mesa con QR */}
      <div className="absolute left-[6%] top-[16%] w-[26%] rounded-xl border border-white/10 bg-ink-850 p-3 text-center">
        <QrCode className="mx-auto size-10 text-fog-100" strokeWidth={1.3} />
        <p className="mt-2 text-[0.7rem] font-medium text-fog-100">Mesa 12</p>
        <m.p animate={{ color: step === 0 ? "#3fd8e8" : "#656b76" }} className="text-[0.62rem]">
          {step === 0 ? "Pidiendo…" : "Pedido enviado"}
        </m.p>
      </div>

      {/* Tablero de cocina */}
      <div className="absolute left-[37%] top-[10%] w-[30%] rounded-xl border border-white/10 bg-ink-850 p-2.5">
        <p className="flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-fog-400">
          <ChefHat className="size-3.5" /> Cocina
        </p>
        <AnimatePresence>
          {step >= 1 && (
            <m.div {...fade} className="mt-2 rounded-lg bg-white/[0.06] p-2 ring-1 ring-cyan/40">
              <p className="text-[0.68rem] font-semibold text-white">Mesa 12</p>
              <p className="text-[0.62rem] text-fog-300">1 × Niku roll</p>
              <p className="text-[0.62rem] text-fog-300">2 × Gyozas</p>
            </m.div>
          )}
        </AnimatePresence>
        {step < 1 && <div className="mt-2 rounded-lg border border-dashed border-white/10 py-4 text-center text-[0.6rem] text-fog-500">Sin comandas</div>}
      </div>

      {/* Impresora térmica */}
      <div className="absolute right-[6%] top-[12%] w-[25%]">
        <div className="relative z-10 rounded-xl border border-white/10 bg-ink-700 px-3 pb-3 pt-2.5">
          <p className="flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-fog-400">
            <Printer className="size-3.5" /> Impresora
          </p>
          <div className="mt-2.5 h-1.5 rounded-full bg-black/70" />
          <m.span
            className="absolute right-3 top-3 size-1.5 rounded-full"
            animate={{ backgroundColor: step === 2 ? "#34d399" : "#353b46" }}
          />
        </div>
        <m.div
          className="mx-[10%] -mt-1 overflow-hidden rounded-b-sm bg-[#f4f1ea] font-mono text-[0.56rem] leading-relaxed text-ink-950 shadow-lg"
          animate={{ height: step === 2 ? "auto" : 0 }}
          initial={{ height: 0 }}
          transition={{ duration: 1.1, ease: "linear" }}
        >
          <div className="space-y-0.5 p-2">
            <p className="text-center font-semibold">COCINA</p>
            <p>MESA 12 · 21:47</p>
            <p className="border-t border-dashed border-ink-500/40 pt-1">1 NIKU ROLL</p>
            <p>2 GYOZAS</p>
          </div>
        </m.div>
      </div>

      {/* Flechas de flujo */}
      {[
        ["32%", "37%", 1],
        ["67%", "69%", 2],
      ].map(([l, r, s]) => (
        <div key={String(s)} className="absolute top-[26%] h-px bg-white/10" style={{ left: l as string, right: `calc(100% - ${r})` }}>
          {step >= (s as number) && (
            <m.span
              className="absolute -top-[3px] size-[7px] rounded-full bg-cyan shadow-[0_0_10px_rgb(63_216_232/0.9)]"
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      ))}

      <p className="absolute inset-x-[6%] bottom-[8%] text-[0.7rem] leading-relaxed text-fog-400">
        Un servicio propio conecta la web con la impresora de cocina: la comanda sale sola, sin depender del navegador.
      </p>
    </div>
  );
}

const VISUALS: Record<VisualKind, { steps: string[]; Scene: (p: SceneProps) => React.JSX.Element }> = {
  web: { steps: ["Te encuentran en Google", "Ven una web clara en el móvil", "Te escriben por WhatsApp"], Scene: WebScene },
  automation: { steps: ["Se vende en la báscula", "La web descuenta el stock", "Te avisa si queda poco"], Scene: AutomationScene },
  ai: { steps: ["Llega un email", "La IA entiende qué piden", "Queda registrado en el CRM"], Scene: AiScene },
  crm: { steps: ["Entra un pedido", "Lo preparas y cambia de estado", "Ves el día entero de un vistazo"], Scene: CrmScene },
  ecommerce: { steps: ["Eligen en el catálogo", "Pagan con tarjeta", "Te llega el aviso al móvil"], Scene: EcommerceScene },
  custom: { steps: ["Piden desde la mesa", "Cocina lo recibe al instante", "La comanda se imprime sola"], Scene: CustomScene },
};
