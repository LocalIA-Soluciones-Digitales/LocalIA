/**
 * Automatizaciones reales, extraídas de proyectos en producción.
 * Se usan en la sección de automatización como prueba de capacidad.
 */
export interface RealAutomation {
  project: string;
  slug: string;
  steps: string[];
  summary: string;
  /** Captura del proyecto que acompaña al flujo. */
  image: string;
}

export const REAL_AUTOMATIONS: RealAutomation[] = [
  {
    project: "Arrantza",
    slug: "pescados-mariscos-arrantza",
    image: "/projects/pescados-mariscos-arrantza/desktop-productos.jpg",
    steps: ["Venta en báscula", "Sincronización", "Stock web", "Aviso de stock bajo"],
    summary: "Cada venta a peso en las básculas de las dos tiendas descuenta stock en la web. Si un producto baja de su mínimo, llega un email.",
  },
  {
    project: "Palomita Bar",
    slug: "palomita-bar",
    image: "/projects/palomita-bar/desktop-pedir.jpg",
    steps: ["QR de la mesa", "Pedido", "Cocina / Barra", "Impresora térmica"],
    summary: "El pedido hecho desde la mesa aparece en cocina y barra al instante y la comanda se imprime sola.",
  },
  {
    project: "Electric",
    slug: "electric-instalaciones-electricas",
    image: "/projects/electric-instalaciones-electricas/desktop-home.jpg",
    steps: ["Diagnóstico", "Foto y peligro", "WhatsApp", "Email interno"],
    summary: "Un aviso de avería llega por WhatsApp con toda la información y, a la vez, como notificación interna por email.",
  },
  {
    project: "Amway Barakaldo",
    slug: "amway-barakaldo",
    image: "/projects/amway-barakaldo/desktop-catalogo.jpg",
    steps: ["Checkout", "Pago Stripe", "Pedido", "Push al móvil"],
    summary: "Cuando un cliente paga, el pedido se registra y el panel avisa con una notificación push.",
  },
];

/** Flujo conceptual que muestra la visualización principal. */
export const PIPELINE = [
  { key: "cliente", label: "Cliente", state: "Nuevo contacto" },
  { key: "formulario", label: "Formulario", state: "Datos validados" },
  { key: "crm", label: "CRM", state: "Ficha creada" },
  { key: "automatizacion", label: "Automatización", state: "Flujo en marcha" },
  { key: "ia", label: "IA", state: "Clasificado: urgente" },
  { key: "notificacion", label: "Notificación", state: "Aviso enviado" },
  { key: "dashboard", label: "Dashboard", state: "Métrica actualizada" },
] as const;
