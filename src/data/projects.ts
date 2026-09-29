/**
 * Portfolio de LocalIA — fuente única de verdad.
 *
 * Añadir un proyecto nuevo:
 *   1. Crea public/projects/<slug>/ con las capturas (ver convenciones en
 *      scripts/optimize-media.mjs) y ejecuta `npm run media`.
 *   2. Añade una entrada con `defineProject({...})` al array PROJECTS.
 *   3. Listo: aparece en /proyectos, en la home si `featured: true`, en el
 *      showreel, en el sitemap y con su propia ruta /proyectos/<slug>,
 *      metadata SEO e imagen Open Graph.
 *
 * Regla editorial: todo lo que aparece aquí está verificado en el
 * repositorio o en la web en producción del proyecto. Sin métricas,
 * testimonios ni tecnologías inventadas.
 */
import { projectMedia, type Media } from "@/lib/media";
import type { ServiceKey } from "@/data/services";

export type SectorKey = "hosteleria" | "alimentacion" | "servicios-tecnicos" | "ecommerce" | "reformas";

export interface ProjectTheme {
  /** Color de acento derivado de la identidad del proyecto. */
  accent: string;
  /** Fondo profundo para las secciones del proyecto. */
  surface: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface GalleryItem extends Media {
  kind: "desktop" | "mobile";
  caption: string;
}

interface ProjectInput {
  slug: string;
  name: string;
  client: string;
  sector: string;
  sectorKey: SectorKey;
  location: string;
  year: number;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  challenge: string[];
  solution: string[];
  features: ProjectFeature[];
  result: string[];
  /** Frases cortas para las tarjetas de portfolio. */
  highlights: string[];
  services: ServiceKey[];
  technologies: string[];
  productionUrl?: string;
  /** Solo referencia interna: no se muestra en la web. */
  repositoryUrl?: string;
  featured: boolean;
  theme: ProjectTheme;
  hasVideo: boolean;
  gallery: { file: string; kind: "desktop" | "mobile"; caption: string }[];
}

export interface Project extends Omit<ProjectInput, "gallery" | "hasVideo"> {
  coverImage: Media;
  mobileImage: Media;
  fullPage: { desktop: Media; mobile: Media };
  video?: { src: string; poster: string };
  gallery: GalleryItem[];
}

function defineProject(p: ProjectInput): Project {
  const m = (file: string, alt: string) => projectMedia(p.slug, file, alt);
  return {
    ...p,
    coverImage: m("desktop-home.jpg", `Página de inicio de la web de ${p.name} en escritorio`),
    mobileImage: m("mobile-home.jpg", `Página de inicio de la web de ${p.name} en móvil`),
    fullPage: {
      desktop: m("desktop-full.webp", `Página completa de ${p.name} en escritorio`),
      mobile: m("mobile-full.webp", `Página completa de ${p.name} en móvil`),
    },
    video: p.hasVideo
      ? { src: `/projects/${p.slug}/scroll.mp4`, poster: `/projects/${p.slug}/scroll-poster.jpg` }
      : undefined,
    gallery: p.gallery.map((g) => ({ ...m(g.file, `${g.caption} — ${p.name}`), kind: g.kind, caption: g.caption })),
  };
}

export const PROJECTS: Project[] = [
  defineProject({
    slug: "pescados-mariscos-arrantza",
    name: "Pescados y Mariscos Arrantza",
    client: "Pescadería familiar con dos tiendas",
    sector: "Alimentación y comercio local",
    sectorKey: "alimentacion",
    location: "Erandio, Bizkaia",
    year: 2026,
    tagline: "Del mostrador a la web, sincronizado con las básculas.",
    shortDescription:
      "Web, tienda online y panel de gestión para una pescadería de Erandio, conectados a las básculas del mostrador.",
    longDescription:
      "Arrantza trabaja con pescado del Cantábrico comprado cada mañana en lonja. Construimos su web bilingüe, el catálogo diario con pedidos y reservas, un área privada para hostelería y un panel de gestión en tiempo real. El stock y los precios de la web salen de las mismas básculas que usan en la tienda.",
    challenge: [
      "En una pescadería el género cambia cada día: lo que llega de lonja, los precios de mercado y el stock disponible no se pueden mantener a mano en una web.",
      "Además, las dos tiendas comparten género y facturación, atienden a particulares y a restaurantes con condiciones distintas, y en campañas como Navidad reciben muchos encargos anticipados.",
    ],
    solution: [
      "Una web pública en castellano y euskera con catálogo diario, pedidos, reservas por campaña y un acceso privado para clientes de hostelería.",
      "Detrás, un panel de gestión instalable en el móvil o la tablet del mostrador y una integración directa con las básculas BM5 de las dos tiendas: cada venta descuenta stock y los cambios de precio llegan a la web solos.",
    ],
    features: [
      { title: "Integración con básculas", description: "Sincronización programada con las básculas BM5 de ambas tiendas: las ventas a peso descuentan stock y se registran para la facturación diaria." },
      { title: "Precios siempre al día", description: "Lectura automática del catálogo de la báscula cada hora para actualizar precios en la web y avisar de los cambios." },
      { title: "Catálogo y pedidos online", description: "Catálogo con búsqueda y filtros, carrito, pedido para recogida o reparto y pago online con Stripe." },
      { title: "Reservas por campaña", description: "Encargos anticipados para fechas clave como Navidad, con ventana de reserva y fecha de recogida." },
      { title: "Área de hostelería", description: "Acceso privado con código y PIN para restaurantes, con su propia lista de productos y precios." },
      { title: "Panel en tiempo real", description: "Pedidos, reservas, reseñas, clientes, stock, caja e informes. Se actualiza solo y es instalable como app (PWA)." },
      { title: "Avisos automáticos", description: "Notificaciones push al entrar un pedido o reserva y alertas por email cuando un producto baja de su stock mínimo." },
      { title: "Bilingüe y newsletter", description: "Castellano y euskera, y newsletter con doble confirmación y baja por enlace." },
    ],
    result: [
      "En producción en pescaderiaarrantza.com.",
      "El precio y el stock que ve el cliente en la web salen de las mismas básculas que usa el mostrador, sin que nadie tenga que actualizarlos a mano.",
      "Pedidos, reservas, hostelería y caja se gestionan desde un único panel, también desde el móvil.",
    ],
    highlights: ["Integración con básculas BM5", "Panel de gestión en tiempo real", "Castellano y euskera"],
    services: ["web", "ecommerce", "crm", "automatizacion", "integraciones", "reservas", "a-medida"],
    technologies: [
      "React 19",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "React Router",
      "i18next",
      "Recharts",
      "Supabase",
      "Supabase Edge Functions",
      "Supabase Realtime",
      "Stripe",
      "Resend",
      "Web Push",
      "Cloudflare Turnstile",
      "Vitest",
    ],
    productionUrl: "https://pescaderiaarrantza.com",
    repositoryUrl: "https://github.com/LocalIA-Soluciones-Digitales/Pescados-Mariscos-Arrantza",
    featured: true,
    theme: { accent: "#7cc3f5", surface: "#08131d" },
    hasVideo: true,
    gallery: [
      { file: "desktop-productos.jpg", kind: "desktop", caption: "Catálogo diario con precios de mercado" },
      { file: "mobile-productos.jpg", kind: "mobile", caption: "Catálogo en móvil" },
      { file: "desktop-reservas.jpg", kind: "desktop", caption: "Reservas para campaña de Navidad" },
      { file: "desktop-hosteleria.jpg", kind: "desktop", caption: "Acceso privado para hostelería" },
      { file: "mobile-hosteleria.jpg", kind: "mobile", caption: "Hostelería en móvil" },
    ],
  }),

  defineProject({
    slug: "palomita-bar",
    name: "Palomita Bar",
    client: "Coctelería y picoteo",
    sector: "Hostelería",
    sectorKey: "hosteleria",
    location: "Barakaldo, Bizkaia",
    year: 2026,
    tagline: "Pedido en mesa, cocina en tiempo real y cuenta dividida.",
    shortDescription:
      "Web y plataforma de pedido en mesa: el cliente pide desde el QR, cocina y barra lo reciben al instante y cada comensal puede pagar su parte.",
    longDescription:
      "Para Palomita Bar desarrollamos mucho más que una web: una plataforma de hostelería completa. La carta es el punto de entrada del pedido en mesa, y detrás hay tableros de cocina y barra en tiempo real, plano de salón, reservas, fidelización e impresión automática de comandas.",
    challenge: [
      "Un bar de cócteles con carta amplia necesita que el cliente pueda pedir sin esperar, que cocina y barra reciban cada pedido al instante y que el salón no pierda el control de las mesas.",
      "En grupos, además, la cuenta compartida es un problema clásico: quién ha pedido qué y cómo paga cada uno.",
    ],
    solution: [
      "Una web pública con identidad oscura propia y una carta que funciona como punto de pedido: cada mesa tiene su QR y el cliente elige si pide con su grupo o por separado, con reparto de cuenta y pago individual.",
      "En el local, un panel con tableros de cocina y barra que avanzan cada pedido por estación, plano de salón interactivo e impresión automática de comandas en la impresora térmica de cocina.",
    ],
    features: [
      { title: "Pedido en mesa con QR", description: "Carta navegable por categorías con carrito integrado. Cada mesa tiene su propio código." },
      { title: "Juntos o por separado", description: "El grupo decide si hace un único pedido o si cada comensal pide y paga lo suyo con Stripe." },
      { title: "Cocina y barra en tiempo real", description: "Cada estación acepta y prepara solo lo suyo. Un pedido mixto no está listo hasta que ambas terminan." },
      { title: "Impresión de comandas", description: "Servicio propio que envía las comandas a la impresora térmica de cocina sin depender del navegador." },
      { title: "Plano de salón", description: "Vista interactiva de las mesas con su estado para gestionar el servicio desde la barra." },
      { title: "Reservas y fidelización", description: "Reservas online, programa de fidelización con premios y gestión de reseñas." },
      { title: "Informes y ventas", description: "Resumen de ventas, clientes, visitas y registro de errores para el administrador." },
      { title: "Plataforma multi-negocio", description: "Construida sobre una base de datos compartida y aislada por negocio, reutilizable por otros locales." },
    ],
    result: [
      "En producción en palomita-bar.vercel.app.",
      "La plataforma se diseñó para reutilizarse: el mismo sistema da servicio hoy a otro negocio de hostelería (Bar de Tapas La Osa) sin tocar los datos de ninguno de los dos.",
    ],
    highlights: ["Pedido en mesa con QR", "Cocina y barra en tiempo real", "Pago por comensal"],
    services: ["web", "reservas", "crm", "automatizacion", "integraciones", "a-medida"],
    technologies: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Supabase Realtime",
      "PostgreSQL (RLS)",
      "Stripe Checkout",
      "Node.js",
      "Vercel",
    ],
    productionUrl: "https://palomita-bar.vercel.app",
    repositoryUrl: "https://github.com/LocalIA-Soluciones-Digitales/Palomita-Bar",
    featured: true,
    theme: { accent: "#f26bc9", surface: "#130a1a" },
    hasVideo: true,
    gallery: [
      { file: "desktop-pedir.jpg", kind: "desktop", caption: "Inicio del pedido en mesa" },
      { file: "mobile-carta.jpg", kind: "mobile", caption: "Carta de picoteo en móvil" },
      { file: "desktop-cocteleria.jpg", kind: "desktop", caption: "Carta de coctelería" },
      { file: "desktop-carta.jpg", kind: "desktop", caption: "Carta con filtros por categoría" },
      { file: "mobile-cocteleria.jpg", kind: "mobile", caption: "Coctelería en móvil" },
      { file: "desktop-reservar.jpg", kind: "desktop", caption: "Reservas online" },
    ],
  }),

