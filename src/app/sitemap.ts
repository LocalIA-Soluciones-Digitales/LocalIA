import type { MetadataRoute } from "next";
import { DEMO_PROJECTS, PROJECTS } from "@/data/projects";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/servicios", priority: 0.9, freq: "monthly" },
    { path: "/proyectos", priority: 0.9, freq: "weekly" },
    { path: "/proceso", priority: 0.6, freq: "monthly" },
    { path: "/nosotros", priority: 0.7, freq: "monthly" },
    { path: "/contacto", priority: 0.8, freq: "monthly" },
  ];

  return [
    ...pages.map((p) => ({
      url: `${SITE.url}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    {
      url: `${SITE.url}/videos`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      videos: DEMO_PROJECTS.map((p) => ({
        title: `${p.name}: así funciona por dentro`,
        thumbnail_loc: `${SITE.url}${p.demo.poster}`,
        description: p.shortDescription,
        content_loc: `${SITE.url}${p.demo.src}`,
        duration: Math.round(p.demo.duration),
      })),
    },
    ...PROJECTS.map((p) => ({
      url: `${SITE.url}/proyectos/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.8 : 0.7,
      images: [`${SITE.url}${p.coverImage.src}`],
    })),
  ];
}
