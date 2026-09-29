import type { SectorKey } from "@/data/projects";

/**
 * Solo aparecen sectores respaldados por al menos un proyecto real
 * (ver `sectorsWithProjects` en lib/portfolio.ts).
 */
export interface Sector {
  key: SectorKey;
  name: string;
  problem: string;
}

export const SECTORS: Sector[] = [
  {
    key: "hosteleria",
    name: "Hostelería",
    problem: "Pedido en mesa, cocina y barra coordinadas, reservas y fidelización.",
  },
  {
    key: "alimentacion",
    name: "Alimentación y comercio local",
    problem: "Catálogo diario, stock sincronizado con la tienda y pedidos para recoger o repartir.",
  },
  {
    key: "ecommerce",
    name: "E-commerce",
    problem: "Catálogos amplios, pago online y gestión de pedidos con avisos.",
  },
  {
    key: "servicios-tecnicos",
    name: "Servicios técnicos",
    problem: "Captación local, avisos urgentes bien informados y presupuestos rápidos.",
  },
  {
    key: "reformas",
    name: "Construcción y reformas",
    problem: "Mostrar trabajos, orientar el presupuesto y organizar las solicitudes.",
  },
];
