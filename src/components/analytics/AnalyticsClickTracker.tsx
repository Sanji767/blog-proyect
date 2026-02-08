"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

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

export default function AnalyticsClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

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

      const isAffiliate =
        anchor.dataset.analytics === "affiliate" ||
        anchor.dataset.affiliate === "true";

      const linkDomain = (() => {
        try {
          return new URL(url, window.location.href).hostname;
        } catch {
          return undefined;
        }
      })();

      const params: Record<string, unknown> = {
        link_url: url,
        link_domain: linkDomain,
        link_text: safeText(anchor.textContent),
        transport_type: "beacon",
      };

      if (isAffiliate) {
        params.affiliate_partner =
          anchor.dataset.affiliatePartner ?? anchor.dataset.partner ?? undefined;
        window.gtag?.("event", "affiliate_click", params);
      } else {
        window.gtag?.("event", "outbound_click", params);
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

