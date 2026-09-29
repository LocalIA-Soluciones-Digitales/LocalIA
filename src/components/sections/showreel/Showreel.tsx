"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { LazyVideo } from "@/components/projects/LazyVideo";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { ShowreelItem } from "@/lib/showreel";
import { cn } from "@/lib/utils";

/** Scroll vertical necesario por píxel de desplazamiento horizontal. */
const SCROLL_RATIO = 0.6;

/**
 * Escritorio: la sección se fija y la composición se desplaza en horizontal
 * con el scroll vertical. Móvil/tablet: carrusel nativo con snap.
 */
export function Showreel({ items, index = "03" }: { items: ShowreelItem[]; index?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      setPinned(mq.matches);
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="showreel-title"
      className="relative bg-ink-950"
      style={pinned ? { height: `calc(100vh + ${Math.round(distance * SCROLL_RATIO)}px)` } : undefined}
    >
      <div className={cn("flex flex-col justify-center overflow-hidden py-24", pinned && "sticky top-0 h-screen py-0")}>
        <div className="container-x mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionIntro index={index} label="Showreel" tone="cyan" />
            <h2 id="showreel-title" className="display mt-5 text-[clamp(2.2rem,5vw,4.2rem)]">
              Esto es lo que <span className="serif-accent text-fog-300">hacemos.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-fog-400">
            Interfaces reales de proyectos en producción: webs, tiendas, cartas digitales, reservas y flujos de pedido.
            {pinned ? " Sigue haciendo scroll." : " Desliza para ver más."}
          </p>
        </div>

        <m.div
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className={cn(
            "flex items-center gap-5 px-5 md:gap-7 md:px-8",
            pinned ? "w-max will-change-transform lg:px-[max(2rem,calc((100vw-1320px)/2+2rem))]" : "snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {items.map((it, i) => (
            <ShowreelTile key={i} item={it} />
          ))}
        </m.div>

        {pinned && (
          <div className="container-x mt-12">
            <div className="h-px w-full bg-white/10">
              <m.div style={{ scaleX: bar }} className="h-px origin-left bg-gradient-to-r from-signal to-cyan" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ShowreelTile({ item }: { item: ShowreelItem }) {
  const p = item.project;
  const isMobile = item.type === "mobile";
  return (
    <figure
      className={cn(
        "group relative shrink-0 snap-center",
        isMobile ? "w-[46vw] max-w-[230px] lg:w-[15vw] lg:max-w-[260px]" : "w-[82vw] max-w-[560px] lg:w-[38vw] lg:max-w-[640px]",
      )}
    >
      <Link href={`/proyectos/${p.slug}`} className="block" aria-label={`${p.name}: ${item.caption}`}>
        <div
          className={cn(
            "relative overflow-hidden bg-ink-800 ring-1 ring-white/10 transition duration-500 group-hover:ring-white/25",
            isMobile ? "aspect-[390/800] rounded-[1.6rem]" : "aspect-[16/10] rounded-xl",
          )}
        >
          {item.type === "video" ? (
            <LazyVideo src={item.src} poster={item.poster} label={`Vídeo de navegación por la web de ${p.name}`} />
          ) : (
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes={isMobile ? "260px" : "(min-width: 1024px) 640px, 82vw"}
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
          )}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/5" />
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: p.theme.accent }} />
          <span className="text-fog-100">{p.name}</span>
          <span className="text-fog-500">· {item.caption}</span>
        </figcaption>
      </Link>
    </figure>
  );
}
