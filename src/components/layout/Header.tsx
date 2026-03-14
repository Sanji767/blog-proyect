// src/components/layout/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { HiBars3, HiOutlineXMark } from "react-icons/hi2";

import Container from "@/components/layout/Container";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Logo from "@/components/ui/logo";
import { stripLocaleFromPathname } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type MenuItem = { label: string; href: string };

const NAV_ITEMS_BY_LOCALE: Record<"es" | "en", MenuItem[]> = {
  es: [
    { label: "Bancos", href: "/bancos" },
    { label: "Comparativa", href: "/comparativa" },
    { label: "IBAN Scanner", href: "/iban" },
    { label: "Herramientas", href: "/herramientas" },
    { label: "Blog", href: "/blog" },
    { label: "Sobre", href: "/sobre" },
  ],
  en: [
    { label: "Banks", href: "/bancos" },
    { label: "Comparison", href: "/comparativa" },
    { label: "IBAN Scanner", href: "/iban" },
    { label: "Tools", href: "/herramientas" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/sobre" },
  ],
};

const COPY = {
  es: {
    home: "Inicio",
    nav: "Navegación principal",
    mobileNav: "Navegación móvil",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  en: {
    home: "Home",
    nav: "Main navigation",
    mobileNav: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
} as const;

export default function Header() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const copy = COPY[locale];
  const navItems = NAV_ITEMS_BY_LOCALE[locale];
  const normalizedPathname = stripLocaleFromPathname(pathname ?? "/");

  const activeHref = useMemo(() => {
    const exact = navItems.find((i) => i.href === normalizedPathname)?.href;
    if (exact) return exact;
    const starts = navItems.find((i) =>
      i.href === "/"
        ? normalizedPathname === "/"
        : normalizedPathname.startsWith(i.href)
    )?.href;
    return starts ?? null;
  }, [navItems, normalizedPathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-secondary bg-secondary text-secondary-foreground">
      <Container className="flex items-center justify-between py-4">
        <LocalizedLink
          href="/"
          className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          aria-label={copy.home}
        >
          <Logo tone="inverse" />
        </LocalizedLink>

        <nav className="hidden lg:flex items-center gap-9" aria-label={copy.nav}>
          {navItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <LocalizedLink
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-semibold tracking-tight text-primary transition-colors hover:text-accent",
                  isActive && "text-accent underline underline-offset-8"
                )}
              >
                {item.label}
              </LocalizedLink>
            );
          })}
          <Suspense fallback={null}>
            <LanguageSwitch />
          </Suspense>
        </nav>

        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border-2 border-secondary-foreground/15 bg-secondary px-3 py-2 text-primary transition-colors hover:border-secondary-foreground/25 hover:text-accent"
            aria-label={mobileOpen ? copy.closeMenu : copy.openMenu}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <HiOutlineXMark className="h-6 w-6" />
            ) : (
              <HiBars3 className="h-6 w-6" />
            )}
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div className="lg:hidden border-t-2 border-secondary-foreground/10">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <nav className="grid gap-3" aria-label={copy.mobileNav}>
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <LocalizedLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-xl border-2 border-secondary-foreground/10 px-4 py-3 text-base font-semibold text-primary transition-colors hover:border-secondary-foreground/20 hover:text-accent",
                      isActive && "border-accent text-accent"
                    )}
                  >
                    {item.label}
                  </LocalizedLink>
                );
              })}
              <Suspense fallback={null}>
                <LanguageSwitch className="w-fit" />
              </Suspense>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
