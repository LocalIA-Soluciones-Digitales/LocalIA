import { afterEach, describe, expect, it, vi } from "vitest";
import { contactSchema } from "@/lib/contact/schema";
import { deliverLead } from "@/lib/contact/deliver";
import { rateLimit } from "@/lib/contact/rate-limit";

const valid = {
  name: "Ane",
  company: "",
  email: "ane@example.com",
  phone: "+34 600 000 000",
  needs: ["Automatización"],
  message: "Queremos dejar de copiar pedidos a mano en una hoja de cálculo.",
  consent: true,
};

describe("contactSchema", () => {
  it("acepta un lead válido", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza email, necesidades, mensaje corto y sin consentimiento", () => {
    const r = contactSchema.safeParse({ ...valid, email: "no-es-email", needs: [], message: "corto", consent: false });
    expect(r.success).toBe(false);
    const fields = new Set(r.error?.issues.map((i) => i.path[0]));
    expect(fields).toEqual(new Set(["email", "needs", "message", "consent"]));
  });

  it("valida el teléfono solo si se rellena", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
  });
});

describe("rateLimit", () => {
  it("bloquea tras superar el límite", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) expect(rateLimit(key, { limit: 3, windowMs: 1000 })).toBe(true);
    expect(rateLimit(key, { limit: 3, windowMs: 1000 })).toBe(false);
  });
});

describe("deliverLead", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const lead = contactSchema.parse(valid);
  const meta = { receivedAt: "2026-01-01T00:00:00Z", source: "test" };

  it("indica que no hay destinos si no hay configuración", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("SUPABASE_URL", "");
    expect(await deliverLead(lead, meta)).toEqual({ status: "not_configured" });
  });

  it("envía al webhook con el secreto en cabecera", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.com/lead");
    vi.stubEnv("CONTACT_WEBHOOK_SECRET", "s3cret");
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const r = await deliverLead(lead, meta);
    expect(r).toEqual({ status: "delivered", sinks: ["webhook"] });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://hooks.example.com/lead");
    expect(init.headers["x-webhook-secret"]).toBe("s3cret");
    expect(JSON.parse(init.body).lead.email).toBe("ane@example.com");
  });

  it("devuelve fallo si todos los destinos fallan", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.com/lead");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("err", { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await deliverLead(lead, meta);
    expect(r.status).toBe("failed");
  });
});
