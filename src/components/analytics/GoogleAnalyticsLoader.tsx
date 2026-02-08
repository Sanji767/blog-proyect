"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import AnalyticsClickTracker from "@/components/analytics/AnalyticsClickTracker";
import {
  COOKIE_ANALYTICS_CONSENT_KEY,
  COOKIE_CONSENT_EVENT,
  readAnalyticsConsent,
} from "@/lib/cookieConsent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalyticsLoader({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [enabled, setEnabled] = useState(false);
  const didInitRef = useRef(false);

  useEffect(() => {
    const sync = () => {
      const consentEnabled = readAnalyticsConsent() === true;
      (window as Record<string, unknown>)[`ga-disable-${gaId}`] = !consentEnabled;
      setEnabled(consentEnabled);
    };

    sync();
    window.addEventListener(COOKIE_ANALYTICS_CONSENT_KEY, sync);
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => {
      window.removeEventListener(COOKIE_ANALYTICS_CONSENT_KEY, sync);
      window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
    };
  }, [gaId]);

  const pagePath = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!enabled) didInitRef.current = false;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }
    if (typeof window.gtag !== "function") return;

    window.gtag("config", gaId, {
      page_path: pagePath,
    });
  }, [enabled, gaId, pagePath]);

  if (!enabled) return null;
  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <AnalyticsClickTracker />
    </>
  );
}
