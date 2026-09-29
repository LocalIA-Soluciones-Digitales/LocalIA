"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { BrowserFrame, PhoneFrame } from "@/components/projects/DeviceFrames";
import { ScrollScreen } from "@/components/projects/ScrollScreen";
import type { Media } from "@/lib/media";

interface Props {
  desktop: Media;
  mobile: Media;
  url?: string;
  accent: string;
  name: string;
}

/**
 * Transición escritorio → móvil ligada al scroll: la web se recorre en el
 * navegador mientras este se aparta y el móvil toma el protagonismo.
 */
export function CaseDevices({ desktop, mobile, url, accent, name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const screen = useTransform(scrollYProgress, [0, 0.55], [0, 1], { clamp: true });
  const phoneScreen = useTransform(scrollYProgress, [0.45, 1], [0, 1], { clamp: true });
  const browserScale = useTransform(scrollYProgress, [0.4, 0.75], [1, 0.86]);
  const browserX = useTransform(scrollYProgress, [0.4, 0.75], ["0%", "-9%"]);
  const browserOpacity = useTransform(scrollYProgress, [0.4, 0.75], [1, 0.45]);
  const phoneY = useTransform(scrollYProgress, [0.3, 0.7], ["55%", "0%"]);
  const phoneOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const labelDesktop = useTransform(scrollYProgress, [0.35, 0.5], [1, 0]);
  const labelMobile = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);

  return (
    <div ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-x relative">
          <div className="relative mb-8 h-6 font-mono text-xs uppercase tracking-[0.14em] text-fog-400">
            <m.p style={{ opacity: labelDesktop }} className="absolute inset-0">
              <span style={{ color: accent }}>●</span> Escritorio
            </m.p>
            <m.p style={{ opacity: labelMobile }} className="absolute inset-0">
              <span style={{ color: accent }}>●</span> Móvil: diseñado para el pulgar, no solo adaptado
            </m.p>
          </div>
          <div className="relative mx-auto max-w-[1080px]">
            <m.div style={{ scale: browserScale, x: browserX, opacity: browserOpacity }} className="origin-left">
              <BrowserFrame url={url} accent={accent}>
                <ScrollScreen image={desktop} frameAspect={16 / 10} progress={screen} sizes="(min-width: 1080px) 1080px, 92vw" />
              </BrowserFrame>
            </m.div>
            <m.div
              style={{ y: phoneY, opacity: phoneOpacity }}
              className="absolute -bottom-[4%] right-[2%] w-[34%] max-w-[300px] md:right-[6%] md:w-[26%]"
            >
              <PhoneFrame>
                <ScrollScreen image={mobile} frameAspect={390 / 744} progress={phoneScreen} sizes="300px" />
              </PhoneFrame>
            </m.div>
          </div>
          <p className="sr-only">Recorrido por la web de {name} en escritorio y en móvil.</p>
        </div>
      </div>
    </div>
  );
}
