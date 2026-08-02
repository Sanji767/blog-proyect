import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ComparisonHubClient from "@/components/sections/comparar/ComparisonHubClient";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Comparativa de bancos en Europa 2026: Duelos Cara a Cara | FinanzasEU";
const DESCRIPTION =
  "Compara Revolut vs Wise, N26 vs Revolut, Trade Republic vs MyInvestor y más. Analiza comisiones, IBAN, rentabilidad y ventajas cara a cara.";

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
