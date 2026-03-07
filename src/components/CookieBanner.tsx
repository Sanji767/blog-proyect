"use client";

import { useEffect, useState } from "react";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  COOKIE_ANALYTICS_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
  deleteAnalyticsCookies,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/cookieConsent";

const COPY = {
  es: {
    message:
      "Usamos cookies técnicas (necesarias) y cookies analíticas (Google Analytics) para mejorar la experiencia. Puedes leer nuestra",
    policy: "Política de Cookies",
    accept: "Aceptar",
    reject: "Rechazar",
    configure: "Configurar",
    title: "Preferencias de cookies",
    subtitle:
      "Las cookies técnicas son necesarias. Puedes activar o desactivar las cookies analíticas.",
    analytics: "Analíticas",
    save: "Guardar",
    back: "Volver",
    yes: "Sí",
    no: "No",
  },
  en: {
    message:
      "We use essential cookies and analytics cookies (Google Analytics) to improve the experience. Read our",
    policy: "Cookie Policy",
    accept: "Accept",
    reject: "Reject",
    configure: "Settings",
    title: "Cookie preferences",
    subtitle:
      "Essential cookies are required. You can enable or disable analytics cookies.",
    analytics: "Analytics",
    save: "Save",
    back: "Back",
    yes: "Yes",
    no: "No",
  },
} as const;

export default function CookieBanner() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const consent = readAnalyticsConsent();
      if (consent === null) {
        setVisible(true);
        setAnalyticsEnabled(false);
        return;
      }

      setVisible(false);
      setShowSettings(false);
      setAnalyticsEnabled(consent);
    };

    sync();
    window.addEventListener(COOKIE_ANALYTICS_CONSENT_KEY, sync);
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => {
      window.removeEventListener(COOKIE_ANALYTICS_CONSENT_KEY, sync);
      window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
    };
  }, []);

  const acceptCookies = () => {
    writeAnalyticsConsent(true);
    setVisible(false);
  };

  const rejectCookies = () => {
    writeAnalyticsConsent(false);
    deleteAnalyticsCookies();
    setVisible(false);
  };

  const openSettings = () => {
    const consent = readAnalyticsConsent();
    setAnalyticsEnabled(consent ?? false);
    setShowSettings(true);
  };

  if (!visible) return null;

  const copy = COPY[locale];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-secondary-foreground/10 bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-5">
        {!showSettings ? (
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-secondary-foreground/80 md:text-left">
              {copy.message}{" "}
              <LocalizedLink
                href="/cookies"
                className="text-primary underline-offset-4 hover:text-accent hover:underline transition-colors"
              >
                {copy.policy}
              </LocalizedLink>
              .
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={acceptCookies}
                className="rounded-xl border-2 border-secondary bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-x-1 hover:-translate-y-1 active:translate-y-px shadow-offset-accent"
              >
                {copy.accept}
              </button>
              <button
                onClick={rejectCookies}
                className="rounded-xl border-2 border-secondary-foreground/15 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-secondary-foreground/25 hover:text-accent"
              >
                {copy.reject}
              </button>
              <button
                onClick={openSettings}
                className="rounded-xl border-2 border-secondary-foreground/15 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-secondary-foreground/25 hover:text-accent"
              >
                {copy.configure}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold">{copy.title}</p>
                <p className="text-xs text-secondary-foreground/75">
                  {copy.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{copy.analytics}</p>
                  <p className="text-xs text-secondary-foreground/70">
                    Google Analytics (GA4)
                  </p>
                </div>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="h-5 w-5 accent-accent"
                  />
                  <span className="text-sm">
                    {analyticsEnabled ? copy.yes : copy.no}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => {
                  writeAnalyticsConsent(analyticsEnabled);
                  if (!analyticsEnabled) deleteAnalyticsCookies();
                  setShowSettings(false);
                  setVisible(false);
                }}
                className="rounded-xl border-2 border-secondary bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-x-1 hover:-translate-y-1 active:translate-y-px shadow-offset-accent"
              >
                {copy.save}
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-xl border-2 border-secondary-foreground/15 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-secondary-foreground/25 hover:text-accent"
              >
                {copy.back}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
