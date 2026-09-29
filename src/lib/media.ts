import manifest from "@/data/media-manifest.json";

export type MediaKind = "desktop" | "mobile";

export interface Media {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const dims = manifest as Record<string, { width: number; height: number }>;

/** Devuelve una imagen de /public/projects con sus dimensiones reales (ver `npm run media`). */
export function projectMedia(slug: string, file: string, alt: string): Media {
  const src = `/projects/${slug}/${file}`;
  const d = dims[src];
  if (!d) {
    throw new Error(`Imagen no encontrada en media-manifest.json: ${src}. Ejecuta "npm run media".`);
  }
  return { src, width: d.width, height: d.height, alt };
}

export function hasMedia(src: string): boolean {
  return src in dims;
}
