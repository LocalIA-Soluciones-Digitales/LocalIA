"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import type { ProjectDemo } from "@/data/projects";
import { cn, formatClock } from "@/lib/utils";

interface DemoPlayerProps {
  demo: ProjectDemo;
  /** Nombre del proyecto, para las etiquetas accesibles. */
  title: string;
  accent: string;
  /** Reproduce al montar. Solo debe usarse tras un gesto del usuario. */
  autoStart?: boolean;
  /** Segundo desde el que empezar al reproducir. */
  startAt?: number;
  className?: string;
}

/**
 * Vídeo de demostración con índice de capítulos.
 *
 * - Solo descarga el vídeo cuando el usuario pulsa reproducir; hasta entonces
 *   el coste es el póster.
 * - Los capítulos (los textos que salen en pantalla) son también la
 *   alternativa textual del vídeo, y permiten saltar a cada escena.
 * - Tras empezar, el foco pasa al vídeo y quedan los controles nativos.
 */
export function DemoPlayer({ demo, title, accent, autoStart = false, startAt, className }: DemoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  // Al empezar desde el botón grande, el foco pasa al vídeo (el botón
  // desaparece). Desde un capítulo, el foco se queda en el capítulo.
  const focusVideo = useRef(false);
  // En móvil los capítulos se pliegan para no empujar el resto de la página.
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const chaptersId = useId();

  useEffect(() => {
    if (started && focusVideo.current) ref.current?.focus({ preventScroll: true });
  }, [started]);

  const start = (at?: number, focus = false) => {
    const el = ref.current;
    if (!el) return;
    if (!el.getAttribute("src")) {
      el.setAttribute("src", demo.src);
      el.load();
    }
    if (at != null) {
      if (el.readyState >= 1) el.currentTime = at;
      else el.addEventListener("loadedmetadata", () => (el.currentTime = at), { once: true });
    }
    focusVideo.current = focus;
    setStarted(true);
    el.play().catch(() => {});
  };

  useEffect(() => {
    if (autoStart) start(startAt);
    // Solo al montar: el componente se monta de nuevo al cambiar de vídeo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTime = () => {
    const t = ref.current?.currentTime ?? 0;
    let i = 0;
    while (i + 1 < demo.chapters.length && demo.chapters[i + 1].start <= t + 0.05) i++;
    setCurrent(i);
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8", className)}>
      <div
        className="group relative aspect-video overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-white/10"
        style={{ boxShadow: `0 40px 120px -40px rgb(0 0 0 / 0.9), 0 30px 90px -60px ${accent}` }}
      >
        <video
          ref={ref}
          className="h-full w-full object-cover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fog-50"
          poster={demo.poster}
          controls={started}
          playsInline
          preload="none"
          aria-label={`Vídeo de demostración de ${title}`}
          onTimeUpdate={onTime}
          onSeeked={onTime}
        >
          <track kind="chapters" src={demo.chaptersTrack} srcLang="es" label="Capítulos" default />
        </video>
        {!started && (
          <button
            type="button"
            onClick={() => start(startAt, true)}
            className="absolute inset-0 flex items-center justify-center bg-ink-950/25 transition-colors hover:bg-ink-950/10 focus-visible:outline-none"
            aria-label={`Reproducir el vídeo de ${title}, ${formatClock(demo.duration)}`}
          >
            <span className="flex items-center gap-3 rounded-full bg-fog-50 py-3 pl-3.5 pr-5 text-sm font-medium text-ink-950 shadow-[0_20px_60px_-10px_rgb(0_0_0/0.7)] ring-4 ring-white/15 transition-transform duration-300 group-hover:scale-105 group-has-[:focus-visible]:ring-fog-50/70 motion-reduce:transition-none md:py-3.5 md:text-base">
              <span className="flex size-9 items-center justify-center rounded-full md:size-10" style={{ backgroundColor: accent }}>
                <Play aria-hidden className="ml-0.5 size-4 fill-ink-950 text-ink-950" />
              </span>
              Ver el vídeo · {formatClock(demo.duration)}
            </span>
          </button>
        )}
      </div>

      <nav aria-label={`Capítulos del vídeo de ${title}`} className="relative min-h-0">
        <button
          type="button"
          onClick={() => setChaptersOpen((o) => !o)}
          aria-expanded={chaptersOpen}
          aria-controls={chaptersId}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-fog-100 ring-1 ring-inset ring-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fog-50 lg:hidden"
        >
          Capítulos ({demo.chapters.length})
          <ChevronDown aria-hidden className={cn("size-4 transition-transform motion-reduce:transition-none", chaptersOpen && "rotate-180")} />
        </button>
        <ol id={chaptersId} className={cn("mt-2 space-y-1 lg:absolute lg:inset-0 lg:mt-0 lg:block lg:overflow-y-auto lg:pr-1", !chaptersOpen && "hidden")}>
          {demo.chapters.map((c, i) => {
            const active = started && i === current;
            return (
              <li key={c.start}>
                <button
                  type="button"
                  onClick={() => start(c.start)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative w-full rounded-xl px-4 py-3 text-left transition-colors motion-reduce:transition-none",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fog-50",
                    active ? "bg-white/[0.06]" : "hover:bg-white/[0.035]",
                  )}
                >
                  <span aria-hidden className="absolute inset-y-3 left-0 w-0.5 rounded-full transition-opacity" style={{ backgroundColor: accent, opacity: active ? 1 : 0 }} />
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-xs tabular-nums text-fog-400">{formatClock(c.start)}</span>
                    <span className={cn("text-sm font-medium", active ? "text-white" : "text-fog-100")}>{c.title}</span>
                  </span>
                  <span className="mt-1 block pl-[3.25rem] text-xs leading-relaxed text-fog-400">{c.text}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
