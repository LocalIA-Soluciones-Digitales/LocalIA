import { PageHeader } from "@/components/layout/PageHeader";
import { ProcessSection } from "@/components/sections/process/ProcessSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cómo trabajamos",
  description:
    "Entendemos tu negocio, detectamos tareas repetitivas y oportunidades, diseñamos, construimos, automatizamos, lanzamos y seguimos mejorando. Así digitaliza LocalIA una empresa.",
  path: "/proceso",
});

export default function ProcesoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proceso"
        breadcrumbs={[{ name: "Proceso", path: "/proceso" }]}
        title={["Primero entendemos.", { text: "Después construimos.", className: "serif-accent text-fog-300" }]}
        intro="Siete pasos, de la primera conversación a una solución en producción que sigue evolucionando contigo."
      />
      <ProcessSection index="01" />
      <FinalCta />
    </>
  );
}
