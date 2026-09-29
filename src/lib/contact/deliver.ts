/**
 * Entrega de leads del formulario de contacto (solo servidor).
 *
 * Cada destino es un adaptador independiente que se activa con variables de
 * entorno (ver .env.example). Se envía a todos los configurados; conectar un
 * CRM o una automatización nueva es añadir un adaptador aquí, sin tocar ni el
 * formulario ni la API.
 */
import type { ContactLead } from "@/lib/contact/schema";

export interface LeadMeta {
  receivedAt: string;
  source: string;
  userAgent?: string;
}

interface Sink {
  name: string;
  enabled: () => boolean;
  send: (lead: ContactLead, meta: LeadMeta) => Promise<void>;
}

async function ensureOk(res: Response, sink: string) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${sink} respondió ${res.status}: ${body.slice(0, 200)}`);
  }
}

const webhookSink: Sink = {
  name: "webhook",
  enabled: () => Boolean(process.env.CONTACT_WEBHOOK_URL),
  async send(lead, meta) {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.CONTACT_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({ type: "contact_lead", lead, meta }),
      signal: AbortSignal.timeout(8000),
    });
    await ensureOk(res, "webhook");
  },
};

const resendSink: Sink = {
  name: "email",
  enabled: () => Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL),
  async send(lead, meta) {
    const lines = [
      `Nombre: ${lead.name}`,
      `Empresa: ${lead.company || "—"}`,
      `Email: ${lead.email}`,
      `Teléfono: ${lead.phone || "—"}`,
      `Necesita: ${lead.needs.join(", ")}`,
      "",
      lead.message,
      "",
      `— Recibido ${meta.receivedAt} desde ${meta.source}`,
    ];
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: process.env.CONTACT_TO_EMAIL!.split(",").map((s) => s.trim()),
        reply_to: lead.email,
        subject: `Nuevo proyecto: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    await ensureOk(res, "resend");
  },
};

const supabaseSink: Sink = {
  name: "supabase",
  enabled: () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
  async send(lead, meta) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(`${process.env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/contact_leads`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: lead.name,
        company: lead.company || null,
        email: lead.email,
        phone: lead.phone || null,
        needs: lead.needs,
        message: lead.message,
        source: meta.source,
        user_agent: meta.userAgent ?? null,
      }),
      signal: AbortSignal.timeout(8000),
    });
    await ensureOk(res, "supabase");
  },
};

const SINKS: Sink[] = [supabaseSink, webhookSink, resendSink];

export type DeliveryResult =
  | { status: "delivered"; sinks: string[] }
  | { status: "not_configured" }
  | { status: "failed"; errors: string[] };

export async function deliverLead(lead: ContactLead, meta: LeadMeta): Promise<DeliveryResult> {
  const active = SINKS.filter((s) => s.enabled());
  if (active.length === 0) return { status: "not_configured" };

  const results = await Promise.allSettled(active.map((s) => s.send(lead, meta)));
  const ok = active.filter((_, i) => results[i].status === "fulfilled").map((s) => s.name);
  const errors = results.flatMap((r) => (r.status === "rejected" ? [String(r.reason)] : []));
  if (errors.length) console.error("[contact] fallos de entrega:", errors);

  // Basta con que un destino lo reciba para no perder el lead.
  return ok.length > 0 ? { status: "delivered", sinks: ok } : { status: "failed", errors };
}
