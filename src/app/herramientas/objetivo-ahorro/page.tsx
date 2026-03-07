import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import SavingsGoalCalculator from "@/components/tools/SavingsGoalCalculator";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Calculadora de objetivo de ahorro (aportación mensual) | FinanzasEU";
const DESCRIPTION =
  "Calcula cuánto aportar al mes para llegar a un objetivo en X años con una rentabilidad esperada. Incluye tabla anual y enlace para compartir.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/herramientas/objetivo-ahorro" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/herramientas/objetivo-ahorro`,
    type: "website",
    locale: "es_ES",
  },
};

export default function ObjetivoAhorroPage() {
  const pageUrl = `${SITE_URL}/herramientas/objetivo-ahorro`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Herramientas", item: `${SITE_URL}/herramientas` },
      { "@type": "ListItem", position: 3, name: "Objetivo de ahorro", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Calculadora de objetivo de ahorro",
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
        name: "¿Qué rentabilidad debo poner?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Usa una estimación conservadora. La calculadora sirve para planificar escenarios, no garantiza resultados ni sustituye asesoramiento.",
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué cambia si aporto al inicio o al final del mes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aportar antes permite que el dinero esté más tiempo invertido y capitalice un poco más. La diferencia suele ser pequeña, pero existe.",
        },
      },
      {
        "@type": "Question",
        name: "¿Incluye comisiones o impuestos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Es una proyección simple. En productos reales pueden existir comisiones, fiscalidad y límites.",
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
            Objetivo de{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              ahorro
            </span>
            .
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            ¿Cuánto aportar al mes para llegar a una meta en un plazo concreto? Proyección
            simple con tabla anual y enlace para compartir.
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

        <SavingsGoalCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Notas importantes</h2>
          <ul>
            <li>Proyección educativa: no es asesoramiento financiero.</li>
            <li>
              Si tu objetivo es elegir banco/cuenta, usa también la{" "}
              <a href="/comparativa">comparativa de bancos</a>.
            </li>
          </ul>
        </section>
      </Container>
    </section>
  );
}

