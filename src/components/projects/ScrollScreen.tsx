"use client";

import Image from "next/image";
import { m, motionValue, useTransform, type MotionValue } from "framer-motion";
import type { Media } from "@/lib/media";
import { cn } from "@/lib/utils";

interface ScrollScreenProps {
  image: Media;
  /** Relación de aspecto del área visible (ancho / alto). */
  frameAspect: number;
  /** Progreso 0→1 que desplaza la captura (scroll de la sección). Sin él, se desplaza al hacer hover. */
  progress?: MotionValue<number>;
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
export function ScrollScreen({ image, frameAspect, progress, sizes, priority, className }: ScrollScreenProps) {
  // Altura visible respecto a la altura de la imagen, ambas a igual ancho.
  const visible = image.width / frameAspect / image.height;
  const maxShift = Math.max(0, (1 - visible) * 100);
  const limit = Math.min(maxShift, 72); // no llegar al footer: la parte interesante está arriba

  const y = useTransform(progress ?? FALLBACK, [0, 1], ["0%", `-${limit}%`]);

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
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full"
        />
      </m.div>
    </div>
  );
}

