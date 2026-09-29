"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyVideoProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
}

/**
 * Vídeo corto en bucle que solo se descarga al acercarse a la pantalla y se
 * pausa al salir de ella. Con prefers-reduced-motion se queda en el póster.
 */
export function LazyVideo({ src, poster, label, className }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.getAttribute("src")) el.setAttribute("src", src);
          if (!reduce) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
