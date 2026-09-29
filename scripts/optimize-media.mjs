// Optimiza los medios de public/projects/<slug>/ y genera
// src/data/media-manifest.json con las dimensiones de cada imagen.
//
// Uso: npm run media
//
// Convenciones de nombres (ver README):
//   desktop-<nombre>.jpg   captura de escritorio (viewport 16:10)
//   mobile-<nombre>.jpg    captura de móvil (viewport)
//   desktop-full.*         página completa de escritorio (se usa para el scroll dentro del navegador)
//   mobile-full.*          página completa de móvil
//   scroll.mp4 + scroll-poster.jpg   vídeo corto de navegación
//
// Es idempotente: solo reduce lo que supera el tamaño objetivo.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

sharp.cache(false);
const ROOT = path.resolve("public/projects");
const MANIFEST = path.resolve("src/data/media-manifest.json");

const RULES = [
  { test: /^desktop-full\.(jpe?g|png)$/, width: 1280, format: "webp", quality: 74 },
  { test: /^mobile-full\.(jpe?g|png)$/, width: 585, format: "webp", quality: 74 },
  { test: /^mobile-.*\.(jpe?g|png)$/, width: 780, format: "jpeg", quality: 82 },
  { test: /^desktop-.*\.(jpe?g|png)$/, width: 1440, format: "jpeg", quality: 84 },
];

const manifest = {};

for (const slug of fs.readdirSync(ROOT)) {
  const dir = path.join(ROOT, slug);
  if (!fs.statSync(dir).isDirectory()) continue;

  for (const file of fs.readdirSync(dir)) {
    const rule = RULES.find((r) => r.test.test(file));
    if (!rule) continue;
    const src = path.join(dir, file);
    const input = fs.readFileSync(src);
    const meta = await sharp(input).metadata();
    const ext = rule.format === "webp" ? ".webp" : ".jpg";
    const dest = path.join(dir, file.replace(/\.(jpe?g|png)$/, ext));
    if (meta.width > rule.width || dest !== src) {
      const buf = await sharp(input)
        .resize({ width: Math.min(rule.width, meta.width) })
        [rule.format]({ quality: rule.quality, ...(rule.format === "jpeg" ? { mozjpeg: true } : {}) })
        .toBuffer();
      if (dest !== src) fs.rmSync(src);
      fs.writeFileSync(dest, buf);
      console.log("optimizado", path.relative(ROOT, dest), `${meta.width}px → ${Math.min(rule.width, meta.width)}px`);
    }
  }

  for (const file of fs.readdirSync(dir).sort()) {
    if (!/\.(jpe?g|png|webp|avif)$/.test(file)) continue;
    const { width, height } = await sharp(fs.readFileSync(path.join(dir, file))).metadata();
    manifest[`/projects/${slug}/${file}`] = { width, height };
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`manifest: ${Object.keys(manifest).length} imágenes → ${path.relative(process.cwd(), MANIFEST)}`);
