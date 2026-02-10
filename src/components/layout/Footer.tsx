// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/ui/logo";
import Container from "./Container";

import {
  Shield,
  Lock,
  Star,
  ArrowRight,
  CheckCircle2,
  Heart,
  Scale,
  FileText,
  Cookie,
  Users,
  Info,
} from "lucide-react";

const siteName = "FinanzasEU";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isBancos = pathname.startsWith("/bancos") || pathname === "/comparativa";

  const quickLinks = [
    { text: "Comparativa de bancos", url: "/comparativa", icon: Star, highlight: true },
    { text: "Blog", url: "/blog" },
    { text: "Ventajas clave", url: "/ventajas" },
    { text: "Preguntas frecuentes", url: "/faq" },
  ];

  const legalLinks = [
    { text: "Sobre FinanzasEU", url: "/sobre", icon: Info },
    { text: "Aviso de afiliados", url: "/aviso-afiliados", icon: Users },
    { text: "Política de privacidad", url: "/privacidad", icon: Scale },
    { text: "Términos y condiciones", url: "/terminos", icon: FileText },
    { text: "Política de cookies", url: "/cookies", icon: Cookie },
  ];

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="py-16 md:py-24">
        <Container className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-20">
          {/* Branding + Confianza */}
          <div className="md:col-span-5 lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group">
              <Logo className="h-12 md:h-14 group-hover:scale-105 transition-transform" />
              <span className="sr-only">FinanzasEU - Inicio</span>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              La guía independiente más completa sobre bancos digitales y cuentas multidivisa en Europa.
              Análisis honestos y datos actualizados al <strong>{currentYear}</strong>.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <Shield className="h-4 w-4" />
                Depósitos protegidos (según entidad)
              </div>
              <div className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-700 dark:text-cyan-400">
                <Lock className="h-4 w-4" />
                Licencia y supervisión (según entidad)
              </div>
            </div>

            {!isBancos && (
              <Link
                href="/comparativa"
                className="group block rounded-2xl bg-gradient-to-r from-primary to-primary/90 p-6 text-primary-foreground shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                suppressHydrationWarning // Backup para hydration si persiste en production
              >
                <span className="block text-lg font-bold">Encuentra tu banco ideal en 60 segundos</span>
                <span className="block mt-2 flex items-center gap-2 text-sm opacity-90">
                  Ver comparativa completa {currentYear}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}
          </div>

          {/* Navegación */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Explora
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.text}>
                    <Link
                      href={link.url}
                      className="group flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                    >
                      {Icon && <Icon className="h-4 w-4 text-primary/70 group-hover:text-primary" />}
                      <span className="font-medium">{link.text}</span>
                      {link.highlight && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          TOP
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Legal & Transparencia
            </h3>
            <ul className="space-y-4">
              {legalLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.text}>
                    <Link
                      href={link.url}
                      className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                      <span className="text-sm">{link.text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Prueba social */}
          <div className="md:col-span-12 lg:col-span-2">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-2xl">
              <CheckCircle2 className="h-12 w-12 mb-4 opacity-90" />
              <p className="text-2xl font-black leading-tight">Metodología clara</p>
              <p className="mt-2 text-sm opacity-90">
                Actualizado {currentYear} · Enlaces oficiales
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright */}
      <div className="border-t py-10">
        <Container className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-foreground">{siteName}</span> ·{" "}
            Guía independiente
          </p>
          <p className="flex items-center gap-2">
            Hecho con <Heart className="h-4 w-4 fill-red-500 text-red-500" /> en España
          </p>
        </Container>
      </div>
    </footer>
  );
}
