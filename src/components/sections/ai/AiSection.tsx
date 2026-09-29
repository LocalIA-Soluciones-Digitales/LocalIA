import { SectionIntro } from "@/components/ui/SectionIntro";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";
import { AiDemo } from "@/components/sections/ai/AiDemo";

const USE_CASES = [
  { title: "Asistentes para tu equipo", text: "Responden con la información de tu negocio: procedimientos, catálogo, tarifas." },
  { title: "Atención al cliente", text: "Primera respuesta en la web o WhatsApp a cualquier hora, y paso a una persona cuando hace falta." },
  { title: "Documentos", text: "Facturas, albaranes o pedidos por email: extraer los datos y registrarlos sin teclear." },
  { title: "Clasificación automática", text: "Emails, solicitudes y avisos ordenados por tipo y urgencia al llegar." },
  { title: "Análisis de información", text: "Resúmenes de ventas, reseñas o incidencias en lenguaje claro." },
  { title: "Generación de contenido", text: "Descripciones de producto, respuestas a reseñas o fichas, revisadas por ti." },
  { title: "Búsqueda inteligente", text: "Encontrar un producto o un documento describiéndolo con tus palabras." },
  { title: "IA conectada al CRM", text: "Cualificar contactos y proponer el siguiente paso con cada solicitud." },
];

export function AiSection({ index = "05" }: { index?: string }) {
  return (
    <section aria-labelledby="ia-title" className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-36">
      <div aria-hidden className="absolute -right-[10%] top-[10%] -z-10 h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgb(157_125_255/0.12),transparent)] blur-2xl" />

      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionIntro index={index} label="Inteligencia artificial" tone="violet" />
            <TextReveal
              id="ia-title"
              as="h2"
              lines={["IA aplicada a", { text: "problemas reales.", className: "serif-accent text-fog-300" }]}
              className="display mt-6 text-[clamp(2.3rem,5.2vw,4.3rem)]"
            />
            <Reveal delay={0.15}>
              <p className="mt-8 text-base leading-relaxed text-fog-400 md:text-lg">
                Usamos IA donde ahorra trabajo de verdad, conectada a tus datos y a tus herramientas. Con límites claros,
                revisión humana cuando hace falta y sin sacar información que no debe salir de tu negocio.
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7 lg:pt-4" delay={0.1}>
            <AiDemo />
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-x-10 border-t border-white/[0.08] sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {USE_CASES.map((u, i) => (
            <li key={u.title} className="border-b border-white/[0.08] py-7">
              <Reveal delay={(i % 4) * 0.06}>
                <p className="font-mono text-[0.68rem] text-violet">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[1.05rem] font-medium tracking-[-0.02em] text-white">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog-400">{u.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
