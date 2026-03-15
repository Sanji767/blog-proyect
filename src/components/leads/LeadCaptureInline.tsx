"use client";

import { useState } from "react";

import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

type Props = {
  source?: string;
  className?: string;
};

const COPY = {
  es: {
    kicker: "Actualizaciones",
    title: "Recibe avisos cuando actualicemos rankings y guías",
    desc: "Sin spam. 1–2 emails/mes. Te puedes dar de baja cuando quieras.",
    placeholder: "Tu email",
    cta: "Apuntarme",
    submitting: "Enviando…",
    success: "¡Listo! Te avisaremos cuando publiquemos actualizaciones.",
    invalidEmail: "Email inválido.",
    genericError: "No se pudo enviar. Inténtalo de nuevo.",
    privacyPrefix: "Al enviar, aceptas nuestra",
    privacyLink: "Política de Privacidad",
  },
  en: {
    kicker: "Updates",
    title: "Get notified when we update rankings and guides",
    desc: "No spam. 1–2 emails/month. Unsubscribe anytime.",
    placeholder: "Your email",
    cta: "Notify me",
    submitting: "Sending…",
    success: "You're in. We’ll email you when we publish updates.",
    invalidEmail: "Invalid email.",
    genericError: "Could not send. Please try again.",
    privacyPrefix: "By submitting, you agree to our",
    privacyLink: "Privacy Policy",
  },
} as const;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LeadCaptureInline({
  source = "unknown",
  className,
}: Props) {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<FormState>("idle");
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
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, locale, source, website }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok) {
        setState("error");
        setError(result?.error || copy.genericError);
        return;
      }

      setState("success");
      setEmail("");
      setWebsite("");
    } catch {
      setState("error");
      setError(copy.genericError);
    }
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent md:p-10",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
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
        <p className="mt-4 text-sm text-secondary-foreground/85">{copy.success}</p>
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
