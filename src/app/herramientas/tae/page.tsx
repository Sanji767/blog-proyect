import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import TaeCalculator from "@/components/tools/TaeCalculator";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Calculadora TAE (desde TIN) | FinanzasEU";
const DESCRIPTION =
  "Convierte TIN a TAE según la capitalización (mensual, trimestral, anual) y estima el interés anual. Incluye comisión fija opcional y enlace para compartir.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/herramientas/tae" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/herramientas/tae`,
    type: "website",
    locale: "es_ES",
  },
};

export default function TaePage() {
  const pageUrl = `${SITE_URL}/herramientas/tae`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Herramientas", item: `${SITE_URL}/herramientas` },
      { "@type": "ListItem", position: 3, name: "TAE", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Calculadora TAE",
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
        name: "¿Qué diferencia hay entre TIN y TAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El TIN es el tipo nominal. La TAE refleja el tipo efectivo anual teniendo en cuenta la capitalización (y, en algunos casos, comisiones).",
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué cambia la TAE si capitaliza mensual o anual?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cuanto más frecuente sea la capitalización, mayor suele ser el tipo efectivo, porque los intereses generan intereses más veces al año.",
        },
      },
      {
        "@type": "Question",
        name: "¿Incluye impuestos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Es un cálculo educativo. La fiscalidad depende del país y del producto.",
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
            Calculadora{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              TAE
            </span>
            .
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Convierte TIN a TAE según la capitalización y estima el interés anual (con comisión
            fija opcional).
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

        <TaeCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Notas importantes</h2>
          <ul>
            <li>Las cuentas reales pueden incluir tramos, límites y condiciones.</li>
            <li>Usa la TAE como referencia comparativa, no como promesa.</li>
          </ul>
        </section>
      </Container>
    </section>
  );
}

