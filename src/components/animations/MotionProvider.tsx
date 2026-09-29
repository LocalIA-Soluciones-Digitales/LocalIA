"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * Carga solo las features de animación necesarias (LazyMotion + `m`) y
 * respeta prefers-reduced-motion en todas las animaciones de transformación.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
