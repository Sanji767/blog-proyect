import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Users } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sobre FinanzasEU (quiénes somos y metodología)",
  description:
    "Conoce quién está detrás de FinanzasEU, cómo analizamos bancos y cuentas en Europa y cómo mantenemos la transparencia (afiliados, fuentes oficiales y actualización).",
  alternates: {
    canonical: "/sobre",
    languages: {
      es: "/sobre",
      en: "/en/sobre",
    },
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

      <Container className="max-w-5xl space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Sobre
          </p>
          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            Quiénes{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              somos
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            FinanzasEU es una guía independiente para elegir banco en Europa con
            criterios claros: IBAN, comisiones, requisitos y enlaces oficiales.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Proyecto editorial</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Publicamos guías y comparativas enfocadas en decisiones reales
              (viajar, remoto, nómina, autónomos, empresas).
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Criterios claros</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Explicamos pros y contras, para quién sirve y para quién no,
              evitando el marketing vacío.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Transparencia</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Si hay enlaces de afiliados, lo indicamos y no afecta el análisis.
              Priorizamos fuentes oficiales y actualización.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border-2 border-border bg-card p-8 shadow-soft md:p-10">
          <h2 className="text-2xl font-black tracking-tight">
            Metodología (resumen)
          </h2>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border-2 border-border bg-muted text-xs font-black text-foreground">
                1
              </span>
              Costes reales: cuota, cajeros, cambio de divisa y condiciones.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border-2 border-border bg-muted text-xs font-black text-foreground">
                2
              </span>
              IBAN / SEPA y operativa: pagos, nómina y domiciliaciones.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border-2 border-border bg-muted text-xs font-black text-foreground">
                3
              </span>
              Requisitos: documentación, residencia y países admitidos.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border-2 border-border bg-muted text-xs font-black text-foreground">
                4
              </span>
              Seguridad y soporte: licencia/supervisión y atención en español cuando aplica.
            </li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Nota: la información puede cambiar. Revisa siempre la web oficial antes de abrir una cuenta.
          </p>
        </section>

        <section className="flex flex-col items-center gap-3 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/aviso-afiliados">
              <FileText className="h-4 w-4" />
              Aviso de afiliados (transparencia)
            </Link>
          </Button>

          <Button asChild size="lg" className="gap-2">
            <Link href="/contacto">
              Contactar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </Container>
    </section>
  );
}
