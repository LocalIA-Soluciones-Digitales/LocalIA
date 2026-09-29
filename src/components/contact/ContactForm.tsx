"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { contactSchema, NEEDS, type ContactInput, type Need } from "@/lib/contact/schema";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<keyof ContactInput | "form", string>>;

const EMPTY: ContactInput = { name: "", company: "", email: "", phone: "", needs: [], message: "", consent: false as unknown as true };

export function ContactForm({ fallbackEmail }: { fallbackEmail?: string }) {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleNeed = (n: Need) => {
    const needs = values.needs.includes(n) ? values.needs.filter((x) => x !== n) : [...values.needs, n];
    set("needs", needs);
  };

  const validateField = (key: keyof ContactInput) => {
    const r = contactSchema.safeParse(values);
    const issue = r.success ? undefined : r.error.issues.find((i) => i.path[0] === key);
    setErrors((e) => ({ ...e, [key]: issue?.message }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const i of parsed.error.issues) next[i.path[0] as keyof ContactInput] ??= i.message;
      setErrors(next);
      const first = parsed.error.issues[0]?.path[0];
      formRef.current?.querySelector<HTMLElement>(`[data-field="${String(first)}"]`)?.focus();
      return;
    }

    setStatus("sending");
    const website = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Errors };
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      if (data.fields) setErrors(data.fields);
      setErrors((er) => ({
        ...er,
        form:
          data.error === "rate_limited"
            ? "Has enviado varias solicitudes seguidas. Inténtalo de nuevo en unos minutos."
            : data.error === "not_configured" || data.error === "delivery_failed"
              ? `No hemos podido registrar tu mensaje ahora mismo.${fallbackEmail ? ` Escríbenos a ${fallbackEmail}.` : " Inténtalo de nuevo más tarde."}`
              : "Revisa los campos marcados.",
      }));
      setStatus("error");
    } catch {
      setErrors((er) => ({ ...er, form: "Error de conexión. Comprueba tu red e inténtalo de nuevo." }));
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="ok"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[520px] flex-col items-start justify-center"
            role="status"
          >
            <span className="grid size-14 place-items-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30">
              <Check aria-hidden className="size-6" />
            </span>
            <h3 className="mt-8 text-[2rem] font-medium leading-tight tracking-[-0.04em] text-white md:text-[2.6rem]">
              Mensaje recibido, {values.name.split(" ")[0]}.
            </h3>
            <p className="mt-4 max-w-md text-fog-300">
              Lo leeremos con calma y te responderemos para hablar de tu proyecto. Si quieres, mientras tanto puedes ver
              lo que hemos construido para otros negocios.
            </p>
          </m.div>
        ) : (
          <m.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            exit={{ opacity: 0, y: -12 }}
            className="space-y-7"
            aria-describedby={errors.form ? "form-error" : undefined}
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Nombre" name="name" required value={values.name} error={errors.name} autoComplete="name" onChange={(v) => set("name", v)} onBlur={() => values.name && validateField("name")} />
              <Field label="Empresa" name="company" value={values.company ?? ""} error={errors.company} autoComplete="organization" onChange={(v) => set("company", v)} />
              <Field label="Email" name="email" type="email" required value={values.email} error={errors.email} autoComplete="email" inputMode="email" onChange={(v) => set("email", v)} onBlur={() => values.email && validateField("email")} />
              <Field label="Teléfono" name="phone" type="tel" value={values.phone ?? ""} error={errors.phone} autoComplete="tel" inputMode="tel" onChange={(v) => set("phone", v)} onBlur={() => values.phone && validateField("phone")} />
            </div>

            <fieldset aria-describedby={errors.needs ? "needs-error" : undefined}>
              <legend className="mb-3 text-sm text-fog-300">
                ¿Qué necesitas? <span className="text-fog-500">(puedes elegir varias)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {NEEDS.map((n, i) => {
                  const on = values.needs.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      data-field={i === 0 ? "needs" : undefined}
                      aria-pressed={on}
                      onClick={() => toggleNeed(n)}
                      className={cn(
                        "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm ring-1 ring-inset transition-all duration-300",
                        on ? "bg-fog-50 text-ink-950 ring-fog-50" : "text-fog-300 ring-white/15 hover:text-white hover:ring-white/30",
                      )}
                    >
                      {on && <Check aria-hidden className="size-3.5" />}
                      {n}
                    </button>
                  );
                })}
              </div>
              {errors.needs && (
                <p id="needs-error" className="mt-2 text-sm text-rose-300">
                  {errors.needs}
                </p>
              )}
            </fieldset>

            <Field
              label="Cuéntanos brevemente tu proyecto"
              name="message"
              textarea
              required
              value={values.message}
              error={errors.message}
              hint="Cómo trabajáis hoy, qué os quita tiempo, qué os gustaría conseguir."
              onChange={(v) => set("message", v)}
              onBlur={() => values.message && validateField("message")}
            />

            {/* Honeypot: invisible para personas, tentador para bots */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Web
                <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-fog-400">
                <input
                  type="checkbox"
                  data-field="consent"
                  checked={values.consent === true}
                  onChange={(e) => set("consent", e.target.checked as true)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--color-signal)]"
                />
                <span>Acepto que LocalIA use estos datos únicamente para responder a mi solicitud.</span>
              </label>
              {errors.consent && (
                <p id="consent-error" className="mt-2 text-sm text-rose-300">
                  {errors.consent}
                </p>
              )}
            </div>

            {errors.form && (
              <p id="form-error" role="alert" className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-inset ring-rose-400/20">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-fog-50 px-8 text-base font-medium text-ink-950 shadow-[0_10px_40px_-10px_rgb(77_124_255/0.6)] transition hover:bg-white active:scale-[0.99] disabled:opacity-70 sm:w-auto"
            >
              {status === "sending" ? (
                <>
                  <Loader2 aria-hidden className="size-4 animate-spin" /> Enviando…
                </>
              ) : (
                <>
                  Hablar con LocalIA
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: keyof ContactInput;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  textarea?: boolean;
  hint?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

function Field({ label, name, value, onChange, onBlur, error, required, textarea, hint, type = "text", autoComplete, inputMode }: FieldProps) {
  const id = `f-${name}`;
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  const base = cn(
    "peer w-full border-0 border-b bg-transparent px-0 pb-3 pt-2 text-base text-white placeholder:text-fog-500 transition-colors focus:outline-none focus:ring-0",
    error ? "border-rose-400/70" : "border-white/15 focus:border-signal-bright",
  );
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm text-fog-300">
        {label}
        {required ? <span className="text-fog-500"> *</span> : <span className="text-fog-500"> (opcional)</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          data-field={name}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(base, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          data-field={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={base}
        />
      )}
      <span aria-hidden className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-signal to-cyan transition-transform duration-500 peer-focus:scale-x-100" />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-fog-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
