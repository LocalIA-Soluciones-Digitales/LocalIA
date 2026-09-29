"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useScroll, useTransform } from "framer-motion";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { TextReveal } from "@/components/animations/TextReveal";
import { PROCESS, type ProcessStep } from "@/data/process";
import { cn } from "@/lib/utils";

export function ProcessSection({ index = "06", headingLevel = "h2" }: { index?: string; headingLevel?: "h1" | "h2" }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const current = PROCESS[active];

  return (
    <section aria-labelledby="proceso-title" className="relative border-t border-white/[0.06] py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionIntro index={index} label="Proceso" />
            <TextReveal
              id="proceso-title"
              as={headingLevel}
              lines={["De entender el problema", { text: "a ponerlo en producción.", className: "serif-accent text-fog-300" }]}
              className="display mt-6 text-[clamp(2.2rem,4.8vw,4rem)]"
            />
            <div aria-hidden className="mt-14 hidden items-end gap-6 lg:flex">
              <div className="relative h-[8.5rem] w-[11rem] overflow-hidden">
                <AnimatePresence initial={false}>
                  <m.span
                    key={current.index}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-0 left-0 font-mono text-[8rem] leading-none tracking-[-0.08em] text-gradient"
                  >
                    {current.index}
                  </m.span>
                </AnimatePresence>
              </div>
              <p className="pb-4 font-mono text-xs uppercase tracking-[0.14em] text-fog-500">
                de {String(PROCESS.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div aria-hidden className="absolute bottom-0 left-[0.3rem] top-0 w-px bg-white/10 md:left-[0.45rem]" />
          <m.div
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute bottom-0 left-[0.3rem] top-0 w-px origin-top bg-gradient-to-b from-signal via-cyan to-violet md:left-[0.45rem]"
          />
          <ol ref={listRef} className="relative">
            {PROCESS.map((step, i) => (
              <StepItem key={step.index} step={step} active={i === active} passed={i < active} onActive={() => setActive(i)} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepItem({ step, active, passed, onActive }: { step: ProcessStep; active: boolean; passed: boolean; onActive: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inCenter = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inCenter) onActive();
  }, [inCenter, onActive]);

  return (
    <li ref={ref} className="relative pb-14 pl-10 last:pb-0 md:pb-20 md:pl-14">
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-2 size-[0.65rem] rounded-full border transition-all duration-500 md:size-[0.95rem]",
          active ? "scale-110 border-cyan bg-cyan shadow-[0_0_20px_rgb(63_216_232/0.8)]" : passed ? "border-signal bg-signal" : "border-white/25 bg-ink-950",
        )}
      />
      <p className={cn("font-mono text-xs transition-colors duration-500", active ? "text-cyan" : "text-fog-500")}>{step.index}</p>
      <h3
        className={cn(
          "mt-2 text-[1.9rem] font-medium leading-none tracking-[-0.045em] transition-colors duration-500 md:text-[2.7rem]",
          active || passed ? "text-white" : "text-fog-500",
        )}
      >
        {step.title}
      </h3>
      <p className={cn("mt-4 text-[1.02rem] transition-colors duration-500", active ? "text-fog-100" : "text-fog-400")}>{step.description}</p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-fog-500">{step.detail}</p>
    </li>
  );
}
