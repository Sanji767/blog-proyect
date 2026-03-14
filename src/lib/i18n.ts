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

  // Support query/hash in plain string hrefs (e.g. "/en?utm=..." or "/blog#toc").
  const cutIndex = (() => {
    const query = href.indexOf("?");
    const hash = href.indexOf("#");
    if (query === -1) return hash;
    if (hash === -1) return query;
    return Math.min(query, hash);
  })();

  const pathname = cutIndex === -1 ? href : href.slice(0, cutIndex);
  const suffix = cutIndex === -1 ? "" : href.slice(cutIndex);

  const isEnPath =
    pathname === LOCALE_PREFIX || pathname.startsWith(`${LOCALE_PREFIX}/`);

  if (locale === "en") {
    if (isEnPath) return `${pathname}${suffix}`;
    return pathname === "/"
      ? `${LOCALE_PREFIX}${suffix}`
      : `${LOCALE_PREFIX}${pathname}${suffix}`;
  }

  if (!isEnPath) return `${pathname}${suffix}`;
  const stripped =
    pathname === LOCALE_PREFIX ? "/" : pathname.slice(LOCALE_PREFIX.length);
  return `${stripped}${suffix}`;
}

export function switchLocalePathname(pathname: string, nextLocale: Locale): string {
  const base = stripLocaleFromPathname(pathname || "/");
  return withLocale(base, nextLocale);
}
