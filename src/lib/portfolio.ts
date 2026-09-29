import { PROJECTS, type Project } from "@/data/projects";
import { SECTORS, type Sector } from "@/data/sectors";

/** Sectores con al menos un proyecto real (nunca se muestra un sector sin respaldo). */
export function sectorsWithProjects(): (Sector & { projects: Project[] })[] {
  return SECTORS.map((s) => ({ ...s, projects: PROJECTS.filter((p) => p.sectorKey === s.key) })).filter(
    (s) => s.projects.length > 0,
  );
}

/** "Next.js 16" → "Next.js", "Supabase Realtime" → "Supabase": cada tecnología cuenta una vez. */
function normalizeTech(t: string): string {
  const base = t.replace(/\s*\(.*\)$/, "").replace(/\s\d+$/, "");
  for (const family of ["Supabase", "Stripe"]) if (base.startsWith(family)) return family;
  return base;
}

/** Cifras calculadas a partir del portfolio: nunca escritas a mano. */
export function portfolioStats() {
  const technologies = new Set(PROJECTS.flatMap((p) => p.technologies.map(normalizeTech)));
  const locations = new Set(PROJECTS.map((p) => p.location));
  return {
    projects: PROJECTS.length,
    sectors: sectorsWithProjects().length,
    technologies: technologies.size,
    locations: locations.size,
  };
}
