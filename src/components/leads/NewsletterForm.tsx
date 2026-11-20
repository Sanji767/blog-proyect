// src/components/leads/NewsletterForm.tsx
//
// Newsletter subscribe form (audit finding A16). Posts to /api/subscribe,
// which stores the email in the Resend Audience (when RESEND_AUDIENCE_ID is
// configured) or falls back to emailing the owner.
//
// Copy is deliberately honest: no sending cadence is promised until a real
// one exists ("only when we publish something new"), and the success message
// differs depending on how the subscription was stored — the API returns
// `stored: "audience" | "email"` and the UI reports each truthfully.
//
// Variants:
// - "section": full-width card for the homepage (mirrors LeadCaptureInline).
// - "footer": compact form for the footer brand column (dark green bg).
"use client";

import { useState } from "react";

import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";
type StoredVia = "audience" | "email" | null;

type Props = {
  variant?: "section" | "footer";
  source?: string;
  className?: string;
};

const COPY = {
  es: {
    kicker: "Newsletter",
    title: "Recibe las novedades de FinanzasEU",
    desc: "Te escribiremos solo cuando publiquemos algo nuevo: guías, rankings y herramientas. Sin spam, y podrás darte de baja desde cualquier correo que recibas.",
    footerDesc:
      "Solo cuando publiquemos algo nuevo. Sin spam, baja cuando quieras.",
    placeholder: "Tu email",
    cta: "Suscribirme",
    submitting: "Enviando…",
    successAudience: "¡Listo! Ya estás en la lista.",
    successEmail:
      "Recibido. Te hemos apuntado y te avisaremos cuando publiquemos novedades.",
    invalidEmail: "Email inválido.",
    genericError: "No se pudo enviar. Inténtalo de nuevo.",
    privacyPrefix: "Al enviar, aceptas nuestra",
    privacyLink: "Política de Privacidad",
  },
  en: {
    kicker: "Newsletter",
    title: "Get the latest from FinanzasEU",
    desc: "We'll only write when we publish something new: guides, rankings and tools. No spam, and you can unsubscribe from any email you receive.",
    footerDesc: "Only when we publish something new. No spam, unsubscribe anytime.",
    placeholder: "Your email",
    cta: "Subscribe",
    submitting: "Sending…",
    successAudience: "You're in! You're on the list.",
    successEmail:
      "Got it — we've noted your email and will let you know when we publish updates.",
    invalidEmail: "Invalid email.",
    genericError: "Could not send. Please try again.",
    privacyPrefix: "By submitting, you agree to our",
    privacyLink: "Privacy Policy",
  },
} as const;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function NewsletterForm({
  variant = "section",
  source = "unknown",
  className,
}: Props) {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<FormState>("idle");
  const [storedVia, setStoredVia] = useState<StoredVia>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setState("error");
      setError(copy.invalidEmail);
      return;
    }

    setState("submitting");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, locale, source, website }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; stored?: string; error?: string }
        | null;

      if (!response.ok) {
        setState("error");
        setError(result?.error || copy.genericError);
        return;
      }

      // Honest success: report how the subscription was actually stored.
      // (Honeypot responses carry no `stored` field; treat as audience.)
      setStoredVia(result?.stored === "email" ? "email" : "audience");
      setState("success");
      setEmail("");
      setWebsite("");
    } catch {
      setState("error");
      setError(copy.genericError);
    }
  }

  const successMessage =
    storedVia === "email" ? copy.successEmail : copy.successAudience;

  if (variant === "footer") {
    return (
      <div className={cn("space-y-3", className)}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-foreground/70">
          {copy.kicker}
        </p>
        <p className="max-w-md text-sm leading-relaxed text-secondary-foreground/75">
          {copy.footerDesc}
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-hidden="true"
          />

          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            className="h-11 bg-secondary-foreground/5 text-secondary-foreground placeholder:text-secondary-foreground/60"
          />

          <Button
            type="submit"
            className="h-11 shrink-0"
            disabled={state === "submitting" || state === "success"}
          >
            {state === "submitting" ? copy.submitting : copy.cta}
          </Button>
        </form>

        {state === "success" ? (
          <p className="text-sm text-secondary-foreground/85">{successMessage}</p>
        ) : null}

        {state === "error" && error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl bg-secondary p-8 text-secondary-foreground md:p-10",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">
        {copy.kicker}
      </p>
      <h2 className="mt-4 text-balance text-2xl font-black tracking-tight text-accent md:text-3xl">
        {copy.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary-foreground/80 md:text-base">
        {copy.desc}
      </p>

      <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          aria-hidden="true"
        />

        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.placeholder}
          className="h-11 bg-secondary-foreground/5 text-secondary-foreground placeholder:text-secondary-foreground/60"
        />

        <Button
          type="submit"
          className="h-11 shrink-0"
          disabled={state === "submitting" || state === "success"}
        >
          {state === "submitting" ? copy.submitting : copy.cta}
        </Button>
      </form>

      {state === "success" ? (
        <p className="mt-4 text-sm text-secondary-foreground/85">{successMessage}</p>
      ) : null}

      {state === "error" && error ? (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      ) : null}

      <p className="mt-4 text-xs text-secondary-foreground/70">
        {copy.privacyPrefix}{" "}
        <LocalizedLink
          href="/privacidad"
          className="font-semibold text-secondary-foreground underline underline-offset-4"
        >
          {copy.privacyLink}
        </LocalizedLink>
        .
      </p>
    </section>
  );
}
