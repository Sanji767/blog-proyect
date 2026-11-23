import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ComparisonHubClient from "@/components/sections/comparar/ComparisonHubClient";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Comparativa de bancos en Europa 2026: Duelos Cara a Cara";
const DESCRIPTION =
  "Ranking de cuentas remuneradas 2026 por tipo estándar en euros, y duelos cara a cara: Revolut vs Wise, Revolut vs N26, Revolut vs Trade Republic y más. Compara comisiones, IBAN y rentabilidad.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/comparativa",
    languages: {
      es: "/comparativa",
      en: "/en/comparativa",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/comparativa`,
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
  },
};

export default function ComparativaPage() {
  const pageUrl = `${SITE_URL}/comparativa`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Comparativa", item: pageUrl },
    ],
  };

  return (
    <main className="py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <Container>
        <ComparisonHubClient />
      </Container>
    </main>
  );
}
