import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre FinanzasEU (quiénes somos y metodología)",
  description:
    "Conoce quién está detrás de FinanzasEU, cómo analizamos bancos y cuentas en Europa, y cómo mantenemos la transparencia (afiliados, fuentes oficiales y actualización).",
  alternates: {
    canonical: "/sobre",
  },
};

export default function SobrePage() {
  const pageUrl = `${SITE_URL}/sobre`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sobre", item: pageUrl },
    ],
  };

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}#about`,
    url: pageUrl,
    name: "Sobre FinanzasEU",
    inLanguage: "es-ES",
    about: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO_URL,
    },
  };

  return (
    <section className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(aboutPageJsonLd) }}
      />

      <Container className="max-w-4xl space-y-12">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Quiénes somos
          </h1>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
            FinanzasEU es una guía independiente para elegir banco en Europa con
            criterios claros: IBAN, comisiones, requisitos y enlaces oficiales.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-card">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">Proyecto editorial</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Publicamos guías y comparativas enfocadas en decisiones reales
              (viajar, remoto, nómina, autónomos, empresas).
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-card">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">Criterios claros</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explicamos pros y contras, para quién sirve y para quién no,
              evitando el “marketing vacío”.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-card">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">Transparencia</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Si hay enlaces de afiliados, lo indicamos y no afecta el análisis.
              Priorizamos fuentes oficiales y actualización.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-muted/20 p-8 md:p-10">
          <h2 className="text-2xl font-black">Metodología (resumen)</h2>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground">
                1
              </span>
              Costes reales: cuota, cajeros, cambio de divisa y condiciones.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground">
                2
              </span>
              IBAN / SEPA y operativa: pagos, nómina y domiciliaciones.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground">
                3
              </span>
              Requisitos: documentación, residencia y países admitidos.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground">
                4
              </span>
              Seguridad y soporte: licencia/supervisión y atención en español
              cuando aplica.
            </li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Nota: La información puede cambiar. Revisa siempre la web oficial
            antes de abrir una cuenta.
          </p>
        </section>

        <section className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/aviso-afiliados"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            <FileText className="h-4 w-4" />
            Aviso de afiliados (transparencia)
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:brightness-110"
          >
            Contactar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </Container>
    </section>
  );
}

