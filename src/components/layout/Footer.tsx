// src/components/layout/Footer.tsx
"use client";

import Container from "@/components/layout/Container";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Logo from "@/components/ui/logo";

const siteName = "FinanzasEU";

const LINKS_BY_LOCALE = {
  es: {
    explora: [
      { label: "Bancos", href: "/bancos" },
      { label: "Comparativa", href: "/comparativa" },
      { label: "IBAN Scanner", href: "/iban" },
      { label: "Herramientas", href: "/herramientas" },
      { label: "Blog", href: "/blog" },
      { label: "Ebooks", href: "/ebooks" },
    ],
    legal: [
      { label: "Sobre", href: "/sobre" },
      { label: "Aviso de afiliados", href: "/aviso-afiliados" },
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
      { label: "Cookies", href: "/cookies" },
    ],
    copy: {
      home: "Inicio",
      blurb:
        "Guías y comparativas para elegir banco en Europa con criterio: IBAN, comisiones, requisitos y enlaces oficiales.",
      explore: "Explora",
      legal: "Legal",
      affiliateNote: "Algunos enlaces pueden ser de afiliados. No cambia el análisis.",
    },
  },
  en: {
    explora: [
      { label: "Banks", href: "/bancos" },
      { label: "Comparison", href: "/comparativa" },
      { label: "IBAN Scanner", href: "/iban" },
      { label: "Tools", href: "/herramientas" },
      { label: "Blog", href: "/blog" },
      { label: "Ebooks", href: "/ebooks" },
    ],
    legal: [
      { label: "About", href: "/sobre" },
      { label: "Affiliate disclosure", href: "/aviso-afiliados" },
      { label: "Privacy", href: "/privacidad" },
      { label: "Terms", href: "/terminos" },
      { label: "Cookies", href: "/cookies" },
    ],
    copy: {
      home: "Home",
      blurb:
        "Editorial guides and comparisons to choose a bank in Europe: IBAN, fees, requirements, and official sources.",
      explore: "Explore",
      legal: "Legal",
      affiliateNote: "Some links may be affiliate links. It doesn’t change the analysis.",
    },
  },
} as const;

export default function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();
  const content = LINKS_BY_LOCALE[locale];

  return (
    <footer className="mt-24 border-t-2 border-secondary bg-secondary text-secondary-foreground">
      <Container className="py-14">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <LocalizedLink
              href="/"
              className="inline-flex items-center"
              aria-label={content.copy.home}
            >
              <Logo tone="inverse" />
            </LocalizedLink>
            <p className="max-w-md text-sm leading-relaxed text-secondary-foreground/75">
              {content.copy.blurb}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-foreground/70">
              {content.copy.explore}
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {content.explora.map((l) => (
                <li key={l.href}>
                  <LocalizedLink
                    href={l.href}
                    className="text-primary hover:text-accent transition-colors"
                  >
                    {l.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-foreground/70">
              {content.copy.legal}
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {content.legal.map((l) => (
                <li key={l.href}>
                  <LocalizedLink
                    href={l.href}
                    className="text-primary hover:text-accent transition-colors"
                  >
                    {l.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t-2 border-secondary-foreground/10 pt-8 text-sm text-secondary-foreground/70 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} <span className="font-semibold text-secondary-foreground">{siteName}</span>
          </p>
          <p className="text-xs">
            {content.copy.affiliateNote}
          </p>
        </div>
      </Container>
    </footer>
  );
}
