# LocalIA Soluciones Digitales — web corporativa y portfolio

Web oficial de LocalIA: corporativa, portfolio de proyectos reales y herramienta comercial.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion (LazyMotion) · Lucide · Zod · Vitest

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo |
| `npm run build` / `npm start` | Build y servidor de producción |
| `npm run lint` / `npm run typecheck` / `npm test` | Calidad |
| `npm run media` | Optimiza las capturas de `public/projects/` y regenera `src/data/media-manifest.json` |

## Estructura

```
src/
  app/            rutas: /, /servicios, /proyectos, /proyectos/[slug], /proceso, /nosotros, /contacto,
                  api/contact, sitemap, robots, manifest, imágenes Open Graph
  components/     layout/, sections/, projects/, animations/, contact/, ui/, seo/
  data/           projects.ts (portfolio), services.ts, process.ts, sectors.ts, automations.ts, site.ts
  lib/            seo, media, portfolio (cifras derivadas), showreel, contact (schema, entrega, rate limit)
public/projects/<slug>/   capturas y vídeos reales de cada proyecto
scripts/optimize-media.mjs
supabase/contact_leads.sql
```

## Añadir un proyecto al portfolio

1. Crea `public/projects/<slug>/` con:
   `desktop-home.jpg` (1440×900), `mobile-home.jpg`, `desktop-full.jpg` y `mobile-full.jpg` (página completa),
   y opcionalmente `desktop-*.jpg` / `mobile-*.jpg` para la galería y `scroll.mp4` + `scroll-poster.jpg`.
2. `npm run media`
3. Añade una entrada `defineProject({...})` en `src/data/projects.ts` (`featured: true` para la home).

Aparece automáticamente en la home, en /proyectos, en el showreel, en los sectores, en el sitemap y con su
página `/proyectos/<slug>`, su metadata y su imagen Open Graph. Los tests (`npm test`) comprueban que los
assets existen y que el caso de estudio tiene el contenido mínimo.

**Regla editorial:** solo datos verificables en el repositorio o la web del proyecto. Sin métricas,
testimonios ni tecnologías inventadas. Las cifras de la web se calculan a partir de los datos.

## Formulario de contacto

`POST /api/contact` valida con el mismo esquema Zod que el formulario, y aplica anti-spam (honeypot,
tiempo mínimo de rellenado, rate limit por IP). Entrega el lead a todos los destinos configurados
en `.env` (ver `.env.example`):

- **Webhook** (n8n, Make, CRM…): `CONTACT_WEBHOOK_URL` (+ `CONTACT_WEBHOOK_SECRET`)
- **Email** vía Resend: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- **Supabase**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` + ejecutar `supabase/contact_leads.sql`

Sin ningún destino, en producción la API responde 503 y el formulario lo indica.

## Despliegue (Vercel)

Importar el repositorio, framework Next.js, sin configuración extra. Definir `NEXT_PUBLIC_SITE_URL`
con el dominio definitivo (si no, se usa la URL de producción de Vercel) y al menos un destino del formulario.
