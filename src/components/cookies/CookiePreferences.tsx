"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_ANALYTICS_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
  clearAnalyticsConsent,
  deleteAnalyticsCookies,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/cookieConsent";

export default function CookiePreferences() {
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
    setStatus("Preferencias guardadas.");
  };

  const revoke = () => {
    clearAnalyticsConsent();
    deleteAnalyticsCookies();
    setStatus("Preferencias eliminadas. Se mostrará el banner de nuevo.");
  };

  return (
    <section className="not-prose mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="text-xl font-bold">Preferencias de cookies</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Las cookies técnicas son necesarias para que la web funcione. Las cookies
        analíticas (GA4) nos ayudan a entender el uso del sitio de forma agregada.
      </p>

      <div className="mt-6 space-y-3">
        <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
          <div>
            <p className="font-semibold">Cookies analíticas</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Activar Google Analytics (GA4)
            </p>
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="h-5 w-5"
            />
            <span className="text-sm">{analyticsEnabled ? "Sí" : "No"}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black shadow-soft hover:brightness-105 transition"
          >
            Guardar
          </button>

          <button
            type="button"
            onClick={() => {
              setAnalyticsEnabled(true);
              writeAnalyticsConsent(true);
              setStatus("Cookies analíticas activadas.");
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/40 transition"
          >
            Aceptar analíticas
          </button>

          <button
            type="button"
            onClick={() => {
              setAnalyticsEnabled(false);
              writeAnalyticsConsent(false);
              deleteAnalyticsCookies();
              setStatus("Cookies analíticas desactivadas.");
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/40 transition"
          >
            Rechazar analíticas
          </button>

          <button
            type="button"
            onClick={revoke}
            className="rounded-lg border border-destructive/50 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition"
          >
            Revocar
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/40 transition"
          >
            Recargar
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Estado:{" "}
          {!hasChoice
            ? "sin elección guardada"
            : analyticsEnabled
              ? "analíticas activadas"
              : "analíticas desactivadas"}
          {status ? ` · ${status}` : ""}
        </p>
      </div>
    </section>
  );
}

