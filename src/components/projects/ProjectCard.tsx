import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { BrowserFrame } from "@/components/projects/DeviceFrames";
import { ScrollScreen } from "@/components/projects/ScrollScreen";
import type { Project } from "@/data/projects";
import { prettyUrl } from "@/lib/utils";

/** Proyecto en formato compacto: al pasar el ratón, la web se navega sola. */
export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link href={`/proyectos/${p.slug}`} className="group block" aria-label={`Ver caso: ${p.name}`}>
      <BrowserFrame url={p.productionUrl ? prettyUrl(p.productionUrl) : undefined} className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
        <ScrollScreen image={p.fullPage.desktop} frameAspect={16 / 10} sizes="(min-width: 1024px) 600px, 92vw" />
      </BrowserFrame>
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-fog-500">
            {p.sector} · {p.location}
            {p.demo && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-fog-100 ring-1 ring-inset ring-white/15">
                <Play aria-hidden className="size-2.5 fill-current" /> Vídeo
              </span>
            )}
          </p>
          <h3 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-white md:text-[1.7rem]">{p.name}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-fog-400">{p.tagline}</p>
        </div>
        <span
          aria-hidden
          className="mt-1 grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-white/12 transition-colors duration-300 group-hover:bg-fog-50 group-hover:text-ink-950"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
