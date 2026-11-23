import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import MortgageCalculator from "@/components/tools/MortgageCalculator";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Calculadora de hipoteca (euríbor + diferencial)";
const DESCRIPTION =
  "Calcula tu cuota mensual con hipoteca variable (euríbor a 12 meses + diferencial) o fija, y simula cuánto cambiará tu cuota en la próxima revisión.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/herramientas/hipoteca" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/herramientas/hipoteca`,
    type: "website",
    locale: "es_ES",
  },
};

export default function HipotecaPage() {
  const pageUrl = `${SITE_URL}/herramientas/hipoteca`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Herramientas", item: `${SITE_URL}/herramientas` },
      { "@type": "ListItem", position: 3, name: "Hipoteca", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Calculadora de hipoteca",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: pageUrl,
    description: DESCRIPTION,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
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
        name: "¿Cómo se calcula la cuota de una hipoteca variable?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Con el sistema francés: la cuota mensual depende del capital pendiente, el plazo restante y el tipo de interés (euríbor a 12 meses más el diferencial de tu contrato). La cuota es constante entre revisiones y se recalcula en cada revisión anual.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué pasa con mi cuota en la revisión de la hipoteca?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En la revisión anual, el banco aplica el euríbor vigente más tu diferencial y recalcula la cuota con el capital y el plazo que queden. Si el euríbor sube, la cuota sube; si baja, la cuota baja. Esta calculadora simula ese cambio.",
        },
      },
      {
        "@type": "Question",
        name: "¿Hipoteca fija o variable?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La fija da una cuota estable durante toda la vida del préstamo; la variable empieza normalmente más barata pero su cuota cambia en cada revisión según el euríbor. La mejor opción depende de tu tolerancia al riesgo y de las expectativas de tipos.",
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-text">
            <Link href="/herramientas" className="underline-offset-4 hover:underline">
              Herramientas
            </Link>{" "}
            <span className="text-muted-foreground/70">/</span> Calculadora
          </p>

          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Calculadora de{" "}
            <span className="inline-block bg-accent px-3 py-2 text-accent-foreground">
              hipoteca
            </span>
            .
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Calcula tu cuota mensual con tipo variable (euríbor + diferencial) o fijo, y simula
            cuánto cambiará en la próxima revisión.
          </p>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {[
              { href: "/", label: "Inicio" },
              { href: "/herramientas", label: "Herramientas" },
              { href: "/bancos", label: "Bancos" },
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

        <MortgageCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Notas importantes</h2>
          <ul>
            <li>
              El cálculo usa el sistema de amortización francés e ignora comisiones, seguros,
              impuestos y cláusulas suelo.
            </li>
            <li>
              El euríbor por defecto (3,29 %) es la media de noviembre de 2026. Consulta el
              valor actual en nuestro{" "}
              <Link href="/blog/euribor-noviembre-2026-revision-hipoteca-variable">
                análisis del euríbor de noviembre
              </Link>
              .
            </li>
            <li>
              Si estás decidiendo entre fija, variable o mixta, lee la{" "}
              <Link href="/blog/guia-hipotecas-2026">guía de hipotecas 2026</Link>.
            </li>
          </ul>
        </section>
      </Container>
    </section>
  );
}
