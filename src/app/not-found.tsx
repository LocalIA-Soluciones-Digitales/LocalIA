import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden pt-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
      <div className="container-x">
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-6 text-[clamp(2.6rem,7vw,6rem)]">
          Esta página <span className="serif-accent text-fog-300">no existe.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-fog-400">Puede que el enlace haya cambiado. Lo que sí existe son nuestros proyectos.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/">Volver al inicio</Button>
          <Button href="/proyectos" variant="secondary">
            Ver proyectos
          </Button>
        </div>
      </div>
    </section>
  );
}
