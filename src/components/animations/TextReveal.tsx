"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";

type Line = string | { text: string; className?: string };

interface TextRevealProps {
  lines: Line[];
  id?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  /** Anima al montar (hero) en lugar de al entrar en pantalla. */
  immediate?: boolean;
}

/** Titular que aparece palabra a palabra, con máscara por línea. */
export function TextReveal({ lines, id, as: Tag = "h2", className, delay = 0, immediate = false }: TextRevealProps) {
  let wordIndex = 0;
  const trigger = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag id={id} className={className}>
      <m.span initial="hidden" {...trigger} className="block">
        {lines.map((line, li) => {
          const { text, className: lineClass } = typeof line === "string" ? { text: line, className: undefined } : line;
          const words = text.split(" ");
          return (
            <span key={li} className="block">
              {words.map((word, wi) => {
                const i = wordIndex++;
                return (
                  <span key={wi} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                    <m.span
                      className={cn("inline-block will-change-transform", lineClass)}
                      variants={{
                        hidden: { y: "105%", opacity: 0 },
                        show: {
                          y: "0%",
                          opacity: 1,
                          transition: { duration: 0.9, delay: delay + i * 0.055, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                    >
                      {word}
                    </m.span>
                    {wi < words.length - 1 ? " " : null}
                  </span>
                );
              })}
            </span>
          );
        })}
      </m.span>
    </Tag>
  );
}
