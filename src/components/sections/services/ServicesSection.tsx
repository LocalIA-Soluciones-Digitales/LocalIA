import { SectionIntro } from "@/components/ui/SectionIntro";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";
import { ServicesExplorer, type ServiceProof } from "@/components/sections/services/ServicesExplorer";
import { SERVICES } from "@/data/services";
import { projectsWithService } from "@/data/projects";

export function ServicesSection({ index = "01" }: { index?: string }) {
  const proofs: Record<string, ServiceProof[]> = Object.fromEntries(
    SERVICES.map((s) => [s.key, projectsWithService(s.provenBy).map((p) => ({ name: p.name, slug: p.slug }))]),
  );

  return (
    <section id="servicios" aria-labelledby="servicios-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionIntro index={index} label="Qué hacemos" />
            <TextReveal
              id="servicios-title"
              as="h2"
              lines={["Digitalizamos tu negocio", { text: "de principio a fin.", className: "serif-accent text-fog-300" }]}
              className="display mt-6 text-[clamp(2.3rem,5.6vw,4.6rem)]"
            />
          </div>
          <Reveal className="self-end lg:col-span-4 lg:col-start-9" delay={0.2}>
            <p className="text-base leading-relaxed text-fog-400 md:text-lg">
              No empezamos por la tecnología. Empezamos por lo que te quita tiempo: tareas manuales, información
              repartida en varios sitios y herramientas que no se hablan entre sí.
            </p>
          </Reveal>
        </div>

        <ServicesExplorer services={SERVICES} proofs={proofs} />
      </div>
    </section>
  );
}
