"use client";

import { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Hand, MousePointerClick, Play } from "lucide-react";
import { BrowserFrame, PhoneFrame, PHONE_SCREEN_ASPECT } from "@/components/projects/DeviceFrames";
import { ScrollScreen } from "@/components/projects/ScrollScreen";
import { Button } from "@/components/ui/Button";
import { SERVICE_LABELS } from "@/data/services";
import type { Project } from "@/data/projects";
import { cn, prettyUrl } from "@/lib/utils";

interface Props {
  project: Project;
  index: number;
  total: number;
  headingLevel?: "h2" | "h3";
}

/**
 * Pieza principal del portfolio: la web real "se navega" dentro del
 * navegador y del móvil a medida que el visitante hace scroll. Con
 * «Explorar tú» las pantallas pasan a tener scroll propio y el visitante
 * recorre la web a su ritmo.
 */
export function ProjectShowcase({ project: p, index, total, headingLevel: Heading = "h3" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reversed = index % 2 === 1;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Recorrido automático suave: poca distancia repartida en mucho scroll.
  const screen = useTransform(scrollYProgress, [0.15, 0.85], [0, 1], { clamp: true });
  const phoneScreen = useTransform(scrollYProgress, [0.2, 0.9], [0, 1], { clamp: true });
  const [explore, setExplore] = useState(false);

  useEffect(() => {
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExplore(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [explore]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.45, 0.75, 1], [0, 1, 1, 0]);

  return (
    <article
      ref={ref}
      aria-labelledby={`p-${p.slug}`}
      className="relative py-20 md:py-28"
      style={{ ["--accent" as string]: p.theme.accent }}
    >
      {/* Identidad del proyecto: un brillo de su color de marca */}
      <m.div
        aria-hidden
        style={{ opacity: glowOpacity }}
        className={cn(
          "pointer-events-none absolute top-1/2 -z-10 h-[70%] w-[70%] -translate-y-1/2 rounded-full blur-3xl",
          reversed ? "right-0" : "left-0",
        )}
      >
        <div className="h-full w-full rounded-full" style={{ background: `radial-gradient(closest-side, ${p.theme.accent}26, transparent)` }} />
      </m.div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Composición de dispositivos */}
        <div className={cn("relative pb-[12%] pr-[8%] lg:col-span-8 lg:pb-[8%]", reversed && "lg:order-2 lg:pl-[8%] lg:pr-0")}>
          <BrowserFrame url={p.productionUrl ? prettyUrl(p.productionUrl) : undefined} accent={p.theme.accent}>
            <ScrollScreen
              image={p.fullPage.desktop}
              frameAspect={16 / 10}
              progress={screen}
              maxShift={40}
              explore={explore}
              label={`Web de ${p.name} en escritorio`}
              sizes="(min-width: 1320px) 800px, (min-width: 1024px) 60vw, 92vw"
            />
            {!explore && (
              <button
                type="button"
                onClick={() => setExplore(true)}
                className="group/explore absolute inset-0 hidden cursor-pointer items-center justify-center md:flex"
                aria-label={`Explorar la web de ${p.name}`}
              >
                <span className="flex translate-y-2 items-center gap-2 rounded-full bg-ink-950/80 px-4 py-2.5 text-sm font-medium text-white opacity-0 ring-1 ring-white/15 backdrop-blur-md transition duration-300 group-hover/explore:translate-y-0 group-hover/explore:opacity-100 group-focus-visible/explore:translate-y-0 group-focus-visible/explore:opacity-100">
                  <MousePointerClick aria-hidden className="size-4" /> Explorar esta web
                </span>
              </button>
            )}
          </BrowserFrame>
          <m.div
            style={{ y: phoneY }}
            className={cn("absolute bottom-0 w-[27%] min-w-[104px] max-w-[230px]", reversed ? "right-0 lg:left-0 lg:right-auto" : "right-0")}
          >
            <PhoneFrame>
              <ScrollScreen
                image={p.fullPage.mobile}
                frameAspect={PHONE_SCREEN_ASPECT}
                progress={phoneScreen}
                maxShift={45}
                explore={explore}
                label={`Web de ${p.name} en móvil`}
                sizes="(min-width: 1024px) 230px, 28vw"
              />
            </PhoneFrame>
          </m.div>

          <ScreenModeToggle explore={explore} onChange={setExplore} accent={p.theme.accent} className={reversed ? "lg:left-auto lg:right-0" : undefined} />
        </div>

        {/* Texto */}
        <div className={cn("lg:col-span-4", reversed && "lg:order-1")}>
          <div className="flex items-center gap-3 font-mono text-xs text-fog-500">
            <span style={{ color: p.theme.accent }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="h-px w-6 bg-white/15" />
            <span className="uppercase tracking-[0.14em]">{p.sector}</span>
          </div>
          <Heading id={`p-${p.slug}`} className="mt-5 text-[2.1rem] font-medium leading-[1.02] tracking-[-0.045em] text-white md:text-[2.8rem]">
            {p.name}
          </Heading>
          <p className="serif-accent mt-3 text-[1.35rem] leading-snug text-fog-300 md:text-[1.55rem]">{p.tagline}</p>
          <p className="mt-6 text-[0.98rem] leading-relaxed text-fog-400">{p.shortDescription}</p>

          <ul className="mt-7 space-y-2.5 border-t border-white/[0.07] pt-6 text-sm">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-fog-100">
                <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: p.theme.accent }} />
                {h}
              </li>
            ))}
          </ul>

          <p className="mt-6 font-mono text-[0.72rem] leading-relaxed text-fog-500">
            {p.services.slice(0, 4).map((s) => SERVICE_LABELS[s]).join("  ·  ")}
          </p>
          <p className="mt-2 font-mono text-[0.72rem] leading-relaxed text-fog-500">
            {p.technologies.slice(0, 5).join(" / ")}
            {p.technologies.length > 5 && ` +${p.technologies.length - 5}`}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href={`/proyectos/${p.slug}`}>Ver caso</Button>
            {p.productionUrl && (
              <Button href={p.productionUrl} external variant="ghost">
                Ver proyecto
              </Button>
            )}
          </div>
        </div>
      </div>
      <span className="sr-only">
        Proyecto {index + 1} de {total}
      </span>
    </article>
  );
}

/** Conmutador entre el recorrido automático y la navegación libre de las pantallas. */
function ScreenModeToggle({
  explore,
  onChange,
  accent,
  className,
}: {
  explore: boolean;
  onChange: (v: boolean) => void;
  accent: string;
  className?: string;
}) {
  const options = [
    { value: false, label: "Automático", Icon: Play },
    { value: true, label: "Explorar tú", Icon: Hand },
  ];
  return (
    <div className={cn("absolute -bottom-2 left-0 flex flex-wrap items-center gap-x-4 gap-y-2 lg:-bottom-4", className)}>
      <div role="radiogroup" aria-label="Cómo recorrer la web" className="inline-flex rounded-full bg-white/[0.04] p-1 ring-1 ring-inset ring-white/10">
        {options.map(({ value, label, Icon }) => {
          const on = explore === value;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300",
                on ? "bg-white text-ink-950" : "text-fog-400 hover:text-white",
              )}
            >
              <Icon aria-hidden className="size-3.5" />
              {label}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="hidden text-xs text-fog-500 sm:block">
        {explore ? (
          <>
            <span aria-hidden style={{ color: accent }}>●</span> Rueda, arrastra o desliza dentro de las pantallas
          </>
        ) : (
          "Se recorre sola al hacer scroll"
        )}
      </p>
    </div>
  );
}
