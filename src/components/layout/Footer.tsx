// src/components/layout/Footer.tsx
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
  CheckCircle2,
} from "lucide-react";

const siteName = "Finanzas EU";

const footerDetails = {
  description:
    "Guía independiente de bancos digitales en Europa. Análisis reales, comisiones actualizadas al 2025 y recomendaciones sin filtros.",

  quickLinks: [
    { text: "Comparativa bancos", url: "/comparativa", highlight: true },
    { text: "Blog", url: "/vlogs", highlight: false },
    { text: "Ventajas", url: "/ventajas", highlight: false },
    { text: "FAQ", url: "/faq", highlight: false },
    { text: "Contacto", url: "/contacto", highlight: false },
  ],

  legalLinks: [
    { text: "Aviso de afiliados", url: "/aviso-afiliados" },
    { text: "Privacidad", url: "/privacidad" },
    { text: "Términos", url: "/terminos" },
    { text: "Cookies", url: "/cookies" },
  ],

  email: "hola@finanzaseu.com",
  phone: "+34 623 456 789",

  socials: {
    Twitter: "https://twitter.com/finanzaseu",
    Instagram: "https://instagram.com/finanzaseu",
    LinkedIn: "https://linkedin.com/company/finanzaseu",
  },
} as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isBancos =
    pathname.startsWith("/bancos") || pathname === "/comparativa";

  const isActivePath = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);

  const socialIcons = {
    Twitter,
    Instagram,
    LinkedIn: Linkedin,
  } as const;

  return (
    <footer
      className="border-t bg-white dark:bg-black"
      aria-labelledby="footer-heading"
    >
      <span id="footer-heading" className="sr-only">
        Pie de página del sitio Finanzas EU
      </span>

      <div className="py-16 md:py-20">
        <Container className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-16">
          {/* COLUMNA 1 – LOGO + DESCRIPCIÓN + CTA */}
          <div className="md:col-span-5 lg:col-span-4 space-y-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="Volver al inicio"
            >
              <Logo className="h-11 md:h-12" showText={false} />
              <div className="leading-none">
                <span className="text-2xl font-black tracking-tight text-foreground">
                  Finanzas{" "}
                  <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                    EU
                  </span>
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {footerDetails.description}
            </p>

            <div className="flex flex-wrap gap-3" aria-label="Garantías y seguridad">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Shield className="h-4 w-4" />
                Fondos garantizados UE
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                <Lock className="h-4 w-4" />
                GDPR + IBAN europeo
              </span>
            </div>

            {/* CTA solo si NO está en bancos */}
            {!isBancos && (
              <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-6 border border-primary/10">
                <p className="mb-3 text-foreground font-semibold">
                  ¿No sabes por dónde empezar?
                </p>
                <Link
                  href="/comparativa"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-foreground transition-colors"
                >
                  Ver comparativa actualizada 2025
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          {/* COLUMNA 2 – NAVEGACIÓN */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Navegación
            </h3>
            <ul className="space-y-3">
              {footerDetails.quickLinks.map((link) => {
                const active = isActivePath(link.url);
                return (
                  <li key={link.text}>
                    <Link
                      href={link.url}
                      className={`group flex items-center gap-2 text-sm transition-all hover:text-primary ${
                        link.highlight
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      } ${active ? "text-primary" : ""}`}
                    >
                      {link.highlight && (
                        <Star
                          className="h-3.5 w-3.5 fill-primary text-primary"
                          aria-hidden="true"
                        />
                      )}
                      {link.text}
                      {link.highlight && (
                        <span className="ml-1 opacity-0 transition-opacity group-hover:opacity-100">
                          →
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMNA 3 – LEGAL */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerDetails.legalLinks.map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 4 – CONTACTO + SOCIAL + ESTADÍSTICA */}
          <div className="md:col-span-12 lg:col-span-4 space-y-8">
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Contacto directo
              </h3>
              <div className="space-y-4">
                <a
                  href={`mailto:${footerDetails.email}`}
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{footerDetails.email}</span>
                </a>
                <a
                  href={`tel:${footerDetails.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{footerDetails.phone}</span>
                </a>
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Síguenos
              </h3>
              <div className="flex gap-4" aria-label="Redes sociales">
                {Object.entries(footerDetails.socials).map(
                  ([platform, url]) => {
                    const Icon =
                      socialIcons[platform as keyof typeof socialIcons];
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-xl bg-muted/50 p-3 transition-all hover:scale-110 hover:bg-primary/10"
                        aria-label={`Abrir ${platform} de ${siteName} en una nueva pestaña`}
                      >
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    );
                  }
                )}
              </div>
            </div>

            {/* Prueba social */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 p-5 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-2xl font-black text-foreground">
                    +3.847
                  </p>
                  <p className="text-xs text-muted-foreground">
                    personas ayudadas en 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* LÍNEA FINAL */}
      <div className="border-t border-border/50 py-8">
        <Container className="flex flex-col items-center justify-between gap-4 text-center text-xs text-muted-foreground md:flex-row">
          <p>
            © {currentYear}{" "}
            <span className="font-bold text-foreground">{siteName}</span>. Guía
            independiente desde 2023.
            <Link
              href="/aviso-afiliados"
              className="underline hover:text-foreground ml-1"
            >
              Algunos enlaces son de afiliados
            </Link>
            .
          </p>
          <div className="flex items-center gap-2" aria-label="Créditos">
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>Hecho con amor en Europa</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
