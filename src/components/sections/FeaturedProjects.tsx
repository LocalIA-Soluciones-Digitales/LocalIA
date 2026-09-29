import { SectionIntro } from "@/components/ui/SectionIntro";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { FEATURED_PROJECTS, MORE_PROJECTS } from "@/data/projects";

export function FeaturedProjects({ index = "02" }: { index?: string }) {
  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="relative overflow-x-clip pt-24 md:pt-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionIntro index={index} label="Proyectos" />
            <TextReveal
              id="proyectos-title"
              as="h2"
              lines={["No hablamos de posibilidades.", { text: "Las construimos.", className: "serif-accent text-gradient" }]}
              className="display mt-6 text-[clamp(2.3rem,5.6vw,4.6rem)]"
            />
          </div>
          <Reveal className="self-end lg:col-span-4" delay={0.2}>
            <p className="text-base leading-relaxed text-fog-400 md:text-lg">
              Cada proyecto es un negocio real, con un problema concreto y una solución en producción. Esto es lo que
              hemos construido.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        {FEATURED_PROJECTS.map((p, i) => (
          <ProjectShowcase key={p.slug} project={p} index={i} total={FEATURED_PROJECTS.length} />
        ))}
      </div>

      {MORE_PROJECTS.length > 0 && (
        <div className="container-x border-t border-white/[0.07] pb-8 pt-20 md:pt-28">
          <div className="flex items-end justify-between gap-6">
            <h3 className="text-[1.9rem] font-medium tracking-[-0.04em] md:text-[2.6rem]">Más proyectos</h3>
            <Button href="/proyectos" variant="ghost" className="hidden sm:inline-flex">
              Ver todo el portfolio
            </Button>
          </div>
          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
            {MORE_PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
