import type { Metadata } from "next";

import ComparativaClient from "@/app/comparativa/ComparativaClient";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Bank comparison in Europe (2026) | FinanzasEU";
const DESCRIPTION =
  "Editorial bank comparison to choose with confidence: filter by IBAN, fees, supported countries, multi-currency features and more. Save favorites, compare 1-to-1 and export to PDF.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/en/comparativa" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/comparativa`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
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

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Bank comparison",
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
    inLanguage: "en-US",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is the ranking ordered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can sort by name, country, card type, or monthly fee. Banks with affiliate links may appear first; this is clearly labeled in the UI and disclosed on the affiliate notice page.",
        },
      },
      {
        "@type": "Question",
        name: "Is PDF export free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can export the comparison table to PDF directly from the page at no cost.",
        },
      },
      {
        "@type": "Question",
        name: "Can the data change?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Conditions (fees, IBAN, requirements) can change over time. Always confirm on the official website before opening an account.",
        },
      },
    ],
  };

  return (
    <>
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

      <ComparativaClient />
    </>
  );
}

