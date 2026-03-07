import type { Metadata } from "next";

import EbooksClient from "./EbooksClient";
import { ebooks } from "@/lib/ebooks-data";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = `Ebooks y cursos | ${SITE_NAME}`;
const DESCRIPTION =
  "Biblioteca de guías y cursos para tomar mejores decisiones: ahorro, inversión y banca en Europa.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ebooks" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/ebooks`,
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function EbooksPage() {
  const pageUrl = `${SITE_URL}/ebooks`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ebooks", item: pageUrl },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "es-ES",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ebooks.map((ebook, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/ebooks/${encodeURIComponent(ebook.id)}`,
        name: ebook.title,
      })),
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
        dangerouslySetInnerHTML={{ __html: toJsonLd(collectionJsonLd) }}
      />

      <EbooksClient />
    </>
  );
}

