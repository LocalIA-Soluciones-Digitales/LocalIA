import type { Metadata } from "next";
import { SITE } from "@/data/site";
import { SERVICES } from "@/data/services";
import type { Project } from "@/data/projects";

interface BuildMetadataInput {
  title?: string;
  description?: string;
  path: string;
  /** Imagen OG explícita; si no, se usa la del segmento (opengraph-image). */
  image?: string;
}

export function buildMetadata({ title, description, path, image }: BuildMetadataInput): Metadata {
  const fullTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  const desc = description ?? SITE.description;
  return {
    title: title ? { absolute: fullTitle } : { absolute: SITE.title },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      url: path,
      title: fullTitle,
      description: desc,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
  };
}

const abs = (path: string) => `${SITE.url}${path}`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": abs("/#organization"),
        name: SITE.name,
        alternateName: SITE.shortName,
        url: SITE.url,
        logo: abs("/icon.svg"),
        image: abs("/opengraph-image"),
        description: SITE.description,
        ...(SITE.email ? { email: SITE.email } : {}),
        areaServed: SITE.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
        address: { "@type": "PostalAddress", addressRegion: SITE.region, addressCountry: "ES" },
        sameAs: [SITE.github],
        knowsAbout: [
          "Desarrollo web",
          "Diseño web",
          "Digitalización de empresas",
          "Automatización de procesos",
          "Inteligencia artificial para empresas",
          "CRM",
          "Software a medida",
          "E-commerce",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.lead },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": abs("/#website"),
        url: SITE.url,
        name: SITE.name,
        inLanguage: "es-ES",
        publisher: { "@id": abs("/#organization") },
      },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function projectSchema(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    headline: `${p.name}: ${p.tagline}`,
    description: p.shortDescription,
    url: abs(`/proyectos/${p.slug}`),
    image: abs(p.coverImage.src),
    dateCreated: String(p.year),
    inLanguage: "es-ES",
    keywords: [...p.technologies, p.sector].join(", "),
    creator: { "@id": abs("/#organization") },
    about: { "@type": "Thing", name: p.sector },
    ...(p.productionUrl ? { sameAs: p.productionUrl } : {}),
  };
}
