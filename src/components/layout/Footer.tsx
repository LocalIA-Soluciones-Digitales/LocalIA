import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { FOOTER_NAV } from "@/data/navigation";
import { PROJECTS } from "@/data/projects";
import { SITE } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-950">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo withTagline />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-fog-400">
            Digitalizamos negocios: webs, tiendas online, paneles de gestión, automatizaciones e IA aplicada.
            Desde Bizkaia, para clientes de aquí y de cualquier lugar.
          </p>
          {SITE.email && (
            <a href={`mailto:${SITE.email}`} className="mt-6 inline-block text-sm text-fog-100 underline-offset-4 hover:underline">
              {SITE.email}
            </a>
          )}
        </div>

        <nav aria-label="Pie de página" className="md:col-span-3">
          <p className="eyebrow mb-4">Navegación</p>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-fog-300 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-fog-300 transition-colors hover:text-white"
              >
                GitHub <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow mb-4">Proyectos</p>
          <ul className="space-y-2.5 text-sm">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link href={`/proyectos/${p.slug}`} className="text-fog-300 transition-colors hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-fog-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.name}</p>
          <p>Bizkaia · País Vasco · En remoto</p>
        </div>
      </div>
    </footer>
  );
}
