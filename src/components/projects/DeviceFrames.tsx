import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
  accent?: string;
}

/** Marco de navegador minimalista. El contenido ocupa un área 16:10. */
export function BrowserFrame({ url, children, className, accent }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-ink-800 ring-1 ring-white/10",
        "shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9),0_0_0_1px_rgb(0_0_0/0.4)]",
        className,
      )}
      style={accent ? { boxShadow: `0 40px 120px -40px rgb(0 0 0 / 0.9), 0 30px 90px -60px ${accent}` } : undefined}
    >
      <div className="flex h-8 items-center gap-3 border-b border-white/[0.06] bg-ink-850 px-3 md:h-9">
        <div aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        {url && (
          <div className="mx-auto flex h-5 max-w-[60%] items-center gap-1.5 truncate rounded-md bg-white/[0.05] px-2.5 font-mono text-[0.62rem] text-fog-400 md:h-6 md:text-[0.68rem]">
            <Lock aria-hidden className="size-2.5 shrink-0" />
            <span className="truncate">{url}</span>
          </div>
        )}
        <div aria-hidden className="w-10" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">{children}</div>
    </div>
  );
}

/**
 * Proporción del área de pantalla bajo la barra de estado: la misma que las
 * capturas móviles (780×1328), así ninguna se recorta por los lados.
 */
export const PHONE_SCREEN_ASPECT = 780 / 1328;

/** Marco de móvil. El contenido ocupa exactamente PHONE_SCREEN_ASPECT. */
export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-[2.1rem] bg-ink-700 p-[7px] ring-1 ring-white/15",
        "shadow-[0_40px_90px_-30px_rgb(0_0_0/0.95),inset_0_0_0_1px_rgb(255_255_255/0.06)]",
        className,
      )}
    >
      {/* 7 % de barra de estado + pantalla 780:1328 → 780:1428 en total */}
      <div className="relative aspect-[780/1428] overflow-hidden rounded-[1.65rem] bg-black">
        {/* Barra de estado: la isla no tapa la cabecera de la captura */}
        <div className="absolute inset-x-0 bottom-0 top-[7%] overflow-hidden bg-ink-900">{children}</div>
        <div aria-hidden className="absolute left-1/2 top-[1.8%] z-10 h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-ink-800" />
      </div>
    </div>
  );
}
