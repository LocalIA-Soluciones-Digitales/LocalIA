import Link from "next/link";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";
import { Counter } from "@/components/animations/Counter";
import { portfolioStats } from "@/lib/portfolio";

const WE_LOOK_AT = ["Tareas", "Procesos", "Información", "Herramientas", "Problemas", "Necesidades"];

const PRINCIPLES = [
  {
    title: "No vendemos software porque sí.",
    text: "Si una hoja de cálculo bien hecha resuelve tu problema, te lo diremos. Construimos cuando construir tiene sentido.",
  },
  {
    title: "Plataformas, no solo webs.",
    text: (
      <>
        La plataforma de hostelería que creamos para{" "}
        <Link href="/proyectos/palomita-bar" className="text-fog-100 underline underline-offset-4 hover:text-white">
          Palomita Bar
        </Link>{" "}
        da servicio hoy también a{" "}
        <Link href="/proyectos/bar-la-osa" className="text-fog-100 underline underline-offset-4 hover:text-white">
          La Osa
        </Link>
        , con los datos de cada negocio aislados.
      </>
    ),
  },
  {
    title: "Tecnología con criterio.",
    text: "Stack moderno y probado, seguridad desde el diseño y código que se puede mantener y ampliar.",
  },
];

export function AboutSection({ index = "08", headingLevel = "h2" }: { index?: string; headingLevel?: "h1" | "h2" }) {
  const stats = portfolioStats();
  const STATS = [
    { value: stats.projects, label: "proyectos en producción" },
    { value: stats.sectors, label: "sectores distintos" },
    { value: stats.technologies, label: "tecnologías en uso" },
  ];

  return (
    <section aria-labelledby="nosotros-title" className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-36">
      <div className="container-x">
        <SectionIntro index={index} label="Sobre LocalIA" />
        <TextReveal
          id="nosotros-title"
          as={headingLevel}
          lines={[
            "La tecnología debería adaptarse a tu negocio.",
            { text: "No tu negocio a la tecnología.", className: "serif-accent text-gradient" },
          ]}
          className="display mt-8 max-w-5xl text-[clamp(2.2rem,5.4vw,4.8rem)]"
        />

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-fog-300">
              Nuestro trabajo empieza entendiendo cómo funciona tu negocio. Después analizamos todo lo que lo mueve:
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-3" aria-label="Qué analizamos">
              {WE_LOOK_AT.map((w, i) => (
                <li key={w} className="flex items-center gap-3 text-[1.35rem] font-medium tracking-[-0.03em] text-white md:text-2xl">
                  {w}
                  {i < WE_LOOK_AT.length - 1 && <span aria-hidden className="size-1.5 rounded-full bg-signal" />}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-lg leading-relaxed text-fog-300">
              Y desarrollamos la solución adecuada: una web, una automatización, un panel o un sistema completo.
            </p>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-white/[0.08]">
              {PRINCIPLES.map((p, i) => (
                <li key={p.title} className="border-b border-white/[0.08] py-7">
                  <Reveal delay={i * 0.08}>
                    <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{p.title}</h3>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-fog-400">{p.text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-10 md:mt-28">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-none tracking-[-0.06em] text-white">
                  <Counter value={s.value} />
                </span>
                <span aria-hidden className="mt-3 block text-xs leading-snug text-fog-400 md:text-sm">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
