import { PROJECTS, type Project } from "@/data/projects";
import type { Media } from "@/lib/media";

export type ShowreelItem =
  | { type: "video"; project: Project; src: string; poster: string; caption: string }
  | { type: "desktop" | "mobile"; project: Project; image: Media; caption: string };

/**
 * Composición del showreel generada a partir del portfolio: por cada proyecto
 * su vídeo (o portada), una pantalla móvil y una de escritorio, intercaladas
 * entre proyectos para dar ritmo. Un proyecto nuevo entra automáticamente.
 */
export function buildShowreel(max = 13): ShowreelItem[] {
  const perProject: ShowreelItem[][] = PROJECTS.map((p) => {
    const items: ShowreelItem[] = [];
    if (p.video) items.push({ type: "video", project: p, src: p.video.src, poster: p.video.poster, caption: "Navegación real" });
    else items.push({ type: "desktop", project: p, image: p.coverImage, caption: "Inicio" });
    const mobile = p.gallery.find((g) => g.kind === "mobile");
    items.push(mobile ? { type: "mobile", project: p, image: mobile, caption: mobile.caption } : { type: "mobile", project: p, image: p.mobileImage, caption: "Inicio en móvil" });
    const desktop = p.gallery.find((g) => g.kind === "desktop");
    if (desktop) items.push({ type: "desktop", project: p, image: desktop, caption: desktop.caption });
    return items;
  });

  // Intercalado: la pieza r de cada proyecto, rotando el orden en cada ronda
  // para que no coincidan todos los vídeos juntos ni todos los móviles juntos.
  const out: ShowreelItem[] = [];
  const rounds = Math.max(...perProject.map((x) => x.length));
  for (let r = 0; r < rounds; r++) {
    // (r + i) % n recorre todas las piezas de cada proyecto exactamente una vez.
    perProject.forEach((items, i) => {
      if (r < items.length) out.push(items[(r + i) % items.length]);
    });
  }
  return out.slice(0, max);
}
