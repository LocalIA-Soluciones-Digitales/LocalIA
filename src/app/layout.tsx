import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/data/site";
import { organizationSchema } from "@/lib/seo";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.shortName,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  keywords: [
    "desarrollo web Bizkaia",
    "diseño web",
    "digitalización de empresas",
    "automatización de procesos",
    "IA para empresas",
    "CRM a medida",
    "software a medida",
    "tienda online",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body className="grain min-h-dvh overflow-x-clip">
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-fog-50 px-4 py-2 text-sm font-medium text-ink-950 transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <JsonLd data={organizationSchema()} />
        <MotionProvider>
          <Navbar />
          <main id="contenido">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
