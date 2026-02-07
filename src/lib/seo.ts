export const SITE_URL = "https://finanzaseu.com";
export const SITE_NAME = "FinanzasEU";
export const SITE_LOGO_URL = `${SITE_URL}/logo.png`;
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/og-escalada.png`;

export function toAbsoluteUrl(value: string, baseUrl: string = SITE_URL): string {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("//")) return `https:${value}`;

  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  if (value.startsWith("/")) return `${base}${value}`;
  return `${base}/${value}`;
}

export function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function toIsoDurationFromReadingTime(
  readingTime: string | undefined,
): string | undefined {
  if (!readingTime) return undefined;
  const match = readingTime.match(/(\d+)/);
  if (!match) return undefined;

  const minutes = Number(match[1]);
  if (!Number.isFinite(minutes) || minutes <= 0) return undefined;
  return `PT${minutes}M`;
}

export function toJsonLd(value: unknown): string {
  // Prevent `</script>`-style injection in inline JSON-LD.
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
