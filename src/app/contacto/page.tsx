import type { Metadata } from "next";

import ContactoClient from "./ContactoClient";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = `Contacto | ${SITE_NAME}`;
const DESCRIPTION =
  "Cuéntanos tu caso (viajes, freelancer, empresa, cuenta principal) y te orientamos con una respuesta clara. Gratis y sin humo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/contacto",
    languages: {
      es: "/contacto",
      en: "/en/contacto",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/contacto`,
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function ContactoPage() {
  const pageUrl = `${SITE_URL}/contacto`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Contacto", item: pageUrl },
    ],
  };

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#contact`,
    url: pageUrl,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "es-ES",
    about: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(contactPageJsonLd) }}
      />
      <ContactoClient />
    </>
  );
}
