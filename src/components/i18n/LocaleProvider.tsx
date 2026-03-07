"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { getLocaleFromPathname } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useMemo(() => getLocaleFromPathname(pathname), [pathname]);

  const value = useMemo(() => ({ locale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within <LocaleProvider>");
  }
  return value;
}

