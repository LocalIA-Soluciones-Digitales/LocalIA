import { cn } from "@/lib/utils";

interface SectionIntroProps {
  index?: string;
  label: string;
  className?: string;
  tone?: "signal" | "cyan" | "violet";
}

const tones = { signal: "bg-signal", cyan: "bg-cyan", violet: "bg-violet" };

/** Etiqueta editorial de sección: "● 02 — Servicios". */
export function SectionIntro({ index, label, className, tone = "signal" }: SectionIntroProps) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", tones[tone])} />
      {index && <span className="text-fog-300">{index}</span>}
      {index && <span aria-hidden className="h-px w-6 bg-white/15" />}
      <span>{label}</span>
    </p>
  );
}
