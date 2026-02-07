"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_ANALYTICS_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
  deleteAnalyticsCookies,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/cookieConsent";

export default function CookieBanner() {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur text-white">
      <div className="container mx-auto p-4">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-center md:text-left">
              Usamos cookies técnicas (necesarias) y cookies analíticas (Google
              Analytics) para mejorar la experiencia. Puedes leer nuestra{" "}
              <Link href="/cookies" className="underline">
                Política de Cookies
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={acceptCookies}
                className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Aceptar
              </button>
              <button
                onClick={rejectCookies}
                className="border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Rechazar
              </button>
              <button
                onClick={openSettings}
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Configurar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Preferencias de cookies</p>
                <p className="text-xs text-white/80">
                  Las cookies técnicas son necesarias. Puedes activar o desactivar
                  las cookies analíticas.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Analíticas</p>
                  <p className="text-xs text-white/70">Google Analytics (GA4)</p>
                </div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="h-5 w-5 accent-white"
                  />
                  <span className="text-sm">{analyticsEnabled ? "Sí" : "No"}</span>
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
                className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
