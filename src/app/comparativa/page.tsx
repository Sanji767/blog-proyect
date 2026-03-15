import type { Metadata } from "next";

import ComparativaClient from "./ComparativaClient";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Comparativa de bancos en Europa (2026) | FinanzasEU";
const DESCRIPTION =
  "Comparador editorial para elegir banco con criterio: filtra por IBAN, comisiones, soporte en español, multidivisa y más. Guarda favoritos, compara 1 a 1 y exporta a PDF.";

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
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
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

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Comparativa de bancos",
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
        name: "¿Cómo se ordena la comparativa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Puedes ordenar por nombre, país, tipo de tarjeta o cuota mensual. Además, los bancos con enlace de afiliado pueden aparecer primero; se indica en la interfaz y en el aviso de afiliados.",
        },
      },
      {
        "@type": "Question",
        name: "¿La exportación a PDF es gratuita?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Puedes exportar la tabla a PDF desde la propia página sin coste.",
        },
      },
      {
        "@type": "Question",
        name: "¿Los datos pueden cambiar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Las condiciones (comisiones, IBAN, requisitos) pueden variar. Contrasta siempre con la web oficial antes de abrir una cuenta.",
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
