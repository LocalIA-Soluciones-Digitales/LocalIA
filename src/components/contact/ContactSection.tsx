import { ContactForm } from "@/components/contact/ContactForm";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { SITE } from "@/data/site";

const NEXT_STEPS = [
  "Leemos tu mensaje y, si hace falta, te pedimos algún detalle.",
  "Hablamos sobre cómo trabajáis hoy y qué queréis conseguir.",
  "Te proponemos una solución concreta, con alcance y plazos claros.",
];

export function ContactSection({ headingLevel = "h2", index }: { headingLevel?: "h1" | "h2"; index?: string }) {
  const Heading = headingLevel;
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative border-t border-white/[0.06] py-24 md:py-32">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionIntro index={index} label="Contacto" />
          <Heading id="contacto-title" className="display mt-6 text-[clamp(2.3rem,5vw,4.2rem)]">
            Cuéntanos cómo funciona <span className="serif-accent text-fog-300">tu negocio.</span>
          </Heading>
          <p className="mt-7 max-w-md text-base leading-relaxed text-fog-400 md:text-lg">
            No hace falta que sepas qué tecnología necesitas. Explícanos el problema; la solución la pensamos juntos.
          </p>

          <ol className="mt-12 space-y-5 border-t border-white/[0.08] pt-8">
            {NEXT_STEPS.map((s, i) => (
              <li key={s} className="flex gap-4 text-sm leading-relaxed text-fog-300">
                <span className="font-mono text-xs text-signal-bright">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm text-fog-500">
            Trabajamos desde Bizkaia con negocios del País Vasco y, en remoto, de cualquier lugar.
            {SITE.email && (
              <>
                {" "}
                También puedes escribirnos a{" "}
                <a href={`mailto:${SITE.email}`} className="text-fog-100 underline underline-offset-4">
                  {SITE.email}
                </a>
                .
              </>
            )}
          </p>
        </div>

        <div className="lg:col-span-7">
          <ContactForm fallbackEmail={SITE.email} />
        </div>
      </div>
    </section>
  );
}
