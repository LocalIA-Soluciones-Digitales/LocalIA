import { ImageResponse } from "next/og";
import { PROJECTS, getProject } from "@/data/projects";
import { OG_SIZE, OgMark, publicImageDataUrl } from "@/lib/og";

export const alt = "Caso de estudio de LocalIA Soluciones Digitales";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug) ?? PROJECTS[0];
  const cover = await publicImageDataUrl(p.coverImage.src);
  const phone = await publicImageDataUrl(p.mobileImage.src);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: p.theme.surface, color: "#f5f6f8", position: "relative", fontFamily: "sans-serif", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -160, top: -160, width: 900, height: 800, borderRadius: 9999, background: `radial-gradient(closest-side, ${p.theme.accent}55, transparent)`, display: "flex" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" width={720} height={450} style={{ position: "absolute", right: -70, top: 110, borderRadius: 16, border: "1px solid rgba(255,255,255,0.18)", objectFit: "cover", objectPosition: "top" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={phone} alt="" width={190} height={390} style={{ position: "absolute", right: 520, top: 250, borderRadius: 26, border: "6px solid #1a1e25", objectFit: "cover", objectPosition: "top" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 60, width: 560, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <OgMark size={40} />
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1 }}>LocalIA</div>
            <div style={{ fontSize: 18, color: "#8a909b", marginLeft: 8 }}>Caso de estudio</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 20, letterSpacing: 2, color: p.theme.accent, textTransform: "uppercase" }}>{p.sector}</div>
            <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, marginTop: 16 }}>{p.name}</div>
            <div style={{ fontSize: 24, color: "#b4bac5", marginTop: 20, lineHeight: 1.35 }}>{p.tagline}</div>
          </div>
          <div style={{ fontSize: 18, color: "#8a909b" }}>{`${p.location} · ${p.year}`}</div>
        </div>
      </div>
    ),
    size,
  );
}
