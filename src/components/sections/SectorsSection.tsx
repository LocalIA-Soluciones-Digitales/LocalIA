import Image from "next/image";
import Link from "next/link";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";
import { sectorsWithProjects } from "@/lib/portfolio";

export function SectorsSection({ index = "07" }: { index?: string }) {
  const sectors = sectorsWithProjects();

  return (
    <section aria-labelledby="sectores-title" className="relative border-t border-white/[0.06] py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionIntro index={index} label="Sectores" />
            <TextReveal
              id="sectores-title"
              as="h2"
              lines={["Negocios distintos,", { text: "el mismo método.", className: "serif-accent text-fog-300" }]}
              className="display mt-6 text-[clamp(2.2rem,5vw,4.2rem)]"
            />
          </div>
          <Reveal className="self-end lg:col-span-4" delay={0.2}>
            <p className="text-base leading-relaxed text-fog-400">
              Solo mostramos sectores en los que ya tenemos proyectos en producción. Si el tuyo no está, el método es
              el mismo: entender cómo trabajas antes de construir nada.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 border-t border-white/[0.08] md:mt-20">
          {sectors.map((s, i) => (
            <li key={s.key} className="group relative border-b border-white/[0.08]">
              <Reveal delay={i * 0.05} className="grid items-center gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <p className="font-mono text-xs text-fog-500 md:col-span-1">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-[1.75rem] font-medium leading-tight tracking-[-0.04em] text-fog-300 transition-colors duration-500 group-hover:text-white md:col-span-4 md:text-[2.3rem]">
                  {s.name}
                </h3>
                <p className="text-sm leading-relaxed text-fog-400 md:col-span-4">{s.problem}</p>
                <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                  {s.projects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/proyectos/${p.slug}`}
                      className="relative z-10 rounded-full px-3 py-1.5 text-xs text-fog-300 ring-1 ring-inset ring-white/10 transition hover:text-white hover:ring-white/30"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </Reveal>
              {/* Vista previa flotante en escritorio */}
              <div
                aria-hidden
                className="pointer-events-none absolute right-[27%] top-1/2 hidden w-56 -translate-y-1/2 rotate-[-4deg] scale-90 overflow-hidden rounded-lg opacity-0 shadow-2xl ring-1 ring-white/15 transition-all duration-500 ease-out group-hover:rotate-[-2deg] group-hover:scale-100 group-hover:opacity-100 xl:block"
              >
                <Image src={s.projects[0].coverImage.src} alt="" width={448} height={280} sizes="224px" className="aspect-[16/10] object-cover object-top" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
