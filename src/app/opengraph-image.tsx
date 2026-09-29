import { ImageResponse } from "next/og";
import { PROJECTS } from "@/data/projects";
import { OG_SIZE, OgMark, publicImageDataUrl } from "@/lib/og";

export const alt = "LocalIA Soluciones Digitales: desarrollo web, automatización e IA";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const shots = await Promise.all(PROJECTS.slice(0, 3).map((p) => publicImageDataUrl(p.coverImage.src)));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#050608", color: "#f5f6f8", position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", right: -200, top: -220, width: 900, height: 700, borderRadius: 9999, background: "radial-gradient(closest-side, rgba(77,124,255,0.35), transparent)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <OgMark />
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>LocalIA</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2.5 }}>Digitalizamos negocios.</div>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2.5, color: "#7a9dff" }}>Creamos lo que necesitan.</div>
            <div style={{ fontSize: 24, color: "#b4bac5", marginTop: 28, lineHeight: 1.4 }}>
              Webs · Automatización · CRM · IA · Software a medida
            </div>
          </div>
          <div style={{ fontSize: 20, color: "#8a909b", letterSpacing: 2 }}>SOLUCIONES DIGITALES · BIZKAIA</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "absolute", right: -60, top: 60, transform: "rotate(-6deg)" }}>
          {shots.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={s} alt="" width={520} height={325} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.15)", marginLeft: i * 40, objectFit: "cover", objectPosition: "top" }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
