// src/components/layout/Footer.tsx
"use client";

import Container from "@/components/layout/Container";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import NewsletterForm from "@/components/leads/NewsletterForm";
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
      { label: "Metodología", href: "/sobre#metodologia" },
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
      follow: "Síguenos",
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
      { label: "Methodology", href: "/sobre#metodologia" },
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
      follow: "Follow us",
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
            <div className="pt-2">
              <NewsletterForm variant="footer" source="footer" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-foreground/70">
                {content.copy.follow}
              </span>
              <a
                href="https://www.pinterest.com/finanzaseu/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-secondary-foreground/20 text-primary-light transition-colors hover:border-accent hover:text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.929 7.392 6.923 0 3.641-2.29 6.561-5.475 6.561-1.069 0-2.074-.558-2.418-1.379l-.657 2.507c-.238.918-.881 2.117-1.312 2.823.988.305 2.03.469 3.112.469 6.627 0 11.986-5.367 11.986-11.987C24.003 5.367 18.644.001 12.017.001z" />
                </svg>
              </a>
            </div>
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
                    className="text-primary-light hover:text-accent transition-colors"
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
                    className="text-primary-light hover:text-accent transition-colors"
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
