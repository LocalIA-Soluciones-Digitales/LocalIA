import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/animations/TextReveal";
import { Reveal } from "@/components/animations/Reveal";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden border-t border-white/[0.06] py-28 md:py-44">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(77_124_255/0.2),rgb(157_125_255/0.06)_55%,transparent)]" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
      </div>
      <div className="container-x text-center">
        <p className="eyebrow">Tu próximo proyecto empieza aquí</p>
        <TextReveal
          id="cta-title"
          as="h2"
          lines={["¿Qué podríamos", { text: "automatizar en tu negocio?", className: "serif-accent text-gradient" }]}
          className="display mx-auto mt-8 max-w-5xl text-[clamp(2.5rem,7vw,6.2rem)]"
        />
        <Reveal delay={0.25}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-fog-300">
            Cuéntanos cómo funciona tu negocio. Nosotros pensamos cómo mejorarlo.
          </p>
          <div className="mt-11 flex justify-center">
            <Button href="/contacto" size="lg">
              Cuéntanos tu proyecto
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
