"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { m, motionValue, useTransform, type MotionValue } from "framer-motion";
import type { Media } from "@/lib/media";
import { cn } from "@/lib/utils";

interface ScrollScreenProps {
  image: Media;
  /** Relación de aspecto del área visible (ancho / alto). */
  frameAspect: number;
  /** Progreso 0→1 que desplaza la captura (scroll de la sección). Sin él, se desplaza al hacer hover. */
  progress?: MotionValue<number>;
  /** Desplazamiento automático máximo, en % de la altura de la captura. */
  maxShift?: number;
  /** El visitante navega la captura él mismo: rueda, arrastre, dedo o teclado. */
  explore?: boolean;
  /** Nombre accesible del área navegable en modo explorar. */
  label?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

// MotionValue estático para no romper la regla de hooks cuando no hay progreso.
const FALLBACK = motionValue(0);

/**
 * Una captura de página completa que "se navega" dentro del dispositivo.
 * El desplazamiento máximo se calcula con las dimensiones reales de la
 * imagen, así que nunca se ve un hueco al final.
 */
export function ScrollScreen({ image, frameAspect, progress, maxShift = 72, explore, label, sizes, priority, className }: ScrollScreenProps) {
  // Altura visible respecto a la altura de la imagen, ambas a igual ancho.
  const visible = image.width / frameAspect / image.height;
  const limit = Math.min(Math.max(0, (1 - visible) * 100), maxShift); // no llegar al footer: la parte interesante está arriba

  const y = useTransform(progress ?? FALLBACK, [0, 1], ["0%", `-${limit}%`]);

  const img = (
    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} className="h-auto w-full" />
  );

  if (explore) return <ExploreScreen className={className} label={label ?? image.alt} startAt={progress?.get() ?? 0} limit={limit}>{img}</ExploreScreen>;

  if (!progress) {
    return (
      <div className={cn("group/screen absolute inset-0", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.45,0,0.55,1)] will-change-transform group-hover/screen:[transform:translateY(var(--shift))]"
          style={{ ["--shift" as string]: `-${limit}%` }}
        />
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0", className)}>
      <m.div style={{ y }} className="will-change-transform">
        {img}
      </m.div>
    </div>
  );
}

/**
 * Pantalla con scroll propio. Empieza donde estaba la vista automática,
 * no encadena el scroll a la página al llegar al final y con ratón se puede
 * arrastrar como en un móvil.
 */
function ExploreScreen({
  children,
  className,
  label,
  startAt,
  limit,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  startAt: number;
  limit: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const content = el.firstElementChild as HTMLElement | null;
    if (content) el.scrollTop = (content.offsetHeight * limit * startAt) / 100;
    el.focus({ preventScroll: true });
    // Solo al entrar en el modo: después manda el visitante.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    const y0 = e.clientY;
    const top0 = el.scrollTop;
    el.setPointerCapture(e.pointerId);
    el.dataset.dragging = "true";
    const move = (ev: PointerEvent) => {
      el.scrollTop = top0 - (ev.clientY - y0);
    };
    const up = () => {
      delete el.dataset.dragging;
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label={`${label}. Desplázate dentro para recorrerla.`}
      onPointerDown={onPointerDown}
      className={cn(
        "screen-scroll absolute inset-0 cursor-grab select-none overflow-y-auto overscroll-contain outline-none data-[dragging=true]:cursor-grabbing",
        className,
      )}
    >
      <div className="pointer-events-none">{children}</div>
    </div>
  );
}
