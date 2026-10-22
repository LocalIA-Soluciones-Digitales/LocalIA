import { PageHeader } from "@/components/layout/PageHeader";
import { VideoGallery, type GalleryVideo } from "@/components/projects/VideoGallery";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEMO_PROJECTS } from "@/data/projects";
import { buildMetadata, demoVideoSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Vídeos: así funcionan nuestros proyectos por dentro",
  description:
    "Demostraciones en vídeo de los proyectos de LocalIA: paneles de gestión, pedidos en mesa, integración con básculas, avisos automáticos y más, en negocios reales.",
  path: "/videos",
});

export default function VideosPage() {
  const videos: GalleryVideo[] = DEMO_PROJECTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    sector: p.sector,
    location: p.location,
    tagline: p.tagline,
    accent: p.theme.accent,
    demo: p.demo,
  }));

  return (
    <>
      <JsonLd data={DEMO_PROJECTS.map(demoVideoSchema)} />
      <PageHeader
        eyebrow="Vídeos"
        breadcrumbs={[{ name: "Vídeos", path: "/videos" }]}
        title={["Míralo funcionando.", { text: "Proyecto a proyecto.", className: "serif-accent text-gradient" }]}
        intro={
          <>
            Lo que no se ve desde fuera: los paneles de gestión, lo que se automatiza y lo que le ahorra a cada negocio.
            Un minuto por proyecto. <span className="text-fog-400">Los datos que aparecen en los paneles son de ejemplo.</span>
          </>
        }
      />
      <section aria-label="Vídeos de demostración" className="container-x pb-24 md:pb-32">
        <VideoGallery videos={videos} />
      </section>
      <FinalCta />
    </>
  );
}
