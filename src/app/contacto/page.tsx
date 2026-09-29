import { ContactSection } from "@/components/contact/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contacto: cuéntanos tu proyecto",
  description:
    "Cuéntanos cómo funciona tu negocio y qué te quita tiempo. Webs, automatización, CRM, e-commerce, IA o software a medida: te respondemos con una propuesta concreta.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <div className="pt-12 md:pt-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Contacto", path: "/contacto" },
        ])}
      />
      <ContactSection headingLevel="h1" />
    </div>
  );
}
