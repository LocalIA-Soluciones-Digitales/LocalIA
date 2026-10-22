import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURED_PROJECTS, PROJECTS, getAdjacentProjects } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { buildShowreel } from "@/lib/showreel";
import { portfolioStats, sectorsWithProjects } from "@/lib/portfolio";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

describe("portfolio", () => {
  it("tiene slugs únicos y válidos para URL", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("todas las imágenes y vídeos referenciados existen en /public", () => {
    for (const p of PROJECTS) {
      const media = [p.coverImage, p.mobileImage, p.fullPage.desktop, p.fullPage.mobile, ...p.gallery];
      for (const m of media) expect(fs.existsSync(publicFile(m.src)), m.src).toBe(true);
      if (p.video) {
        expect(fs.existsSync(publicFile(p.video.src)), p.video.src).toBe(true);
        expect(fs.existsSync(publicFile(p.video.poster)), p.video.poster).toBe(true);
      }
      if (p.demo) {
        expect(fs.existsSync(publicFile(p.demo.src)), p.demo.src).toBe(true);
        expect(fs.existsSync(publicFile(p.demo.poster)), p.demo.poster).toBe(true);
        expect(fs.existsSync(publicFile(p.demo.chaptersTrack)), p.demo.chaptersTrack).toBe(true);
      }
    }
  });

  it("cada proyecto tiene el contenido mínimo de un caso de estudio", () => {
    for (const p of PROJECTS) {
      expect(p.challenge.length, p.slug).toBeGreaterThan(0);
      expect(p.solution.length, p.slug).toBeGreaterThan(0);
      expect(p.features.length, p.slug).toBeGreaterThan(2);
      expect(p.result.length, p.slug).toBeGreaterThan(0);
      expect(p.technologies.length, p.slug).toBeGreaterThan(2);
      expect(p.theme.accent, p.slug).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("los vídeos de demostración tienen capítulos ordenados dentro de su duración", () => {
    for (const p of PROJECTS) {
      if (!p.demo) continue;
      const { chapters, duration } = p.demo;
      expect(chapters.length, p.slug).toBeGreaterThan(2);
      expect(chapters[0].start, p.slug).toBe(0);
      for (let i = 1; i < chapters.length; i++) expect(chapters[i].start, p.slug).toBeGreaterThan(chapters[i - 1].start);
      expect(chapters[chapters.length - 1].start, p.slug).toBeLessThan(duration);
      for (const c of chapters) expect(c.title.trim(), p.slug).not.toBe("");
    }
  });

  it("no expone repositorios de GitHub como enlace de producción", () => {
    for (const p of PROJECTS) {
      if (p.productionUrl) expect(p.productionUrl).not.toContain("github.com");
    }
  });

  it("hay proyectos destacados para la home", () => {
    expect(FEATURED_PROJECTS.length).toBeGreaterThan(0);
  });

  it("la navegación anterior/siguiente es circular", () => {
    const first = PROJECTS[0];
    const last = PROJECTS[PROJECTS.length - 1];
    expect(getAdjacentProjects(first.slug).prev.slug).toBe(last.slug);
    expect(getAdjacentProjects(last.slug).next.slug).toBe(first.slug);
  });

  it("solo muestra sectores con proyectos y cifras derivadas de los datos", () => {
    for (const s of sectorsWithProjects()) expect(s.projects.length).toBeGreaterThan(0);
    expect(portfolioStats().projects).toBe(PROJECTS.length);
  });

  it("el showreel incluye piezas de todos los proyectos sin duplicados", () => {
    const reel = buildShowreel(100);
    const keys = reel.map((r) => (r.type === "video" ? r.src : r.image.src));
    expect(new Set(keys).size).toBe(keys.length);
    for (const p of PROJECTS) expect(reel.some((r) => r.project.slug === p.slug)).toBe(true);
  });

  it("los servicios referencian claves válidas", () => {
    const keys = new Set(SERVICES.map((s) => s.key));
    expect(keys.size).toBe(SERVICES.length);
  });
});