  defineProject({
    slug: "electric-instalaciones-electricas",
    name: "Electric Instalaciones Eléctricas",
    client: "Electricista de urgencias",
    sector: "Servicios técnicos",
    sectorKey: "servicios-tecnicos",
    location: "Barakaldo, Bizkaia",
    year: 2026,
    tagline: "Una web construida para que suene el teléfono.",
    shortDescription:
      "Web de captación para un electricista de urgencias: SEO local por servicio y localidad, y un diagnóstico guiado que convierte una avería en un aviso completo por WhatsApp.",
    longDescription:
      "Un electricista de urgencias vive de aparecer en Google cuando alguien se queda sin luz y de que esa persona le contacte en segundos. La web está pensada para eso: una estructura SEO por servicio y localidad y una forma de pedir ayuda que entrega al profesional toda la información que necesita.",
    challenge: [
      "Las búsquedas de electricista son locales y urgentes: hay que aparecer en cada municipio y convertir la visita en contacto rápido.",
      "Y un aviso sin información obliga a llamar de vuelta para preguntar qué pasa, dónde y si hay peligro.",
    ],
    solution: [
      "Una arquitectura SEO en silo con páginas por servicio y por localidad generadas desde datos, con datos estructurados en todas ellas.",
      "Un widget de contacto con dos vías: avería urgente con diagnóstico guiado, aviso de peligro y foto adjunta, o presupuesto sin compromiso. Ambas generan un mensaje completo de WhatsApp y una notificación interna por email.",
    ],
    features: [
      { title: "Diagnóstico guiado de averías", description: "Preguntas sencillas que identifican el problema, avisan si hay peligro y permiten adjuntar una foto." },
      { title: "Aviso completo por WhatsApp", description: "El formulario construye el mensaje con toda la información y abre WhatsApp listo para enviar." },
      { title: "Notificación interna y respaldo", description: "Cada aviso llega también por email, con límite de envíos y copia de seguridad de cada solicitud." },
      { title: "SEO local en silo", description: "7 páginas de servicio y 10 de localidad generadas desde datos, con metadatos únicos y sitemap automático." },
      { title: "Datos estructurados", description: "Schema.org de negocio local, servicios, FAQ y breadcrumbs en todas las páginas." },
      { title: "Medición de conversiones", description: "Eventos de llamada, WhatsApp y formulario preparados para Google Ads y Meta, con Consent Mode v2." },
    ],
    result: [
      "En producción en electricbarakaldo.com.",
      "Cada página de servicio y localidad lleva al mismo punto de contacto, y cada aviso llega con la información necesaria para responder sin volver a preguntar.",
    ],
    highlights: ["Diagnóstico guiado de averías", "SEO local por servicio y localidad", "Leads directos a WhatsApp"],
    services: ["web", "seo", "automatizacion", "integraciones"],
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Framer Motion",
      "Zod",
      "Leaflet",
      "Resend",
      "Upstash Redis",
      "Cloudflare Turnstile",
      "Google Tag Manager",
      "Vitest",
      "Docker",
    ],
    productionUrl: "https://electricbarakaldo.com",
    repositoryUrl: "https://github.com/LocalIA-Soluciones-Digitales/Electric-Instalaciones-Electricas",
    featured: true,
    theme: { accent: "#f7c52b", surface: "#0d0e10" },
    hasVideo: true,
    gallery: [
      { file: "desktop-servicios.jpg", kind: "desktop", caption: "Servicios con presupuesto directo" },
      { file: "mobile-servicios.jpg", kind: "mobile", caption: "Servicios en móvil" },
      { file: "desktop-localidad.jpg", kind: "desktop", caption: "Página de localidad para SEO local" },
    ],
  }),

  defineProject({
    slug: "amway-barakaldo",
    name: "Amway Barakaldo",
    client: "Distribuidor independiente",
    sector: "E-commerce",
    sectorKey: "ecommerce",
    location: "Barakaldo, Bizkaia",
    year: 2026,
    tagline: "Una tienda premium para un catálogo de más de 250 productos.",
    shortDescription:
      "Tienda online para un distribuidor independiente: catálogo por líneas, páginas editoriales, pago con Stripe, recogida en local y panel con avisos push.",
    longDescription:
      "Un catálogo muy amplio y variado —nutrición, belleza, hogar, bebidas energéticas, tratamiento de agua— necesitaba una tienda que se sintiera cuidada y que llevara al cliente del descubrimiento al pedido sin fricción, con la atención cercana por WhatsApp que caracteriza al negocio.",
    challenge: [
      "Más de 250 productos en líneas muy distintas, con material de marca oficial y un modelo de venta propio: atención personal por WhatsApp y recogida en el local.",
      "La tienda tenía que transmitir calidad y, a la vez, ser rápida y fácil de usar en el móvil.",
    ],
    solution: [
      "Una tienda con catálogo por categorías y páginas editoriales para cada línea de producto, con escenas animadas y narrativa de scroll donde aportan.",
      "Carrito y pago con Stripe, cuenta de cliente, WhatsApp con mensajes predefinidos y horario de atención en tiempo real, y un panel de administración instalable que avisa de cada pedido con notificaciones push.",
    ],
    features: [
      { title: "Catálogo por líneas", description: "Nutrición, belleza y hogar con búsqueda y categorías, más ofertas y más vendidos." },
      { title: "Páginas editoriales", description: "Historias de producto con scroll narrativo, vídeo oficial bajo demanda y escenas 3D ligeras." },
      { title: "Carrito y pago con Stripe", description: "Checkout con tarjeta, confirmación de pedido y recogida en el local." },
      { title: "Cuenta de cliente", description: "Acceso de clientes con recuperación de contraseña." },
      { title: "WhatsApp inteligente", description: "Mensajes predefinidos según la intención y aviso de si se está atendiendo en ese momento." },
      { title: "Panel con avisos push", description: "Administración instalable como app con notificaciones de nuevos pedidos." },
    ],
    result: [
      "En producción en amway-premium.vercel.app.",
      "Un catálogo extenso presentado como una tienda premium, con el proceso de compra y la atención personal conectados.",
    ],
    highlights: ["Más de 250 productos", "Pago con Stripe y avisos push", "Narrativa de scroll y 3D"],
    services: ["web", "ecommerce", "crm", "automatizacion"],
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Framer Motion",
      "GSAP",
      "Lenis",
      "Three.js",
      "React Three Fiber",
      "Supabase",
      "Stripe",
      "Web Push",
    ],
    productionUrl: "https://amway-premium.vercel.app",
    repositoryUrl: "https://github.com/LocalIA-Soluciones-Digitales/amway-premium",
    featured: true,
    theme: { accent: "#d9bb8b", surface: "#12100c" },
    hasVideo: true,
    gallery: [
      { file: "desktop-xs-energy.jpg", kind: "desktop", caption: "Página editorial XS Energy" },
      { file: "mobile-catalogo.jpg", kind: "mobile", caption: "Catálogo en móvil" },
      { file: "desktop-catalogo.jpg", kind: "desktop", caption: "Catálogo por categorías" },
      { file: "desktop-belleza.jpg", kind: "desktop", caption: "Línea de belleza" },
      { file: "mobile-xs-energy.jpg", kind: "mobile", caption: "XS Energy en móvil" },
    ],
  }),

  defineProject({
    slug: "reformas-integrales-martin",
    name: "Reformas Integrales Martín",
    client: "Empresa de reformas integrales",
    sector: "Construcción y reformas",
    sectorKey: "reformas",
    location: "Barakaldo, Bizkaia",
    year: 2026,
    tagline: "Web corporativa con calculadora de presupuesto y base preparada para IA.",
    shortDescription:
      "Web corporativa cinematográfica con galería antes/después, calculadora de presupuesto y una arquitectura de agentes lista para conectar IA.",
    longDescription:
      "Una empresa de reformas vende confianza y resultados visibles. Construimos una web con vídeo, galería de proyectos con comparador antes/después y una calculadora de presupuesto orientativo. Por dentro, la captación de contactos se organiza en agentes preparados para incorporar IA.",
    challenge: [
      "Quien busca una reforma quiere ver trabajos, entender el proceso y hacerse una idea del precio antes de llamar.",
      "Y cada solicitud que llega hay que valorarla, presupuestarla y seguirla.",
    ],
    solution: [
      "Una web con vídeo de fondo, galería filtrable con comparador antes/después, proceso de trabajo y una calculadora que da una estimación orientativa.",
      "La captación funciona sobre una capa de agentes (cualificación de contactos, presupuestos, seguimiento, reseñas, contenidos) con lógica propia hoy, diseñada para conectar un modelo de IA sin rediseñar nada.",
    ],
    features: [
      { title: "Galería antes/después", description: "Proyectos filtrables por tipo, con comparador deslizante y visor a pantalla completa." },
      { title: "Calculadora de presupuesto", description: "Estimación orientativa según tipo de inmueble y reforma, conectada a la API de captación." },
      { title: "Arquitectura de agentes", description: "Seis agentes con una interfaz común (cualificación, presupuesto, contenido, imagen, reseñas y seguimiento) preparados para IA." },
      { title: "SEO local", description: "Datos estructurados, sitemap y robots dinámicos e imagen Open Graph generada." },
      { title: "Conversión móvil", description: "Barra de contacto fija en móvil y acceso directo a WhatsApp." },
    ],
    result: [
      "En producción en reformas-integrales-martin.vercel.app.",
      "La web ya tiene definidos los puntos de integración para IA: conectar un modelo es un cambio interno en cada agente, no un rediseño.",
    ],
    highlights: ["Calculadora de presupuesto", "Antes/después interactivo", "Agentes preparados para IA"],
    services: ["web", "seo", "a-medida"],
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Framer Motion",
      "GSAP",
      "Radix UI",
      "Zod",
    ],
    productionUrl: "https://reformas-integrales-martin.vercel.app",
    repositoryUrl: "https://github.com/LocalIA-Soluciones-Digitales/Reformas-Integrales-Martin",
    featured: false,
    theme: { accent: "#f07a36", surface: "#120c08" },
    hasVideo: true,
    gallery: [
      { file: "desktop-proyectos.jpg", kind: "desktop", caption: "Galería de proyectos" },
      { file: "mobile-proyectos.jpg", kind: "mobile", caption: "Proyectos en móvil" },
      { file: "desktop-servicios.jpg", kind: "desktop", caption: "Servicios" },
      { file: "desktop-contacto.jpg", kind: "desktop", caption: "Contacto y calculadora de presupuesto" },
      { file: "mobile-contacto.jpg", kind: "mobile", caption: "Contacto en móvil" },
    ],
  }),

  defineProject({
    slug: "bar-la-osa",
    name: "Bar de Tapas La Osa",
    client: "Bar de tapas con terraza",
    sector: "Hostelería",
    sectorKey: "hosteleria",
    location: "Port d'Alcúdia, Mallorca",
    year: 2026,
    tagline: "Un negocio nuevo sobre una plataforma probada.",
    shortDescription:
      "Web con carta, bebidas y reservas, y todo el sistema de gestión de hostelería de LocalIA, puesto en marcha como un nuevo negocio dentro de la plataforma.",
    longDescription:
      "La Osa no empezó de cero: se dio de alta como un negocio nuevo dentro de la plataforma de hostelería que desarrollamos para Palomita Bar. Identidad, contenidos y carta propios; pedidos, cocina, TPV, mesas y fidelización heredados de un sistema que ya funciona.",
    challenge: [
      "Un bar de tapas en Mallorca, con menú diario y terraza, necesitaba web y herramientas de gestión sin el coste y el plazo de un desarrollo desde cero.",
    ],
    solution: [
      "Lo incorporamos como un negocio más en la plataforma multi-negocio de LocalIA, con datos aislados del resto, y le dimos una identidad visual y unos contenidos propios.",
      "La carta se cargó como punto de partida (11 categorías, 38 productos) y se edita desde el propio panel.",
    ],
    features: [
      { title: "Web con identidad propia", description: "Home, carta, bebidas, galería, opiniones y reservas con diseño exclusivo del local." },
      { title: "Carta editable", description: "Categorías y productos gestionados desde el panel, sin tocar código." },
      { title: "Gestión completa heredada", description: "TPV de barra, cocina, mesas, reservas y fidelización desde el primer día." },
      { title: "Datos aislados", description: "Cada negocio de la plataforma ve solo sus datos, con seguridad a nivel de base de datos." },
    ],
    result: [
      "En producción en bar-la-osa.vercel.app.",
      "Demuestra el valor de construir plataformas y no solo webs: un negocio nuevo con todo el sistema de gestión, reutilizando lo que ya funciona.",
    ],
    highlights: ["Plataforma multi-negocio", "Carta editable", "Gestión de hostelería completa"],
    services: ["web", "reservas", "crm", "a-medida"],
    technologies: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL (RLS)", "Stripe", "Vercel"],
    productionUrl: "https://bar-la-osa.vercel.app",
    repositoryUrl: "https://github.com/LocalIA-Soluciones-Digitales/Bar-La-Osa",
    featured: false,
    theme: { accent: "#d7a650", surface: "#120e09" },
    hasVideo: false,
    gallery: [
      { file: "desktop-carta.jpg", kind: "desktop", caption: "Carta por categorías" },
      { file: "mobile-carta.jpg", kind: "mobile", caption: "Carta en móvil" },
      { file: "desktop-reservar.jpg", kind: "desktop", caption: "Reservas online" },
      { file: "mobile-reservar.jpg", kind: "mobile", caption: "Reservas en móvil" },
    ],
  }),
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
export const MORE_PROJECTS = PROJECTS.filter((p) => !p.featured);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Proyecto anterior y siguiente (circular) para la navegación entre casos. */
export function getAdjacentProjects(slug: string): { prev: Project; next: Project } {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  const n = PROJECTS.length;
  return { prev: PROJECTS[(i - 1 + n) % n], next: PROJECTS[(i + 1) % n] };
}

export function projectsWithService(keys: ServiceKey[]): Project[] {
  return PROJECTS.filter((p) => p.services.some((s) => keys.includes(s)));
}
