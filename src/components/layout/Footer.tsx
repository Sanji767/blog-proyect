"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/ui/logo";
import Container from "./Container";

import {
  Shield,
  Lock,
  Mail,
  Phone,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";

const siteName = "Bancos Europa";

const footerDetails = {
  description:
    "Guía independiente de banca digital en Europa. Análisis actualizados, comisiones reales y recomendaciones sin sesgos.",

  // 🔥 YA CORREGIDO: todos los enlaces tienen highlight
  quickLinks: [
    { text: "Comparativa", url: "/comparativa", highlight: true },
    { text: "Ventajas", url: "/ventajas", highlight: false },
    { text: "FAQ", url: "/faq", highlight: false },
    { text: "Contacto", url: "/contacto", highlight: false },
  ],

  legalLinks: [
    { text: "Aviso de Afiliados", url: "/aviso-afiliados" },
    { text: "Política de Privacidad", url: "/privacidad" },
    { text: "Términos de Uso", url: "/terminos" },
    { text: "Cookies", url: "/cookies" },
  ],

  email: "hola@bancoseuropa.com",
  phone: "+31 20 123 4567",

  socials: {
    Twitter: "https://twitter.com/bancoseuropa",
    Instagram: "https://instagram.com/bancoseuropa",
    LinkedIn: "https://linkedin.com/company/bancoseuropa",
  },
} as const;

type SocialPlatform = keyof typeof footerDetails.socials;

const socialIcons: Record<
  SocialPlatform,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Twitter,
  Instagram,
  LinkedIn: Linkedin,
};

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const telHref = `tel:${footerDetails.phone.replace(/\s+/g, "")}`;
  const isComparativa = pathname === "/comparativa";

  const isActivePath = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);

  return (
    <footer
      className="border-t bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/10"
      aria-label="Pie de página"
      role="contentinfo"
    >
      <div className="py-14">
        <Container className="grid w-full max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4 lg:px-0">
          
          {/* -------- LOGO + DESCRIPCIÓN -------- */}
          <div className="space-y-6 md:col-span-1">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-lg p-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={siteName}
            >
              <Logo className="h-10 w-10 transition-transform group-hover:scale-105" />
              <span className="sr-only">{siteName}</span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {footerDetails.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <Shield className="h-4 w-4" />
                Regulados UE
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <Lock className="h-4 w-4" />
                GDPR
              </span>
            </div>

            {!isComparativa && (
              <div className="mt-6 rounded-xl border border-primary/10 bg-gradient-to-r from-primary/5 to-primary/3 p-4 shadow-sm">
                <p className="mb-2 text-sm font-medium text-foreground">
                  ¿No sabes cuál elegir?
                </p>
                <Link
                  href="/comparativa"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-foreground"
                >
                  Ver comparativa completa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* -------- NAVEGACIÓN -------- */}
          <nav aria-label="Navegación principal" className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Navegación
            </h4>

            <ul className="space-y-2.5">
              {footerDetails.quickLinks.map((link) => {
                const active = isActivePath(link.url);

                return (
                  <li key={link.text}>
                    <Link
                      href={link.url}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "group flex items-center gap-2 text-sm transition-all hover:translate-x-1",
                        link.highlight
                          ? "font-semibold text-primary hover:text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                        active ? "underline underline-offset-4" : "",
                      ].join(" ")}
                    >
                      {link.highlight && (
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      )}

                      {link.text}

                      {link.highlight && (
                        <span className="text-xs opacity-0 transition-opacity group-hover:opacity-100">
                          →
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* -------- LEGAL -------- */}
          <nav aria-label="Enlaces legales" className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Legal
            </h4>

            <ul className="space-y-2">
              {footerDetails.legalLinks.map((link) => {
                const active = isActivePath(link.url);
                return (
                  <li key={link.text}>
                    <Link
                      href={link.url}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "text-sm text-muted-foreground transition-colors hover:text-foreground",
                        active ? "underline underline-offset-4" : "",
                      ].join(" ")}
                    >
                      {link.text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* -------- CONTACTO + REDES -------- */}
          <div className="space-y-7">
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Contacto
              </h4>

              <address className="space-y-3 text-sm not-italic">
                <a
                  href={`mailto:${footerDetails.email}`}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="rounded-lg bg-primary/10 p-1.5">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  {footerDetails.email}
                </a>

                <a
                  href={telHref}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="rounded-lg bg-primary/10 p-1.5">
                    <Phone className="h-4 w-4 text-primary" />
                  </span>
                  {footerDetails.phone}
                </a>
              </address>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Síguenos
              </h4>

              <div className="flex gap-3" aria-label="Redes sociales">
                {Object.entries(footerDetails.socials).map(
                  ([platform, url]) => {
                    const Icon =
                      socialIcons[platform as SocialPlatform];

                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-lg bg-primary/10 p-2 transition-all hover:scale-110 hover:bg-primary/20"
                        aria-label={`Síguenos en ${platform}`}
                      >
                        <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
                      </a>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* -------- FOOTER INFERIOR -------- */}
      <div className="border-t border-border px-6 py-6">
        <Container className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p className="text-center md:text-left">
            © {currentYear}{" "}
            <span className="font-semibold text-foreground">
              {siteName}
            </span>
            . Guía independiente.
            <Link
              href="/aviso-afiliados"
              className="ml-1 underline transition-colors hover:text-foreground"
            >
              Algunos enlaces son de afiliados
            </Link>
            .
          </p>

          <div className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            <span>Hecho con amor en Ámsterdam</span>
          </div>
        </Container>
      </div>

      {/* -------- SCHEMA.ORG -------- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: "https://bancoseuropa.com",
            logo: "https://bancoseuropa.com/logo-bancos-europa.svg",
            contactPoint: {
              "@type": "ContactPoint",
              email: footerDetails.email,
              telephone: footerDetails.phone,
              contactType: "customer service",
              areaServed: "EU",
              availableLanguage: "Spanish",
            },
            sameAs: Object.values(footerDetails.socials),
            address: {
              "@type": "PostalAddress",
              addressCountry: "NL",
            },
          }),
        }}
      />
    </footer>
  );
}
