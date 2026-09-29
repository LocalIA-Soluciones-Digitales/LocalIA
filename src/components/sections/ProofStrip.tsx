import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import { prettyUrl } from "@/lib/utils";

/** Franja de confianza: webs reales en producción desfilando en bucle. */
export function ProofStrip() {
  const items = [...PROJECTS, ...PROJECTS];

  return (
    <section aria-label="Proyectos en producción" className="relative border-y border-white/[0.06] bg-ink-950 py-10 md:py-14">
      <div className="container-x mb-8 flex items-end justify-between gap-6">
        <p className="max-w-md text-sm leading-relaxed text-fog-400">
          <span className="text-fog-100">Proyectos reales, en producción.</span> Webs, tiendas y plataformas que
          negocios de Bizkaia y de fuera usan cada día.
        </p>
        <Link href="/proyectos" className="hidden shrink-0 text-sm text-fog-300 underline-offset-4 hover:text-white hover:underline sm:block">
          Ver todos
        </Link>
      </div>

      <div className="group relative mask-fade-x overflow-hidden">
        <ul className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused] md:gap-7">
          {items.map((p, i) => (
            <li key={`${p.slug}-${i}`} aria-hidden={i >= PROJECTS.length || undefined} className="w-[250px] shrink-0 md:w-[360px]">
              <Link href={`/proyectos/${p.slug}`} tabIndex={i >= PROJECTS.length ? -1 : undefined} className="group/card block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg ring-1 ring-white/10 transition duration-500 group-hover/card:ring-white/25">
                  <Image
                    src={p.coverImage.src}
                    alt={p.coverImage.alt}
                    fill
                    sizes="(min-width: 768px) 360px, 250px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3 text-xs">
                  <span className="truncate text-fog-100">{p.name}</span>
                  {p.productionUrl && <span className="shrink-0 font-mono text-fog-500">{prettyUrl(p.productionUrl)}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
