"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoPlayer } from "@/components/projects/DemoPlayer";
import type { ProjectDemo } from "@/data/projects";
import { cn, formatClock } from "@/lib/utils";

export interface GalleryVideo {
  slug: string;
  name: string;
  sector: string;
  location: string;
  tagline: string;
  accent: string;
  demo: ProjectDemo;
}

/**
 * Todos los vídeos en una página: un reproductor y la lista para cambiar.
 * El vídeo elegido va en la URL (?v=slug, y opcionalmente &t=segundos) para
 * poder compartir un enlace directo a un proyecto o a un capítulo.
 */
export function VideoGallery({ videos }: { videos: GalleryVideo[] }) {
  const [slug, setSlug] = useState(videos[0].slug);
  const [startAt, setStartAt] = useState<number>();
  const [autoStart, setAutoStart] = useState(false);
  const [announce, setAnnounce] = useState("");
  const playerRef = useRef<HTMLDivElement>(null);
  const active = videos.find((v) => v.slug === slug) ?? videos[0];

  // Enlace directo: se lee al montar (la página es estática).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const v = videos.find((x) => x.slug === q.get("v"));
    if (!v) return;
    setSlug(v.slug);
    const t = Number(q.get("t"));
    if (Number.isFinite(t) && t > 0) setStartAt(Math.min(t, v.demo.duration - 1));
  }, [videos]);

  const select = (v: GalleryVideo) => {
    if (v.slug === slug) return;
    setSlug(v.slug);
    setStartAt(undefined);
    setAutoStart(true);
    setAnnounce(`Reproduciendo el vídeo de ${v.name}`);
    window.history.replaceState(null, "", `?v=${v.slug}`);
    const el = playerRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <div>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      <div ref={playerRef} className="scroll-mt-28">
        <DemoPlayer key={active.slug} demo={active.demo} title={active.name} accent={active.accent} autoStart={autoStart} startAt={startAt} />
        <div className="mt-8 flex flex-col gap-4 border-b border-white/[0.07] pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-fog-400">
              {active.sector} · {active.location}
            </p>
            <h2 className="mt-2 text-[1.9rem] font-medium tracking-[-0.04em] text-white md:text-[2.4rem]">{active.name}</h2>
            <p className="mt-1 max-w-xl text-fog-400">{active.tagline}</p>
          </div>
          <Link
            href={`/proyectos/${active.slug}`}
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-fog-100 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fog-50"
          >
            Ver el caso completo
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </div>
      </div>

      <h2 id="todos-los-videos" className="mt-14 text-xl font-medium tracking-[-0.03em] text-white">
        Todos los vídeos <span className="text-fog-400">· {videos.length}</span>
      </h2>
      <ul aria-labelledby="todos-los-videos" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => {
          const on = v.slug === active.slug;
          return (
            <li key={v.slug}>
              <button
                type="button"
                onClick={() => select(v)}
                aria-current={on ? "true" : undefined}
                aria-label={`${v.name}, ${v.sector}. Vídeo de ${formatClock(v.demo.duration)}`}
                className={cn(
                  "group w-full rounded-2xl p-2 text-left ring-1 ring-inset transition-colors motion-reduce:transition-none",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fog-50",
                  on ? "bg-white/[0.05] ring-white/25" : "ring-white/[0.08] hover:bg-white/[0.03] hover:ring-white/15",
                )}
              >
                <span className="relative block aspect-video overflow-hidden rounded-xl bg-ink-900">
                  <Image src={v.demo.thumb} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw" className="object-cover" />
                  <span className="absolute bottom-2 right-2 rounded-md bg-ink-950/80 px-1.5 py-0.5 font-mono text-[0.7rem] tabular-nums text-fog-100">
                    {formatClock(v.demo.duration)}
                  </span>
                  {on && (
                    <span className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[0.7rem] font-medium text-ink-950" style={{ backgroundColor: v.accent }}>
                      Viendo
                    </span>
                  )}
                </span>
                <span className="block px-2 pb-1.5 pt-3">
                  <span className="block font-medium tracking-[-0.02em] text-white">{v.name}</span>
                  <span className="mt-0.5 block text-sm text-fog-400">{v.sector}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
