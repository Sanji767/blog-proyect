export type Locale = "es" | "en";

export const DEFAULT_LOCALE: Locale = "es";
export const SECONDARY_LOCALE: Locale = "en";
export const LOCALE_PREFIX = "/en";

function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function getLocaleFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return DEFAULT_LOCALE;
  return pathname === LOCALE_PREFIX || pathname.startsWith(`${LOCALE_PREFIX}/`)
    ? "en"
    : "es";
}

export function stripLocaleFromPathname(pathname: string): string {
  if (pathname === LOCALE_PREFIX) return "/";
  if (pathname.startsWith(`${LOCALE_PREFIX}/`)) return pathname.slice(LOCALE_PREFIX.length);
  return pathname;
}

export function withLocale(href: string, locale: Locale): string {
  if (!href) return href;
  if (href.startsWith("#") || isExternalHref(href)) return href;
  if (!href.startsWith("/")) return href;

  const isEnPath = href === LOCALE_PREFIX || href.startsWith(`${LOCALE_PREFIX}/`);

  if (locale === "en") {
    if (isEnPath) return href;
    return href === "/" ? LOCALE_PREFIX : `${LOCALE_PREFIX}${href}`;
  }

  if (!isEnPath) return href;
  return href === LOCALE_PREFIX ? "/" : href.slice(LOCALE_PREFIX.length);
}

export function switchLocalePathname(pathname: string, nextLocale: Locale): string {
  const base = stripLocaleFromPathname(pathname || "/");
  return withLocale(base, nextLocale);
}

