function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "LocalIA Soluciones Digitales",
  shortName: "LocalIA",
  url: resolveSiteUrl(),
  locale: "es_ES",
  title: "LocalIA Soluciones Digitales | Desarrollo Web, Automatización e IA",
  description:
    "Diseñamos webs, automatizamos procesos y desarrollamos software a medida para negocios de Bizkaia y de cualquier lugar. Tiendas online, reservas, paneles de gestión, integraciones e IA aplicada. Mira los proyectos que ya tenemos en producción.",
  region: "Bizkaia",
  areaServed: ["Bizkaia", "País Vasco", "España"],
  github: "https://github.com/LocalIA-Soluciones-Digitales",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
} as const;
