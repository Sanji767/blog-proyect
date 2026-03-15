import type { Metadata } from "next";

import ContactoClient from "@/app/contacto/ContactoClient";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = `Contact | ${SITE_NAME}`;
const DESCRIPTION =
  "Tell us your situation (travel, freelancer, business, main account) and we’ll point you in the right direction with a clear answer. Free and no fluff.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/contacto",
    languages: {
      es: "/contacto",
      en: "/en/contacto",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/contacto`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function ContactoPageEn() {
  const pageUrl = `${SITE_URL}/en/contacto`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Contact", item: pageUrl },
    ],
  };

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#contact`,
    url: pageUrl,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en-US",
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
