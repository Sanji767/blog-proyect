"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { getLocaleFromPathname, switchLocalePathname } from "@/lib/i18n";

const CHOICE_COOKIE = "feu-locale-choice";
const SUGGEST_COOKIE = "feu-suggest";
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

/**
 * Country-based language prompt.
 *
 * Shows once, on direct entry only, when the visitor's suggested language
 * (from the `feu-suggest` cookie set by middleware, falling back to the
 * browser language) differs from the language of the page they landed on.
 * The choice is remembered for a year, so it never asks again.
 */
export default function LanguagePrompt() {
  const pathname = usePathname();
  const router = useRouter();
  const [suggestion, setSuggestion] = useState<Locale | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    // Decide once, on the landing page. Client-side navigation after entry
    // must not re-trigger the prompt.
    if (checkedRef.current) return;
    checkedRef.current = true;

    // A recorded choice suppresses the prompt forever.
    if (readCookie(CHOICE_COOKIE)) return;

    // Direct entry only: same-origin referrer means internal navigation.
    if (document.referrer.startsWith(window.location.origin)) return;

    const currentLocale = getLocaleFromPathname(pathname);
    const cookieSuggest = readCookie(SUGGEST_COOKIE);
    const suggested: Locale =
      cookieSuggest === "es" || cookieSuggest === "en"
        ? cookieSuggest
        : navigator.language.toLowerCase().startsWith("es")
          ? "es"
          : "en";

    if (suggested === currentLocale) return;
    setSuggestion(suggested);
  }, [pathname]);

  const choose = (locale: Locale) => {
    writeCookie(CHOICE_COOKIE, locale, ONE_YEAR_SECONDS);
    setSuggestion(null);
    const currentLocale = getLocaleFromPathname(pathname);
    if (locale !== currentLocale) {
      router.push(switchLocalePathname(pathname ?? "/", locale));
    }
  };

  const dismiss = () => {
    // Dismissing records the current locale as the choice: never ask again.
    writeCookie(
      CHOICE_COOKIE,
      getLocaleFromPathname(pathname),
      ONE_YEAR_SECONDS,
    );
    setSuggestion(null);
  };

  if (!suggestion) return null;

  return (
    <div
      role="dialog"
      aria-label="Language choice / Elección de idioma"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar / Close"
        className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <p className="pr-6 text-sm font-medium leading-snug">
        ¿Prefieres continuar en español?
      </p>
      <p className="pr-6 text-sm leading-snug text-muted-foreground">
        Would you prefer to continue in English?
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("es")}
          className={
            suggestion === "es"
              ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-accent"
              : "rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary-accent hover:text-primary-text"
          }
        >
          Continuar en español
        </button>
        <button
          type="button"
          onClick={() => choose("en")}
          className={
            suggestion === "en"
              ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-accent"
              : "rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary-accent hover:text-primary-text"
          }
        >
          Continue in English
        </button>
      </div>
    </div>
  );
}
