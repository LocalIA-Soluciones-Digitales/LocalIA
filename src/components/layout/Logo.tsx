import { cn } from "@/lib/utils";

/**
 * Wordmark de LocalIA. El símbolo es una "L" que termina en un nodo
 * conectado: la unidad mínima de todo lo que construimos.
 */
export function Logo({ className, withTagline = false }: { className?: string; withTagline?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 28 28" aria-hidden className="size-7 shrink-0">
        <defs>
          <linearGradient id="lg-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7a9dff" />
            <stop offset="1" stopColor="#3fd8e8" />
          </linearGradient>
        </defs>
        <rect x="0.5" y="0.5" width="27" height="27" rx="8" fill="#0d0f13" stroke="rgb(255 255 255 / 0.14)" />
        <path d="M8.5 7.5v13h6.5" fill="none" stroke="#e9ebef" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 20.5 19.6 11.4" stroke="url(#lg-mark)" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="20.2" cy="9.6" r="2.7" fill="url(#lg-mark)" />
        <circle cx="15" cy="20.5" r="1.5" fill="#e9ebef" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[1.1rem] font-semibold tracking-[-0.045em] text-fog-50">
          Local<span className="text-gradient font-mono text-[0.95em] font-semibold tracking-[-0.06em]">IA</span>
        </span>
        {withTagline && <span className="eyebrow mt-1.5 text-[0.58rem]">Soluciones digitales</span>}
      </span>
    </span>
  );
}
