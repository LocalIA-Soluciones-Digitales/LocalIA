import { Hero } from "@/components/sections/hero/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { ServicesSection } from "@/components/sections/services/ServicesSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Showreel } from "@/components/sections/showreel/Showreel";
import { AutomationSection } from "@/components/sections/automation/AutomationSection";
import { AiSection } from "@/components/sections/ai/AiSection";
import { ProcessSection } from "@/components/sections/process/ProcessSection";
import { SectorsSection } from "@/components/sections/SectorsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { ContactSection } from "@/components/contact/ContactSection";
import { buildShowreel } from "@/lib/showreel";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/" });

/**
 * Narrativa: qué hacemos → lo que ya hemos construido → cómo lo hacemos
 * (automatización, IA, proceso) → para quién → quiénes somos → contacto.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <ServicesSection index="01" />
      <FeaturedProjects index="02" />
      <Showreel items={buildShowreel()} index="03" />
      <AutomationSection index="04" />
      <AiSection index="05" />
      <ProcessSection index="06" />
      <SectorsSection index="07" />
      <AboutSection index="08" />
      <FinalCta />
      <ContactSection index="09" />
    </>
  );
}
