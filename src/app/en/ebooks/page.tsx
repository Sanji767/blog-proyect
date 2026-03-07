import type { Metadata } from "next";

import EbooksClient from "@/app/ebooks/EbooksClient";
import { ebooks } from "@/lib/ebooks-data";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = `Ebooks & courses | ${SITE_NAME}`;
const DESCRIPTION =
  "A library of guides and courses to make better decisions: saving, investing and banking in Europe.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/en/ebooks" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/ebooks`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function EbooksPageEn() {
  const pageUrl = `${SITE_URL}/en/ebooks`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
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
    inLanguage: "en-US",
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
        url: `${SITE_URL}/en/ebooks/${encodeURIComponent(ebook.id)}`,
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

