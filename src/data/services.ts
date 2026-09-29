/**
 * Servicios de LocalIA.
 *
 * `ServiceKey` es la etiqueta que usan los proyectos (data/projects.ts) para
 * indicar qué se hizo en cada uno. Así cada servicio puede enlazar
 * automáticamente a los proyectos que lo demuestran.
 */
export type ServiceKey =
  | "web"
  | "ecommerce"
  | "automatizacion"
  | "integraciones"
  | "ia"
  | "crm"
  | "reservas"
  | "seo"
  | "a-medida";

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  web: "Desarrollo web",
  ecommerce: "E-commerce",
  automatizacion: "Automatización",
  integraciones: "Integraciones",
  ia: "Inteligencia artificial",
  crm: "Panel de gestión",
  reservas: "Reservas y pedidos",
  seo: "SEO local",
  "a-medida": "Software a medida",
};

export type ServiceVisual = "web" | "automation" | "ai" | "crm" | "ecommerce" | "custom";

export interface Service {
  key: ServiceKey;
  index: string;
  title: string;
  /** Frase corta, orientada al problema. */
  lead: string;
  description: string;
  deliverables: string[];
  visual: ServiceVisual;
  /** Etiquetas de proyecto que demuestran este servicio. */
  provenBy: ServiceKey[];
}

export const SERVICES: Service[] = [
  {
    key: "web",
    index: "01",
    title: "Desarrollo web",
    lead: "Webs modernas, rápidas y pensadas para que te contacten.",
    description:
      "Diseño a medida, carga rápida en el móvil y SEO local desde la estructura. Cada página tiene un objetivo: una llamada, un WhatsApp, una reserva o un pedido.",
    deliverables: ["Diseño a medida", "SEO técnico y local", "Multidioma", "Analítica y conversiones"],
    visual: "web",
    provenBy: ["web", "seo"],
  },
  {
    key: "automatizacion",
    index: "02",
    title: "Automatización",
    lead: "Eliminamos tareas repetitivas y conectamos tus herramientas.",
    description:
      "Si hoy copias datos de un sitio a otro, avisas a mano o revisas cosas cada mañana, probablemente se pueda automatizar: sincronizaciones, avisos, tareas programadas y flujos entre sistemas.",
    deliverables: ["Flujos automáticos", "Tareas programadas", "Notificaciones push y email", "Integración con dispositivos y APIs"],
    visual: "automation",
    provenBy: ["automatizacion", "integraciones"],
  },
  {
    key: "ia",
    index: "03",
    title: "Inteligencia artificial",
    lead: "IA aplicada a procesos concretos de tu negocio.",
    description:
      "Asistentes, clasificación de mensajes, extracción de datos de documentos o cualificación de contactos. Integramos modelos de IA donde ahorran trabajo real, conectados a tus datos y herramientas.",
    deliverables: ["Asistentes para clientes y equipo", "Extracción de datos de documentos", "Clasificación automática", "Integración con tu CRM"],
    visual: "ai",
    provenBy: ["ia"],
  },
  {
    key: "crm",
    index: "04",
    title: "CRM y software de gestión",
    lead: "Herramientas que se adaptan a cómo trabajas, no al revés.",
    description:
      "Paneles de administración, CRM, control de stock, caja, reservas o fidelización. Todo en tiempo real, desde el móvil o la tablet del mostrador, y con los permisos que necesite cada persona.",
    deliverables: ["Paneles de administración", "CRM y clientes", "Stock, caja e informes", "Apps instalables (PWA)"],
    visual: "crm",
    provenBy: ["crm", "reservas"],
  },
  {
    key: "ecommerce",
    index: "05",
    title: "E-commerce",
    lead: "Tiendas online rápidas, claras y preparadas para vender.",
    description:
      "Catálogo, carrito, pago con tarjeta y gestión de pedidos. También modelos que no son la tienda típica: recogida en local, pedido en mesa, reservas anticipadas o precios que cambian cada día.",
    deliverables: ["Catálogo y carrito", "Pagos con Stripe", "Gestión de pedidos", "Recogida y reservas"],
    visual: "ecommerce",
    provenBy: ["ecommerce"],
  },
  {
    key: "a-medida",
    index: "06",
    title: "Soluciones a medida",
    lead: "Si la herramienta que necesitas no existe, la construimos.",
    description:
      "Cuando ningún programa se ajusta a tu forma de trabajar, desarrollamos el software exacto: desde un servicio que imprime comandas en cocina hasta una plataforma que comparten varios negocios.",
    deliverables: ["Análisis del proceso", "Arquitectura y desarrollo", "Integraciones con hardware", "Mantenimiento y evolución"],
    visual: "custom",
    provenBy: ["a-medida", "integraciones"],
  },
];

/** Catálogo completo (página /servicios). */
export const CAPABILITIES: { group: string; items: string[] }[] = [
  {
    group: "Presencia digital",
    items: ["Páginas web", "Webs corporativas", "Landing pages", "SEO local", "Multidioma"],
  },
  {
    group: "Venta y reservas",
    items: ["E-commerce", "Sistemas de reservas", "Sistemas de citas", "Pedido en mesa", "Pagos online"],
  },
  {
    group: "Gestión",
    items: ["CRM", "Paneles de administración", "Dashboards", "Herramientas internas", "Stock y caja"],
  },
  {
    group: "Automatización e IA",
    items: ["Automatización de procesos", "Integraciones entre sistemas", "IA aplicada", "Asistentes", "Notificaciones"],
  },
  {
    group: "Software",
    items: ["Aplicaciones web", "Software a medida", "Plataformas multi-negocio", "Integración con hardware", "Consultoría tecnológica"],
  },
];
