import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BrowserFrame, PhoneFrame } from "@/components/projects/DeviceFrames";
import { LazyVideo } from "@/components/projects/LazyVideo";
import { CaseDevices } from "@/components/projects/case/CaseDevices";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { PROJECTS, getAdjacentProjects, getProject, type Project } from "@/data/projects";
import { SERVICE_LABELS } from "@/data/services";
import { buildMetadata, projectSchema } from "@/lib/seo";
import { cn, prettyUrl } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.name,
    description: `${p.shortDescription} Caso de estudio de LocalIA · ${p.sector}, ${p.location}.`,
    path: `/proyectos/${p.slug}`,
  });
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const { prev, next } = getAdjacentProjects(p.slug);
  const domain = p.productionUrl ? prettyUrl(p.productionUrl) : undefined;

  return (
    <article style={{ ["--accent" as string]: p.theme.accent }}>
      <JsonLd data={projectSchema(p)} />

      <PageHeader
        eyebrow={`${p.sector} · ${p.location} · ${p.year}`}
        breadcrumbs={[
          { name: "Proyectos", path: "/proyectos" },
          { name: p.name, path: `/proyectos/${p.slug}` },
        ]}
        title={[p.name]}
        intro={<p className="serif-accent text-[1.6rem] leading-snug text-fog-100 md:text-[2rem]">{p.tagline}</p>}
      >
        <div className="fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ animationDelay: "600ms" }}>
          <ul className="flex flex-wrap gap-2" aria-label="Servicios">
            {p.services.map((s) => (
              <li key={s} className="rounded-full px-3 py-1.5 text-xs text-fog-300 ring-1 ring-inset ring-white/12">
                {SERVICE_LABELS[s]}
              </li>
            ))}
          </ul>
        </div>
      </PageHeader>

      {/* Media principal */}
      <section aria-label="Vista principal" className="relative">
        <div aria-hidden className="absolute inset-x-0 top-[10%] -z-10 mx-auto h-[70%] w-[80%] rounded-full blur-3xl" style={{ background: `radial-gradient(closest-side, ${p.theme.accent}22, transparent)` }} />
        <div className="container-x">
          <Reveal>
            <BrowserFrame url={domain} accent={p.theme.accent}>
              {p.video ? (
                <LazyVideo src={p.video.src} poster={p.video.poster} label={`Vídeo de navegación por la web de ${p.name}`} />
              ) : (
                <Image src={p.coverImage.src} alt={p.coverImage.alt} fill priority sizes="(min-width: 1320px) 1256px, 94vw" className="object-cover object-top" />
              )}
            </BrowserFrame>
          </Reveal>
        </div>
      </section>

      {/* Resumen */}
      <section aria-label="Resumen" className="container-x grid gap-12 py-24 md:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="text-[1.35rem] leading-[1.5] tracking-[-0.015em] text-fog-100 md:text-[1.7rem]">{p.longDescription}</p>
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
          <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07] text-sm">
            {[
              ["Cliente", p.client],
              ["Sector", p.sector],
              ["Ubicación", p.location],
              ["Año", String(p.year)],
              ["Estado", "En producción"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3.5">
                <dt className="text-fog-500">{k}</dt>
                <dd className="text-right text-fog-100">{v}</dd>
              </div>
            ))}
            {p.productionUrl && (
              <div className="flex justify-between gap-6 py-3.5">
                <dt className="text-fog-500">Web</dt>
                <dd>
                  <a href={p.productionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fog-100 underline-offset-4 hover:underline">
                    {domain} <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </section>

      {/* Reto y solución */}
      <section aria-label="El reto y la solución" className="border-t border-white/[0.06]">
        <StoryBlock label="El reto" index="01" paragraphs={p.challenge} accent={p.theme.accent} />
        <StoryBlock label="La solución" index="02" paragraphs={p.solution} accent={p.theme.accent} />
      </section>

      {/* Escritorio → móvil */}
      <section aria-label="Escritorio y móvil" className="border-t border-white/[0.06]">
        <CaseDevices desktop={p.fullPage.desktop} mobile={p.fullPage.mobile} url={domain} accent={p.theme.accent} name={p.name} />
      </section>

      {/* Funcionalidades */}
      <section aria-labelledby="funcionalidades" className="container-x border-t border-white/[0.06] py-24 md:py-32">
        <SectionLabel id="funcionalidades" index="03" label="Funcionalidades" accent={p.theme.accent} title="Qué hace la solución." />
        <ul className="mt-14 grid border-t border-white/[0.08] md:grid-cols-2 lg:grid-cols-3">
          {p.features.map((f, i) => (
            <li key={f.title} className="border-b border-white/[0.08] py-8 md:pr-10">
              <Reveal delay={(i % 3) * 0.06}>
                <p className="font-mono text-xs" style={{ color: p.theme.accent }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-medium tracking-[-0.02em] text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog-400">{f.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Tecnología */}
      <section aria-labelledby="tecnologia" className="container-x border-t border-white/[0.06] py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel id="tecnologia" index="04" label="Tecnología" accent={p.theme.accent} title="El stack del proyecto." />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-fog-400">
              Extraído del propio proyecto: dependencias, configuración y servicios que usa en producción.
            </p>
          </div>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <ul className="flex flex-wrap gap-2.5">
              {p.technologies.map((t) => (
                <li key={t} className="rounded-lg bg-white/[0.03] px-3.5 py-2 font-mono text-[0.8rem] text-fog-100 ring-1 ring-inset ring-white/10">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Galería */}
      {p.gallery.length > 0 && (
        <section aria-labelledby="galeria" className="border-t border-white/[0.06] py-24 md:py-32">
          <div className="container-x">
            <SectionLabel id="galeria" index="05" label="Galería" accent={p.theme.accent} title="Interfaces reales." />
            <Gallery project={p} />
          </div>
        </section>
      )}

      {/* Resultado */}
      <section aria-labelledby="resultado" className="container-x border-t border-white/[0.06] py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel id="resultado" index="06" label="Resultado" accent={p.theme.accent} title="Qué se consiguió." />
          </div>
          <ul className="space-y-6 lg:col-span-7">
            {p.result.map((r, i) => (
              <li key={r}>
                <Reveal delay={i * 0.08} className="flex gap-5 border-b border-white/[0.07] pb-6 text-[1.15rem] leading-relaxed text-fog-100 md:text-[1.3rem]">
                  <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: p.theme.accent }} />
                  {r}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="case-cta" className="relative isolate overflow-hidden border-t border-white/[0.06] py-24 text-center md:py-36">
        <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(closest-side, ${p.theme.accent}1f, transparent)` }} />
        <div className="container-x">
          <h2 id="case-cta" className="display mx-auto max-w-4xl text-[clamp(2.3rem,5.6vw,4.8rem)]">
            ¿Quieres algo parecido <span className="serif-accent text-fog-300">para tu negocio?</span>
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contacto" size="lg">
              Cuéntanos tu proyecto
            </Button>
            {p.productionUrl && (
              <Button href={p.productionUrl} external variant="secondary" size="lg">
                Visitar proyecto
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Anterior / siguiente */}
      <nav aria-label="Otros proyectos" className="border-t border-white/[0.06]">
        <div className="grid md:grid-cols-2">
          <AdjacentLink project={prev} direction="prev" />
          <AdjacentLink project={next} direction="next" />
        </div>
      </nav>
    </article>
  );
}

function SectionLabel({ id, index, label, title, accent }: { id: string; index: string; label: string; title: string; accent: string }) {
  return (
    <div>
      <p className="eyebrow flex items-center gap-3">
        <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <span className="text-fog-300">{index}</span>
        <span aria-hidden className="h-px w-6 bg-white/15" />
        {label}
      </p>
      <h2 id={id} className="mt-5 text-[2rem] font-medium leading-tight tracking-[-0.045em] text-white md:text-[2.8rem]">
        {title}
      </h2>
    </div>
  );
}

function StoryBlock({ label, index, paragraphs, accent }: { label: string; index: string; paragraphs: string[]; accent: string }) {
  return (
    <div className="container-x grid gap-8 border-b border-white/[0.06] py-20 last:border-0 md:py-28 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <p className="font-mono text-xs" style={{ color: accent }}>
            {index}
          </p>
          <h2 className="mt-3 text-[2.2rem] font-medium tracking-[-0.045em] text-white md:text-[3.2rem]">{label}</h2>
        </div>
      </div>
      <div className="space-y-6 lg:col-span-7 lg:col-start-6">
        {paragraphs.map((t, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p className={cn("leading-relaxed", i === 0 ? "text-[1.3rem] text-fog-100 md:text-[1.55rem]" : "text-lg text-fog-400")}>{t}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Gallery({ project: p }: { project: Project }) {
  return (
    <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
      {p.gallery.map((g, i) => (
        <Reveal
          key={g.src}
          delay={(i % 3) * 0.06}
          className={cn(g.kind === "mobile" ? "col-span-1 md:col-span-4" : "col-span-2 md:col-span-8", "self-center")}
        >
          <figure>
            {g.kind === "mobile" ? (
              <PhoneFrame className="mx-auto max-w-[300px]">
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 300px, 45vw" className="object-cover object-top" />
              </PhoneFrame>
            ) : (
              <BrowserFrame>
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1320px) 830px, (min-width: 768px) 64vw, 92vw" className="object-cover object-top" />
              </BrowserFrame>
            )}
            <figcaption className="mt-3 text-center text-xs text-fog-500 md:text-left">{g.caption}</figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

function AdjacentLink({ project, direction }: { project: Project; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className={cn(
        "group relative isolate flex min-h-[220px] flex-col justify-end overflow-hidden p-8 md:min-h-[300px] md:p-12",
        isNext ? "md:items-end md:text-right" : "border-b border-white/[0.06] md:border-b-0 md:border-r",
      )}
    >
      <Image
        src={project.coverImage.src}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="-z-10 object-cover object-top opacity-15 transition-all duration-700 group-hover:scale-105 group-hover:opacity-30"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
      <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-fog-400">
        {!isNext && <ArrowLeft aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-1" />}
        {isNext ? "Siguiente proyecto" : "Proyecto anterior"}
        {isNext && <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-1" />}
      </span>
      <span className="mt-3 text-[1.8rem] font-medium tracking-[-0.04em] text-white md:text-[2.4rem]">{project.name}</span>
      <span className="mt-1 text-sm text-fog-400">{project.sector}</span>
    </Link>
  );
}
