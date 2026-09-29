import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { PROJECTS } from "@/data/projects";
import { HeroEvents } from "@/components/sections/hero/HeroEvents";
import { cn } from "@/lib/utils";

const HeroNetwork = dynamic(() => import("@/components/sections/hero/HeroNetwork").then((m) => m.HeroNetwork));

const LINES: { words: string[]; accent?: number }[] = [
  { words: ["Digitalizamos", "negocios."] },
  { words: ["Creamos", "lo", "que", "necesitan."], accent: 3 },
];

const CAPABILITIES = ["Webs", "Tiendas online", "Reservas", "CRM", "Automatización", "IA", "Software a medida"];

export function Hero() {
  let i = 0;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Fondo: brillo controlado + red de nodos */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -right-[20%] -top-[30%] h-[80vh] w-[80vw] rounded-full bg-[radial-gradient(closest-side,rgb(77_124_255/0.22),transparent)] blur-2xl" />
        <div className="absolute -bottom-[25%] right-[10%] h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgb(157_125_255/0.12),transparent)] blur-2xl" />
        <div className="fade-in absolute inset-0" style={{ animationDelay: "200ms" }}>
          <HeroNetwork />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink-950)_0%,rgb(5_6_8/0.85)_32%,rgb(5_6_8/0.1)_70%)] max-md:bg-[linear-gradient(180deg,rgb(5_6_8/0.3)_0%,rgb(5_6_8/0.75)_55%,var(--color-ink-950)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="container-x relative flex flex-1 flex-col justify-end pb-10 pt-28 md:pb-14 md:pt-36">
        <div>
            <p className="eyebrow fade-up flex items-center gap-3" style={{ animationDelay: "80ms" }}>
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan/60" />
                <span className="relative size-2 rounded-full bg-cyan" />
              </span>
              LocalIA Soluciones Digitales · Bizkaia
            </p>

            <h1
              id="hero-title"
              className="display mt-7 text-[clamp(2.75rem,6.7vw,6.4rem)] text-fog-50"
            >
              {LINES.map((line, li) => (
                <span key={li} className="block">
                  {line.words.map((word, wi) => {
                    const delay = 120 + i++ * 70;
                    const isAccent = line.accent === wi;
                    return (
                      <span key={wi} className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom">
                        <span
                          className={cn(
                            "word-rise inline-block",
                            isAccent && "serif-accent pr-[0.06em] text-gradient",
                          )}
                          style={{ animationDelay: `${delay}ms` }}
                        >
                          {word}
                        </span>
                        {wi < line.words.length - 1 && " "}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>
        </div>

        <div className="mt-10 grid items-start gap-12 md:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p
              className="fade-up max-w-xl text-[1.06rem] leading-relaxed text-fog-300 md:text-lg"
              style={{ animationDelay: "650ms" }}
            >
              Diseñamos webs, automatizamos procesos y desarrollamos el software que hace avanzar tu negocio:
              de la página que ven tus clientes al panel con el que trabajas cada día.
            </p>

            <div className="fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "780ms" }}>
              <Button href="/contacto" size="lg" className="w-full sm:w-auto">
                Cuéntanos tu proyecto
              </Button>
              <Button href="/#proyectos" variant="secondary" size="lg" className="w-full sm:w-auto">
                Ver proyectos
              </Button>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
            <HeroEvents />
          </div>
        </div>

        <div
          className="fade-up mt-16 flex flex-col gap-5 border-t border-white/[0.08] pt-6 md:mt-20 md:flex-row md:items-center md:justify-between"
          style={{ animationDelay: "950ms" }}
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fog-400" aria-label="Qué hacemos">
            {CAPABILITIES.map((c, idx) => (
              <li key={c} className="flex items-center gap-5">
                {idx > 0 && <span aria-hidden className="size-1 rounded-full bg-white/20" />}
                {c}
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-fog-400">
            <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
            {PROJECTS.length} proyectos en producción
          </p>
        </div>
      </div>
    </section>
  );
}
