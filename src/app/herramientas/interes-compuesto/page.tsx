import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import CompoundInterestCalculator from "@/components/tools/CompoundInterestCalculator";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Calculadora de interés compuesto (con aportaciones) | FinanzasEU";
const DESCRIPTION =
  "Calcula interés compuesto con aportaciones mensuales y ajuste por inflación. Proyección anual, tabla y enlace para compartir.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/herramientas/interes-compuesto",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/herramientas/interes-compuesto`,
    type: "website",
    locale: "es_ES",
  },
};

export default function InteresCompuestoPage() {
  const pageUrl = `${SITE_URL}/herramientas/interes-compuesto`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Herramientas", item: `${SITE_URL}/herramientas` },
      { "@type": "ListItem", position: 3, name: "Interés compuesto", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Calculadora de interés compuesto",
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
        name: "¿Qué rentabilidad debo poner?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Usa una estimación conservadora y a largo plazo. La herramienta es educativa: no garantiza resultados ni sustituye asesoramiento.",
        },
      },
      {
        "@type": "Question",
        name: "¿Incluye aportaciones mensuales?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Puedes definir aportación mensual y elegir si se aplica al inicio o al final de cada mes.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué significa “resultado real”?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Es el balance ajustado por inflación para estimar el poder adquisitivo. A igualdad de dinero nominal, la inflación reduce lo que puedes comprar.",
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
              interés compuesto
            </span>
            .
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Proyección con aportaciones mensuales y ajuste por inflación. Ideal para
            planificar ahorro/inversión a largo plazo sin humo.
          </p>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {[
              { href: "/", label: "Inicio" },
              { href: "/herramientas", label: "Herramientas" },
              { href: "/comparativa", label: "Comparativa" },
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

        <CompoundInterestCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Notas importantes</h2>
          <ul>
            <li>
              Esta calculadora es educativa: no predice el mercado ni garantiza resultados.
            </li>
            <li>
              Si tu objetivo es comparar bancos o cuentas, usa también la{" "}
              <a href="/comparativa">comparativa de bancos</a>.
            </li>
          </ul>
        </section>
      </Container>
    </section>
  );
}

