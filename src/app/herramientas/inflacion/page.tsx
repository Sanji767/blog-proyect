import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import InflationCalculator from "@/components/tools/InflationCalculator";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Calculadora de inflación y poder adquisitivo | FinanzasEU";
const DESCRIPTION =
  "Calcula inflación compuesta y poder adquisitivo: cuánto necesitas en el futuro para mantener el mismo valor y cuánto pierde hoy tu dinero.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/herramientas/inflacion",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/herramientas/inflacion`,
    type: "website",
    locale: "es_ES",
  },
};

export default function InflacionPage() {
  const pageUrl = `${SITE_URL}/herramientas/inflacion`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Herramientas", item: `${SITE_URL}/herramientas` },
      { "@type": "ListItem", position: 3, name: "Inflación", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Calculadora de inflación",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: pageUrl,
    description: DESCRIPTION,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es la inflación compuesta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La inflación se acumula año tras año. Un 3% anual no se suma linealmente: se multiplica, y el efecto crece con el tiempo.",
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué mi dinero “pierde” valor si no crece?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Porque los precios tienden a subir. Si tu saldo se mantiene igual, compras menos cosas con el paso de los años.",
        },
      },
      {
        "@type": "Question",
        name: "¿Esto incluye impuestos o rentabilidad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Esta herramienta solo estima el efecto de la inflación. Para proyecciones con rentabilidad, usa la calculadora de interés compuesto.",
        },
      },
    ],
  };

  return (
    <section className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }}
      />

      <Container className="space-y-14">
        <header className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Link href="/herramientas" className="underline-offset-4 hover:underline">
              Herramientas
            </Link>{" "}
            <span className="text-muted-foreground/70">/</span> Calculadora
          </p>

          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Calculadora de{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              inflación
            </span>
            .
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Entiende cuánto necesitas en el futuro para mantener el mismo poder
            adquisitivo y cuánto “pierde” tu dinero si no crece.
          </p>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {[
              { href: "/", label: "Inicio" },
              { href: "/herramientas", label: "Herramientas" },
              { href: "/herramientas/interes-compuesto", label: "Interés compuesto" },
            ].map((item, idx, arr) => (
              <span key={item.href} className="inline-flex items-center gap-x-4">
                <Link
                  href={item.href}
                  className="text-foreground/90 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
                {idx < arr.length - 1 ? (
                  <span className="text-muted-foreground/70">/</span>
                ) : null}
              </span>
            ))}
          </nav>
        </header>

        <InflationCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Lectura recomendada</h2>
          <p>
            Si quieres ver proyecciones con rentabilidad y aportaciones, usa la{" "}
            <a href="/herramientas/interes-compuesto">
              calculadora de interés compuesto
            </a>
            .
          </p>
        </section>
      </Container>
    </section>
  );
}

