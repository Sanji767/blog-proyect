"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  COOKIE_ANALYTICS_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
  clearAnalyticsConsent,
  deleteAnalyticsCookies,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/cookieConsent";

const COPY = {
  es: {
    title: "Preferencias de cookies",
    intro:
      "Las cookies técnicas son necesarias para que la web funcione. Las cookies analíticas (GA4) nos ayudan a entender el uso del sitio de forma agregada.",
    analyticsTitle: "Cookies analíticas",
    analyticsDesc: "Activar Google Analytics (GA4)",
    yes: "Sí",
    no: "No",
    save: "Guardar",
    acceptAnalytics: "Aceptar analíticas",
    rejectAnalytics: "Rechazar analíticas",
    revoke: "Revocar",
    reload: "Recargar",
    state: "Estado",
    stateNoChoice: "sin elección guardada",
    stateEnabled: "analíticas activadas",
    stateDisabled: "analíticas desactivadas",
    statusSaved: "Preferencias guardadas.",
    statusCleared: "Preferencias eliminadas. Se mostrará el banner de nuevo.",
    statusEnabled: "Cookies analíticas activadas.",
    statusDisabled: "Cookies analíticas desactivadas.",
  },
  en: {
    title: "Cookie preferences",
    intro:
      "Essential cookies are required for the website to work. Analytics cookies (GA4) help us understand usage in an aggregated way.",
    analyticsTitle: "Analytics cookies",
    analyticsDesc: "Enable Google Analytics (GA4)",
    yes: "Yes",
    no: "No",
    save: "Save",
    acceptAnalytics: "Accept analytics",
    rejectAnalytics: "Reject analytics",
    revoke: "Revoke",
    reload: "Reload",
    state: "State",
    stateNoChoice: "no saved choice",
    stateEnabled: "analytics enabled",
    stateDisabled: "analytics disabled",
    statusSaved: "Preferences saved.",
    statusCleared: "Preferences cleared. The banner will show again.",
    statusEnabled: "Analytics cookies enabled.",
    statusDisabled: "Analytics cookies disabled.",
  },
} as const;

export default function CookiePreferences() {
  const { locale } = useLocale();
  const copy = COPY[locale];
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const consent = readAnalyticsConsent();
      if (consent === null) {
        setHasChoice(false);
        setAnalyticsEnabled(false);
        return;
      }

      setHasChoice(true);
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

  const save = () => {
    writeAnalyticsConsent(analyticsEnabled);
    if (!analyticsEnabled) deleteAnalyticsCookies();
    setStatus(copy.statusSaved);
  };

  const revoke = () => {
    clearAnalyticsConsent();
    deleteAnalyticsCookies();
    setStatus(copy.statusCleared);
  };

  return (
    <section className="not-prose mt-8 rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
      <h3 className="text-xl font-bold">{copy.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {copy.intro}
      </p>

      <div className="mt-6 space-y-3">
        <div className="flex items-start justify-between gap-4 rounded-xl border-2 border-border p-4">
          <div>
            <p className="font-semibold">{copy.analyticsTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.analyticsDesc}
            </p>
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
            <span className="text-sm">{analyticsEnabled ? copy.yes : copy.no}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:brightness-105 transition"
          >
            {copy.save}
          </button>

          <button
            type="button"
            onClick={() => {
              setAnalyticsEnabled(true);
              writeAnalyticsConsent(true);
              setStatus(copy.statusEnabled);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/40 transition"
          >
            {copy.acceptAnalytics}
          </button>

          <button
            type="button"
            onClick={() => {
              setAnalyticsEnabled(false);
              writeAnalyticsConsent(false);
              deleteAnalyticsCookies();
              setStatus(copy.statusDisabled);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/40 transition"
          >
            {copy.rejectAnalytics}
          </button>

          <button
            type="button"
            onClick={revoke}
            className="rounded-lg border border-destructive/50 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition"
          >
            {copy.revoke}
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/40 transition"
          >
            {copy.reload}
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          {copy.state}:{" "}
          {!hasChoice
            ? copy.stateNoChoice
            : analyticsEnabled
              ? copy.stateEnabled
              : copy.stateDisabled}
          {status ? ` · ${status}` : ""}
        </p>
      </div>
    </section>
  );
}
