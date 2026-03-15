import type { Metadata } from "next";

import IbanClient from "@/app/iban/IbanClient";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "SEPA IBAN Scanner (free) | FinanzasEU";
const DESCRIPTION =
  "Validate an IBAN in seconds: length, country, SEPA and (when available) the bank. Includes bulk mode, history and a share link/QR.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/iban",
    languages: {
      es: "/iban",
      en: "/en/iban",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/iban`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function IbanPageEn() {
  const pageUrl = `${SITE_URL}/en/iban`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "IBAN Scanner", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "IBAN Scanner",
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
        name: "Does this validator move money or access my bank account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It only validates the IBAN format and shows public information (country, length, SEPA and, when available, the bank).",
        },
      },
      {
        "@type": "Question",
        name: "What does it mean for an IBAN to be SEPA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It means the IBAN belongs to the SEPA area and can be used for SEPA transfers, as long as the bank supports the service and the account is active.",
        },
      },
      {
        "@type": "Question",
        name: "Can I validate multiple IBANs at once?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Enable bulk mode and paste one IBAN per line to validate several at once.",
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

      <IbanClient />
    </section>
  );
}
