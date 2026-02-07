export const COOKIE_ANALYTICS_CONSENT_KEY = "cookiesAccepted";
export const COOKIE_CONSENT_EVENT = "cookieConsentUpdated";

export type AnalyticsConsentValue = "true" | "false";

export function readAnalyticsConsent(): boolean | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(COOKIE_ANALYTICS_CONSENT_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
}

export function writeAnalyticsConsent(value: boolean): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    COOKIE_ANALYTICS_CONSENT_KEY,
    value ? "true" : "false",
  );

  // Backwards-compatible event (older code listened to this).
  window.dispatchEvent(new Event(COOKIE_ANALYTICS_CONSENT_KEY));
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

export function clearAnalyticsConsent(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(COOKIE_ANALYTICS_CONSENT_KEY);

  window.dispatchEvent(new Event(COOKIE_ANALYTICS_CONSENT_KEY));
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

function getDomainVariants(hostname: string): string[] {
  if (!hostname || hostname === "localhost") return [];

  const variants = new Set<string>();
  variants.add(hostname);
  variants.add(`.${hostname}`);

  const parts = hostname.split(".").filter(Boolean);
  if (parts.length >= 2) {
    const apex = parts.slice(-2).join(".");
    variants.add(apex);
    variants.add(`.${apex}`);
  }

  return Array.from(variants);
}

function expireCookie(name: string, domain?: string): void {
  const base = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Lax`;
  document.cookie = domain ? `${base}; Domain=${domain}` : base;
}

export function deleteAnalyticsCookies(): void {
  if (typeof document === "undefined") return;

  const cookieNames = document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => c.split("=")[0])
    .filter(Boolean);

  const toDelete = cookieNames.filter((name) => {
    const decoded = decodeURIComponent(name);
    return (
      decoded === "_gid" ||
      decoded === "_gat" ||
      decoded === "_ga" ||
      decoded.startsWith("_ga_")
    );
  });

  const domainVariants = getDomainVariants(window.location.hostname);

  for (const name of toDelete) {
    expireCookie(name);
    for (const domain of domainVariants) expireCookie(name, domain);
  }
}

