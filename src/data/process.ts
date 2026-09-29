export interface ProcessStep {
  index: string;
  title: string;
  description: string;
  detail: string;
}

export const PROCESS: ProcessStep[] = [
  {
    index: "01",
    title: "Entendemos",
    description: "Entendemos el negocio y cómo trabaja hoy.",
    detail: "Hablamos contigo, vemos el día a día y qué herramientas usáis. Antes de proponer nada, queremos saber cómo entra un cliente, cómo se gestiona un pedido y dónde se pierde el tiempo.",
  },
  {
    index: "02",
    title: "Detectamos",
    description: "Identificamos problemas, tareas repetitivas y oportunidades.",
    detail: "Información repartida en varios sitios, avisos que se hacen a mano, datos que se copian dos veces. Priorizamos lo que más impacto tiene.",
  },
  {
    index: "03",
    title: "Diseñamos",
    description: "Diseñamos la solución adecuada, ni más ni menos.",
    detail: "Definimos qué construir, cómo se conecta con lo que ya tienes y cómo se verá. Diseño visual y arquitectura técnica van juntos desde el principio.",
  },
  {
    index: "04",
    title: "Construimos",
    description: "Desarrollamos el producto con código a medida.",
    detail: "Webs, tiendas, paneles o plataformas completas, con tecnologías modernas y probadas. Ves avances reales durante el desarrollo, no solo al final.",
  },
  {
    index: "05",
    title: "Automatizamos",
    description: "Conectamos procesos y sistemas.",
    detail: "Sincronizaciones, avisos, tareas programadas e integraciones con tus herramientas o dispositivos, para que el sistema trabaje solo.",
  },
  {
    index: "06",
    title: "Lanzamos",
    description: "Ponemos la solución en producción.",
    detail: "Dominio, despliegue, seguridad, SEO y medición. Te acompañamos en el arranque para que el equipo lo use desde el primer día.",
  },
  {
    index: "07",
    title: "Mejoramos",
    description: "Seguimos evolucionando la solución.",
    detail: "El negocio cambia y la herramienta también. Ajustamos, añadimos funciones y resolvemos lo que surge con el uso real.",
  },
];
