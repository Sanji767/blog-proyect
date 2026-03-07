import type { Metadata } from "next";

import IbanClient from "./IbanClient";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "IBAN Scanner SEPA (gratis) | FinanzasEU";
const DESCRIPTION =
  "Valida un IBAN en segundos: longitud, país, SEPA y entidad (cuando aplica). Incluye modo bulk, historial y enlace/QR para compartir.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/iban" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/iban`,
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function IbanPage() {
  const pageUrl = `${SITE_URL}/iban`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
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
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Este validador mueve dinero o accede a tu cuenta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Solo valida el formato del IBAN y muestra información pública (país, longitud, SEPA y, cuando aplica, entidad).",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué significa que un IBAN sea SEPA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Significa que pertenece al área SEPA y puede usarse en transferencias SEPA, siempre que el banco soporte el servicio y la cuenta esté operativa.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo validar varios IBAN a la vez?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Activa el modo bulk y pega un IBAN por línea para revisar varios de una vez.",
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

