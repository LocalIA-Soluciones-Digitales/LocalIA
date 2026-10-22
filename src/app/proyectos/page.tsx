import Link from "next/link";
import { Play } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/animations/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEMO_PROJECTS, FEATURED_PROJECTS, MORE_PROJECTS, PROJECTS } from "@/data/projects";
import { SITE } from "@/data/site";
import { sectorsWithProjects } from "@/lib/portfolio";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Proyectos: webs, tiendas online y software a medida",
  description:
    "Portfolio de LocalIA: proyectos reales en producción para hostelería, comercio, e-commerce, servicios técnicos y reformas. Webs, pedido en mesa, integración con básculas, paneles de gestión y más.",
  path: "/proyectos",
});

export default function ProyectosPage() {
  const sectors = sectorsWithProjects();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Proyectos de LocalIA",
          itemListElement: PROJECTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE.url}/proyectos/${p.slug}`,
            name: p.name,
          })),
        }}
      />
      <PageHeader
        eyebrow="Portfolio"
        breadcrumbs={[{ name: "Proyectos", path: "/proyectos" }]}
        title={["No hablamos de posibilidades.", { text: "Las construimos.", className: "serif-accent text-gradient" }]}
        intro={`${PROJECTS.length} proyectos en producción para ${sectors.length} sectores distintos. Cada uno resuelve un problema concreto de un negocio real.`}
      >
        <ul className="mt-12 flex flex-wrap gap-2" aria-label="Sectores">
          {sectors.map((s) => (
            <li key={s.key} className="rounded-full px-3.5 py-1.5 text-xs text-fog-300 ring-1 ring-inset ring-white/10">
              {s.name} <span className="text-fog-500">· {s.projects.length}</span>
            </li>
          ))}
        </ul>
        {DEMO_PROJECTS.length > 0 && (
          <Link
            href="/videos"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 text-sm font-medium text-fog-50 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fog-50"
          >
            <span className="grid size-7 place-items-center rounded-full bg-fog-50 text-ink-950">
              <Play aria-hidden className="ml-0.5 size-3 fill-current" />
            </span>
            Ver los {DEMO_PROJECTS.length} proyectos en vídeo
          </Link>
        )}
      </PageHeader>

      <section aria-label="Proyectos destacados" className="overflow-x-clip">
        {FEATURED_PROJECTS.map((p, i) => (
          <ProjectShowcase key={p.slug} project={p} index={i} total={FEATURED_PROJECTS.length} headingLevel="h2" />
        ))}
      </section>

      {MORE_PROJECTS.length > 0 && (
        <section aria-labelledby="mas-proyectos" className="container-x border-t border-white/[0.07] py-20 md:py-28">
          <h2 id="mas-proyectos" className="text-[1.9rem] font-medium tracking-[-0.04em] md:text-[2.6rem]">
            Más proyectos
          </h2>
          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
            {MORE_PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
      <FinalCta />
    </>
  );
}
