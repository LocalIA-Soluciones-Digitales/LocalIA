import { PageHeader } from "@/components/layout/PageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { SectorsSection } from "@/components/sections/SectorsSection";
import { ProcessSection } from "@/components/sections/process/ProcessSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sobre LocalIA",
  description:
    "LocalIA Soluciones Digitales: digitalización de empresas desde Bizkaia. Entendemos cómo funciona tu negocio y construimos la tecnología que necesita: webs, software a medida, automatización e IA.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nosotros"
        breadcrumbs={[{ name: "Nosotros", path: "/nosotros" }]}
        title={["Construimos tecnología", { text: "que resuelve problemas reales.", className: "serif-accent text-fog-300" }]}
        intro="LocalIA Soluciones Digitales trabaja desde Bizkaia con negocios del País Vasco y, en remoto, de cualquier lugar. Hacemos webs, pero sobre todo hacemos que las cosas funcionen: sistemas conectados, procesos automáticos y herramientas a medida."
      />
      <AboutSection index="01" />
      <SectorsSection index="02" />
      <ProcessSection index="03" />
      <FinalCta />
    </>
  );
}
