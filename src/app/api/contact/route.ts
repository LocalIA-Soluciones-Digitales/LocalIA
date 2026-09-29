import { NextResponse } from "next/server";
import { antiSpamSchema, contactSchema, MIN_FILL_MS } from "@/lib/contact/schema";
import { deliverLead } from "@/lib/contact/deliver";
import { rateLimit } from "@/lib/contact/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Anti-spam: honeypot relleno o envío demasiado rápido → se responde "ok" sin procesar.
  const spam = antiSpamSchema.safeParse(body);
  if (!spam.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const elapsed = Date.now() - spam.data.startedAt;
  if (spam.data.website || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fields[key] ??= issue.message;
    }
    return NextResponse.json({ ok: false, error: "validation", fields }, { status: 422 });
  }

  const result = await deliverLead(parsed.data, {
    receivedAt: new Date().toISOString(),
    source: new URL(req.url).origin,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  if (result.status === "not_configured") {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] sin destinos configurados; lead recibido en desarrollo:", parsed.data);
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  if (result.status === "failed") {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
