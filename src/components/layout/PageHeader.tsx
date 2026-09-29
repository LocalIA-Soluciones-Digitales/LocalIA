import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TextReveal } from "@/components/animations/TextReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

type Line = string | { text: string; className?: string };

interface PageHeaderProps {
  eyebrow: string;
  title: Line[];
  intro?: React.ReactNode;
  breadcrumbs: { name: string; path: string }[];
  children?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, intro, breadcrumbs, children }: PageHeaderProps) {
  const trail = [{ name: "Inicio", path: "/" }, ...breadcrumbs];
  return (
    <header className="relative isolate overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44">
      <JsonLd data={breadcrumbSchema(trail)} />
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -right-[15%] -top-[40%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgb(77_124_255/0.16),transparent)] blur-2xl" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      </div>
      <div className="container-x">
        <nav aria-label="Migas de pan" className="fade-up">
          <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fog-500">
            {trail.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight aria-hidden className="size-3" />}
                {i < trail.length - 1 ? (
                  <Link href={c.path} className="transition-colors hover:text-fog-100">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-fog-300">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow fade-up mt-10 flex items-center gap-3" style={{ animationDelay: "80ms" }}>
          <span aria-hidden className="size-1.5 rounded-full bg-signal" />
          {eyebrow}
        </p>
        <TextReveal as="h1" immediate lines={title} delay={0.1} className="display mt-6 max-w-5xl text-[clamp(2.6rem,6.4vw,5.8rem)]" />
        {intro && (
          <div className="fade-up mt-8 max-w-2xl text-lg leading-relaxed text-fog-300" style={{ animationDelay: "450ms" }}>
            {intro}
          </div>
        )}
        {children}
      </div>
    </header>
  );
}
