import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ComparisonHubClient from "@/components/sections/comparar/ComparisonHubClient";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Bank Comparison Hub 2026: Head-to-Head Duels | FinanzasEU";
const DESCRIPTION =
  "Compare Revolut vs Wise, N26 vs Revolut, Trade Republic vs MyInvestor and more. Compare fees, IBANs, yields and card perks side by side.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/comparativa",
    languages: {
      es: "/comparativa",
      en: "/en/comparativa",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/comparativa`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
};

export default function ComparativaPageEn() {
  const pageUrl = `${SITE_URL}/en/comparativa`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Comparison", item: pageUrl },
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

