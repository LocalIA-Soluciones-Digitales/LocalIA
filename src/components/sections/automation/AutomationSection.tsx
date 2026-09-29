import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";
import { PipelineViz } from "@/components/sections/automation/PipelineViz";
import { REAL_AUTOMATIONS } from "@/data/automations";

export function AutomationSection({ index = "04" }: { index?: string }) {
  return (
    <section aria-labelledby="automatizacion-title" className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-36">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-50 mask-fade-y" />
      <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-[50vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(63_216_232/0.08),transparent)]" />

      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionIntro index={index} label="Automatización" tone="cyan" />
            <TextReveal
              id="automatizacion-title"
              as="h2"
              lines={["Tu negocio funcionando", { text: "sin tareas repetitivas.", className: "serif-accent text-fog-300" }]}
              className="display mt-6 text-[clamp(2.3rem,5.6vw,4.6rem)]"
            />
          </div>
          <Reveal className="self-end lg:col-span-4" delay={0.2}>
            <p className="text-base leading-relaxed text-fog-400 md:text-lg">
              Conectamos tus herramientas y automatizamos los procesos que hoy haces a mano: copiar datos, avisar,
              revisar, actualizar.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <PipelineViz />
        </Reveal>

        <div className="mt-24 md:mt-32">
          <Reveal>
            <p className="eyebrow">Ya funciona en proyectos reales</p>
          </Reveal>
          <ul className="mt-8 grid border-t border-white/[0.08] md:grid-cols-2">
            {REAL_AUTOMATIONS.map((a, i) => (
              <li key={a.slug} className="border-b border-white/[0.08] md:odd:border-r md:odd:pr-8 md:even:pl-8">
                <Reveal delay={i * 0.08}>
                  <Link href={`/proyectos/${a.slug}`} className="group block py-8">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-lg font-medium tracking-[-0.02em] text-white">{a.project}</p>
                      <ArrowUpRight aria-hidden className="size-4 text-fog-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em]">
                      {a.steps.map((s, si) => (
                        <span key={s} className="flex items-center gap-2">
                          {si > 0 && <span aria-hidden className="text-cyan/70">→</span>}
                          <span className={si === a.steps.length - 1 ? "text-cyan" : "text-fog-300"}>{s}</span>
                        </span>
                      ))}
                    </p>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-fog-400">{a.summary}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
