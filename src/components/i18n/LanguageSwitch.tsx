"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { switchLocalePathname, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import LocalizedLink from "@/components/i18n/LocalizedLink";

const labelByLocale: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

export default function LanguageSwitch({
  className,
}: {
  className?: string;
}) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const nextLocale: Locale = locale === "en" ? "es" : "en";

  const href = useMemo(() => {
    const basePath = switchLocalePathname(pathname ?? "/", nextLocale);
    const qs = searchParams?.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }, [pathname, nextLocale, searchParams]);

  const title =
    locale === "en" ? "Switch to Spanish" : "Cambiar a ingl\u00e9s";

  return (
    <LocalizedLink
      href={href}
      locale={nextLocale}
      className={[
        "inline-flex items-center justify-center rounded-xl border-2 border-secondary-foreground/15 bg-secondary px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary transition-colors hover:border-secondary-foreground/25 hover:text-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={title}
      title={title}
    >
      {labelByLocale[nextLocale]}
    </LocalizedLink>
  );
}

