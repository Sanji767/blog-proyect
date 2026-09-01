"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const KNOWN_PARTNERS: Record<string, string> = {
  "revolut.com": "revolut",
  "revolut.ngrok.io": "revolut",
  "n26.com": "n26",
  "wise.com": "wise",
  "traderepublic.com": "trade-republic",
  "trading212.com": "trading-212",
  "qonto.com": "qonto",
  "sumup.com": "sumup",
  "sumup.me": "sumup",
  "bunq.com": "bunq",
  "myinvestor.es": "myinvestor",
  "freedom24.com": "freedom24",
  "freedomfinance.eu": "freedom24",
  "klarna.com": "klarna",
  "plum.app": "plum",
  "openbank.es": "openbank",
  "bbva.es": "bbva",
  "santander.es": "santander",
  "caixabank.es": "caixabank",
  "ing.es": "ing",
  "bankinter.com": "bankinter",
  "imagin.com": "imagin",
  "vivid.money": "vivid",
  "bnext.es": "bnext",
};

function isExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.href);
    return parsed.hostname !== window.location.hostname;
  } catch {
    return false;
  }
}

function safeText(value: string | null | undefined, max = 120): string | undefined {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return undefined;
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function detectPartner(hostname: string | undefined): string | undefined {
  if (!hostname) return undefined;
  const clean = hostname.toLowerCase().replace(/^www\./, "");
  for (const [domain, slug] of Object.entries(KNOWN_PARTNERS)) {
    if (clean === domain || clean.endsWith(`.${domain}`)) {
      return slug;
    }
  }
  return undefined;
}

export default function AnalyticsClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href") ?? "";
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      const url = anchor.href || href;
      const external = isExternalUrl(url);
      if (!external) return;

      const linkDomain = (() => {
        try {
          return new URL(url, window.location.href).hostname;
        } catch {
          return undefined;
        }
      })();

      const partnerFromAttr =
        anchor.dataset.affiliatePartner ??
        anchor.dataset.partner ??
        anchor.dataset.bankSlug;

      const detectedPartner = partnerFromAttr || detectPartner(linkDomain);

      const isAffiliate =
        anchor.dataset.analytics === "affiliate" ||
        anchor.dataset.affiliate === "true" ||
        Boolean(detectedPartner);

      const eventName = isAffiliate ? "affiliate_click" : "outbound_click";

      const params: Record<string, unknown> = {
        event: eventName,
        link_url: url,
        link_domain: linkDomain,
        link_text: safeText(anchor.textContent) || anchor.getAttribute("aria-label") || undefined,
        affiliate_partner: detectedPartner,
        page_location: window.location.href,
        page_title: document.title,
        transport_type: "beacon",
      };

      // 1) Enviar via gtag si está disponible
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
      }

      // 2) Enviar via dataLayer para máxima compatibilidad con Google Tag / GA4
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(params);
      }
    };

    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
