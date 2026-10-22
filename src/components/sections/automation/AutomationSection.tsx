import { SectionIntro } from "@/components/ui/SectionIntro";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";
import { PipelineViz } from "@/components/sections/automation/PipelineViz";
import { AutomationShowcase, type ShowcaseAutomation } from "@/components/sections/automation/AutomationShowcase";
import { REAL_AUTOMATIONS } from "@/data/automations";
import { getProject } from "@/data/projects";
import { prettyUrl } from "@/lib/utils";

export function AutomationSection({ index = "04" }: { index?: string }) {
  const items: ShowcaseAutomation[] = REAL_AUTOMATIONS.flatMap((a) => {
    const p = getProject(a.slug);
    return p ? [{ ...a, name: p.name, accent: p.theme.accent, url: p.productionUrl ? prettyUrl(p.productionUrl) : undefined }] : [];
  });

  return (
    <section aria-labelledby="automatizacion-title" className="relative overflow-hidden border-t border-white/[0.06] pb-20 pt-24 md:pb-24 md:pt-36">
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

        <div className="mt-20 md:mt-28">
          <Reveal className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h3 className="text-[1.6rem] font-medium leading-tight tracking-[-0.035em] text-white md:text-[2rem]">
              Ya funciona en <span className="serif-accent text-fog-300">negocios reales.</span>
            </h3>
            <p className="max-w-sm text-sm text-fog-500">Cada flujo, tal y como corre en producción.</p>
          </Reveal>
          <Reveal>
            <AutomationShowcase items={items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
