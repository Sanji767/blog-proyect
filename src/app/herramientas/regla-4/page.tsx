import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import FourPercentRuleCalculator from "@/components/tools/FourPercentRuleCalculator";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Calculadora regla del 4% (FIRE) | FinanzasEU";
const DESCRIPTION =
  "Calcula el capital objetivo aproximado para sostener un gasto anual según la regla del 4% (safe withdrawal rate). Enlace para compartir.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/herramientas/regla-4" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/herramientas/regla-4`,
    type: "website",
    locale: "es_ES",
  },
};

export default function Regla4Page() {
  const pageUrl = `${SITE_URL}/herramientas/regla-4`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Herramientas", item: `${SITE_URL}/herramientas` },
      { "@type": "ListItem", position: 3, name: "Regla del 4%", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Calculadora regla del 4%",
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
        name: "¿Qué es la regla del 4%?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Es una regla orientativa que estima cuánto capital necesitarías para retirar aproximadamente un 4% al año y financiar gastos, basada en estudios históricos. No garantiza resultados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo usar 3% o 3,5% en lugar de 4%?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Usar una tasa de retirada menor suele ser más conservador (requiere más capital). Ajusta el porcentaje según tu tolerancia al riesgo y horizonte.",
        },
      },
      {
        "@type": "Question",
        name: "¿Incluye impuestos o inflación?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Es un cálculo simple. Para proyecciones más completas, combina esta herramienta con las calculadoras de interés compuesto e inflación.",
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
            Regla del{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              4%
            </span>
            .
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Calcula el capital objetivo para sostener un gasto anual con una tasa de retirada.
            Útil para estimaciones FIRE, con cautela.
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

        <FourPercentRuleCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Notas importantes</h2>
          <ul>
            <li>Regla orientativa basada en datos históricos.</li>
            <li>
              Para proyecciones, combina con{" "}
              <a href="/herramientas/interes-compuesto">interés compuesto</a> e{" "}
              <a href="/herramientas/inflacion">inflación</a>.
            </li>
          </ul>
        </section>
      </Container>
    </section>
  );
}

