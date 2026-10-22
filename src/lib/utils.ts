import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Segundos en formato de reloj: 57 → "0:57", 64.3 → "1:04". */
export function formatClock(seconds: number): string {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Segundos en duración ISO 8601 para datos estructurados: 57 → "PT57S". */
export function isoDuration(seconds: number): string {
  const s = Math.round(seconds);
  return `PT${s >= 60 ? `${Math.floor(s / 60)}M` : ""}${s % 60}S`;
}

/** Dominio legible a partir de una URL ("https://www.x.com/" → "x.com"). */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
