import fs from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

/** Lee una imagen de /public como data URL para incrustarla en ImageResponse. */
export async function publicImageDataUrl(src: string): Promise<string> {
  const file = await fs.readFile(path.join(process.cwd(), "public", src));
  const ext = path.extname(src).slice(1).replace("jpg", "jpeg");
  return `data:image/${ext};base64,${file.toString("base64")}`;
}

/** Símbolo de LocalIA para las imágenes OG. */
export function OgMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a9dff" />
          <stop offset="1" stopColor="#3fd8e8" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="#0d0f13" stroke="rgba(255,255,255,0.18)" />
      <path d="M8.5 7.5v13h6.5" fill="none" stroke="#e9ebef" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 20.5 19.6 11.4" stroke="url(#g)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20.2" cy="9.6" r="2.9" fill="url(#g)" />
      <circle cx="15" cy="20.5" r="1.6" fill="#e9ebef" />
    </svg>
  );
}
