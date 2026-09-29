import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesSection } from "@/components/sections/services/ServicesSection";
import { AutomationSection } from "@/components/sections/automation/AutomationSection";
import { AiSection } from "@/components/sections/ai/AiSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/animations/Reveal";
import { CAPABILITIES } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Servicios: desarrollo web, automatización, CRM e IA",
  description:
    "Desarrollo web, tiendas online, sistemas de reservas, CRM y paneles de gestión, automatización de procesos, integraciones e IA aplicada. Software a medida para empresas de Bizkaia y en remoto.",
  path: "/servicios",
});

export default function ServiciosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Servicios"
        breadcrumbs={[{ name: "Servicios", path: "/servicios" }]}
        title={["Todo lo que tu negocio", { text: "necesita en digital.", className: "serif-accent text-fog-300" }]}
        intro="De la web que ven tus clientes al sistema con el que trabajas: diseñamos, desarrollamos, conectamos y automatizamos. Y si lo que necesitas no existe, lo construimos."
      >
        <div className="mt-16 grid gap-10 border-t border-white/[0.08] pt-10 sm:grid-cols-2 lg:grid-cols-5">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.group} delay={i * 0.06}>
              <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-signal-bright">{c.group}</h2>
              <ul className="mt-4 space-y-2 text-[0.95rem] text-fog-300">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </PageHeader>
      <ServicesSection index="01" />
      <AutomationSection index="02" />
      <AiSection index="03" />
      <FinalCta />
    </>
  );
}
