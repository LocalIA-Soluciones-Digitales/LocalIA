import { z } from "zod";

export const NEEDS = [
  "Página web",
  "Automatización",
  "CRM",
  "E-commerce",
  "Inteligencia Artificial",
  "Software a medida",
  "No estoy seguro",
] as const;

export type Need = (typeof NEEDS)[number];

const optionalText = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres`).optional().default("");

/** Validación compartida por el formulario (cliente) y la API (servidor). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Dinos tu nombre").max(80, "Máximo 80 caracteres"),
  company: optionalText(120),
  email: z.string().trim().max(160).pipe(z.email("Introduce un email válido")),
  phone: optionalText(30).refine((v) => !v || /^[+\d][\d\s().-]{6,}$/.test(v), "Introduce un teléfono válido"),
  needs: z.array(z.enum(NEEDS)).min(1, "Elige al menos una opción"),
  message: z
    .string()
    .trim()
    .min(20, "Cuéntanos un poco más (mínimo 20 caracteres)")
    .max(3000, "Máximo 3000 caracteres"),
  consent: z.literal(true, { error: "Necesitamos tu consentimiento para responderte" }),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactLead = z.output<typeof contactSchema>;

/** Campos anti-spam que viajan con el formulario pero no forman parte del lead. */
export const antiSpamSchema = z.object({
  website: z.string().optional(), // honeypot: debe llegar vacío
  startedAt: z.number().int().positive(),
});

export const MIN_FILL_MS = 3000;
