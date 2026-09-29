export type NavLink = { label: string; href: string };

export const MAIN_NAV: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export const FOOTER_NAV: NavLink[] = [
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Proceso", href: "/proceso" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export const PRIMARY_CTA: NavLink = { label: "Cuéntanos tu proyecto", href: "/contacto" };
